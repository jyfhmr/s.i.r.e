import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalCenter } from '@/modules/config/medical-centers/entities/medical-center.entity';

@Injectable()
export class PublicMedicalCentersService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(MedicalCenter)
    private repository: Repository<MedicalCenter>,
  ) {}

  async findAll(): Promise<MedicalCenter[]> {
    try {
      return await this.repository.find({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Listado público de Centros Médicos');
    }
  }

  async findOne(id: number): Promise<MedicalCenter> {
    try {
      const medicalCenter = await this.repository.findOne({
        where: { id, isActive: true },
      });

      if (!medicalCenter) {
        throw new Error('Centro Médico no encontrado');
      }

      return medicalCenter;
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Búsqueda pública de Centro Médico');
    }
  }
}
