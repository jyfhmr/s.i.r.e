import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { Patient } from '../entities/patient.entity';
import { PatientStatusLog } from '../entities/patient-status-log.entity';
import { UpsertPatientDto } from '../dto/upsert-patient.dto';
import { User } from '@/modules/config/users/entities/user.entity';
import { MedicalCenter } from '@/modules/config/medical-centers/entities/medical-center.entity';
import { RegistrationSource } from '@shared/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PatientUpsertUseCase {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: UpsertPatientDto, currentUserId: number, externalQR?: QueryRunner) {
    return await this.helpersService.runInTransaction(async (queryRunner) => {
      // 1. Verificar que el usuario actual (médico) existe
      const currentUser = await this.helpersService.searchFindOneById(
        User,
        currentUserId,
        'Usuario actual',
        queryRunner,
        ['profile'],
      );

      // 2. Si se proporciona medicalCenterId, verificar que existe
      let medicalCenter: MedicalCenter | null = null;
      if (dto.medicalCenterId) {
        medicalCenter = await this.helpersService.searchFindOneById(
          MedicalCenter,
          dto.medicalCenterId,
          'Centro Médico',
          queryRunner,
        );
      }

      // 3. Buscar si el paciente ya existe por DNI
      let patient = await queryRunner.manager.findOne(Patient, {
        where: { dni: dto.dni },
      });

      const isNewPatient = !patient;

      if (isNewPatient) {
        // ESCENARIO A: Crear nuevo paciente
        // Se hardcodea MEDICAL_STAFF porque en este flujo solo personal médico crea pacientes
        patient = queryRunner.manager.create(Patient, {
          dni: dto.dni,
          fullName: dto.fullName,
          currentStatus: dto.status,
          currentMedicalCenterId: dto.medicalCenterId || null,
          manualLocation: dto.manualLocation || null,
          lastUpdatedBy: currentUserId,
          lastUpdatedAt: new Date(),
          registrationSource: RegistrationSource.MEDICAL_STAFF,
        });

        await queryRunner.manager.save(patient);
      } else {
        // ESCENARIO B: Actualizar paciente existente
        // NOTA: No se toca registrationSource para preservar el valor original
        patient.currentStatus = dto.status;
        patient.currentMedicalCenterId = dto.medicalCenterId || null;
        patient.manualLocation = dto.manualLocation || null;
        patient.lastUpdatedBy = currentUserId;
        patient.lastUpdatedAt = new Date();

        await queryRunner.manager.save(patient);
      }

      // 4. BITÁCORA INMUTABLE: Siempre crear un registro de log
      const statusLog = queryRunner.manager.create(PatientStatusLog, {
        patientId: patient.id,
        status: dto.status,
        medicalCenterId: dto.medicalCenterId || null,
        manualLocation: dto.manualLocation || null,
        updatedBy: currentUserId,
      });

      await queryRunner.manager.save(statusLog);

      // 5. TRIGGER DE ALERTA: Emitir evento para notificar a civiles con esta cédula en su watchlist
      // Este evento será manejado por un listener que enviará correos
      this.eventEmitter.emit('patient.updated', {
        dni: patient.dni,
        fullName: patient.fullName,
        status: dto.status,
        location: medicalCenter?.name || dto.manualLocation,
        updatedAt: new Date(),
      });

      return {
        message: isNewPatient
          ? '¡Paciente registrado exitosamente!'
          : '¡Información del paciente actualizada exitosamente!',
        id: patient.id,
        dni: patient.dni,
        isNewPatient,
      };
    }, externalQR);
  }
}
