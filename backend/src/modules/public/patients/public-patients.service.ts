import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { Patient } from '@/modules/medical/patients/entities/patient.entity';
import {
  IPublicPatientListResponse,
  IPublicPatientResponse,
} from '@shared/core/public/patients/interfaces';

@Injectable()
export class PublicPatientsService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(Patient)
    private repository: Repository<Patient>,
  ) {}

  async findAll(page: number = 1, rows: number = 50): Promise<IPublicPatientListResponse> {
    const take = Math.min(Math.max(rows, 1), 100); // Entre 1 y 100 por página
    const skip = (Math.max(page, 1) - 1) * take;

    try {
      const [patients, total] = await this.repository.findAndCount({
        relations: {
          currentMedicalCenter: true,
        },
        order: { lastUpdatedAt: 'DESC' },
        take,
        skip,
      });

      const data: IPublicPatientResponse[] = patients.map((patient) => ({
        dni: patient.dni,
        fullName: patient.fullName,
        location:
          patient.currentMedicalCenter?.name ||
          patient.manualLocation ||
          'Ubicación no especificada',
        lastUpdated: patient.lastUpdatedAt || patient.createdAt,
        registrationSource: patient.registrationSource || undefined,
      }));

      return {
        data,
        total,
        page,
        rows: take,
      };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Listado público de Pacientes');
    }
  }
}
