import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { Patient } from '../entities/patient.entity';
import { PatientStatusLog } from '../entities/patient-status-log.entity';
import { BulkImportPatientItemDto } from '../dto/bulk-import-patient.dto';
import { RegistrationSource } from '@shared/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface BulkImportResult {
  total: number;
  created: number;
  updated: number;
  errors: Array<{
    dni: string;
    fullName: string;
    error: string;
  }>;
}

@Injectable()
export class PatientBulkImportUseCase {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(
    patients: BulkImportPatientItemDto[],
    currentUserId: number,
  ): Promise<BulkImportResult> {
    // 1. Validar duplicados dentro del mismo lote
    const duplicateErrors = this.detectInternalDuplicates(patients);
    const validPatients = patients.filter((p) => !duplicateErrors.some((e) => e.dni === p.dni));

    const result: BulkImportResult = {
      total: patients.length,
      created: 0,
      updated: 0,
      errors: [...duplicateErrors],
    };

    if (validPatients.length === 0) {
      return result;
    }

    // 2. Procesar cada paciente válido en una transacción
    await this.helpersService.runInTransaction(async (queryRunner) => {
      for (const dto of validPatients) {
        try {
          // Buscar si el paciente ya existe por DNI
          let patient = await queryRunner.manager.findOne(Patient, {
            where: { dni: dto.dni },
          });

          const isNewPatient = !patient;

          if (isNewPatient) {
            // Crear nuevo paciente
            patient = queryRunner.manager.create(Patient, {
              dni: dto.dni,
              fullName: dto.fullName,
              currentStatus: dto.status,
              currentMedicalCenterId: dto.medicalCenterId || null,
              manualLocation: dto.manualLocation || null,
              lastUpdatedBy: currentUserId,
              lastUpdatedAt: new Date(),
              registrationSource: RegistrationSource.PUBLIC_LIST,
            });

            await queryRunner.manager.save(patient);
            result.created++;
          } else {
            // Actualizar paciente existente
            // No se toca registrationSource para preservar el valor original
            patient.currentStatus = dto.status;
            patient.currentMedicalCenterId = dto.medicalCenterId || null;
            patient.manualLocation = dto.manualLocation || null;
            patient.lastUpdatedBy = currentUserId;
            patient.lastUpdatedAt = new Date();

            await queryRunner.manager.save(patient);
            result.updated++;
          }

          // 3. BITÁCORA INMUTABLE: Siempre crear un registro de log
          const statusLog = queryRunner.manager.create(PatientStatusLog, {
            patientId: patient.id,
            status: dto.status,
            medicalCenterId: dto.medicalCenterId || null,
            manualLocation: dto.manualLocation || null,
            updatedBy: currentUserId,
          });

          await queryRunner.manager.save(statusLog);
        } catch (error: any) {
          // Error al procesar este paciente individual
          result.errors.push({
            dni: dto.dni,
            fullName: dto.fullName,
            error: error.message || 'Error desconocido al procesar el paciente',
          });
        }
      }
    });

    // 4. Emitir evento para cada paciente procesado exitosamente (fuera de la transacción)
    // Esto dispara la lógica de "cédula vigilada" para civiles que tengan esta cédula en su watchlist
    for (const dto of validPatients) {
      const wasError = result.errors.some((e) => e.dni === dto.dni);
      if (!wasError) {
        this.eventEmitter.emit('patient.updated', {
          dni: dto.dni,
          fullName: dto.fullName,
          status: dto.status,
          location: dto.manualLocation || 'Importación masiva',
          updatedAt: new Date(),
        });
      }
    }

    return result;
  }

  /**
   * Detecta DNIs duplicados dentro del mismo lote de importación.
   * Si dos o más registros tienen el mismo DNI, se marcan TODOS como error.
   */
  private detectInternalDuplicates(patients: BulkImportPatientItemDto[]): Array<{
    dni: string;
    fullName: string;
    error: string;
  }> {
    const seen = new Map<string, number>();
    const errors: Array<{ dni: string; fullName: string; error: string }> = [];

    // Primera pasada: contar frecuencias
    for (const p of patients) {
      seen.set(p.dni, (seen.get(p.dni) || 0) + 1);
    }

    // Segunda pasada: marcar como error los que tengan más de 1 ocurrencia
    for (const p of patients) {
      if ((seen.get(p.dni) || 0) > 1) {
        errors.push({
          dni: p.dni,
          fullName: p.fullName,
          error: `DNI duplicado en el lote de importación (${seen.get(p.dni)} veces).`,
        });
      }
    }

    return errors;
  }
}
