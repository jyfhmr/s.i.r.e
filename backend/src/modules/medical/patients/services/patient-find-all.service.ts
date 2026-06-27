import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { Patient } from '../entities/patient.entity';
import { IPatientFilter } from '@shared/core/medical/patients/interfaces';

@Injectable()
export class PatientFindAllService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(Patient)
    private repository: Repository<Patient>,
  ) {}

  async execute(
    query: IPatientFilter,
    currentUserId: number,
  ): Promise<{ data: Patient[]; total: number }> {
    const take = Number(query.rows) || 10;
    const skip = query.page ? (Number(query.page) - 1) * take : 0;

    try {
      const where: FindOptionsWhere<Patient> = {
        // REGLA CRÍTICA: Solo visualiza pacientes que este médico haya registrado o actualizado
        lastUpdatedBy: currentUserId,
      };

      // Filtros dinámicos adicionales
      if (query.dni) {
        where.dni = ILike(`%${query.dni}%`);
      }

      if (query.fullName) {
        where.fullName = ILike(`%${query.fullName}%`);
      }

      if (query.status) {
        where.currentStatus = query.status;
      }

      if (query.createdAt) {
        const [startDate, endDate] = query.createdAt.split(',');
        where.createdAt = Between(new Date(startDate), new Date(endDate)) as any;
      }

      if (query.updatedAt) {
        const [startDate, endDate] = query.updatedAt.split(',');
        where.updatedAt = Between(new Date(startDate), new Date(endDate)) as any;
      }

      const [data, total] = await this.repository.findAndCount({
        where,
        relations: {
          currentMedicalCenter: true,
        },
        order: { lastUpdatedAt: 'DESC' },
        take: query.export ? undefined : take,
        skip: query.export ? undefined : skip,
      });

      return { data, total };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Listado de Pacientes');
    }
  }
}
