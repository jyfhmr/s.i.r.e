import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalCenter } from '../entities/medical-center.entity';

@Injectable()
export class MedicalCenterFindOneService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(MedicalCenter)
    private repository: Repository<MedicalCenter>,
  ) {}

  async execute(id: number): Promise<MedicalCenter> {
    try {
      const medicalCenter = await this.repository.findOne({
        where: { id },
      });

      if (!medicalCenter) {
        throw new Error('Centro Médico no encontrado');
      }

      return medicalCenter;
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Búsqueda de Centro Médico');
    }
  }
}
