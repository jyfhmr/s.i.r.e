import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { Patient } from '@/modules/medical/patients/entities/patient.entity';
import { MedicalCenter } from '@/modules/config/medical-centers/entities/medical-center.entity';
import { IPublicStatsResponse } from '@shared/core/public/stats/interfaces';

@Injectable()
export class PublicStatsService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(MedicalCenter)
    private medicalCenterRepository: Repository<MedicalCenter>,
  ) {}

  async getStats(): Promise<IPublicStatsResponse> {
    try {
      const totalPatients = await this.patientRepository.count();

      const totalMedicalCenters = await this.medicalCenterRepository.count({
        where: { isActive: true },
      });

      // Distribución por estatus usando query builder para contar agrupado
      const patientsByStatusRaw = await this.patientRepository
        .createQueryBuilder('patient')
        .select('patient.currentStatus', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('patient.currentStatus')
        .getRawMany();

      const patientsByStatus = patientsByStatusRaw.map((row) => ({
        status: row.status,
        count: parseInt(row.count, 10),
      }));

      return {
        totalPatients,
        totalMedicalCenters,
        patientsByStatus,
        lastUpdated: new Date(),
      };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Estadísticas públicas');
    }
  }
}
