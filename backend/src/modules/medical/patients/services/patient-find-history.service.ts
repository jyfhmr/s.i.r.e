import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { PatientStatusLog } from '../entities/patient-status-log.entity';

@Injectable()
export class PatientFindHistoryService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(PatientStatusLog)
    private repository: Repository<PatientStatusLog>,
  ) {}

  async execute(patientId: number): Promise<PatientStatusLog[]> {
    try {
      return await this.repository.find({
        where: { patientId },
        relations: {
          medicalCenter: true,
          // NO traemos updatedByUser para proteger identidad del personal
        },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Historial de Paciente');
    }
  }
}
