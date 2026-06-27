import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalCenter } from '../entities/medical-center.entity';

@Injectable()
export class MedicalCenterListService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(MedicalCenter)
    private repository: Repository<MedicalCenter>,
  ) {}

  async execute(): Promise<MedicalCenter[]> {
    try {
      return await this.repository.find({
        where: { isActive: true },
        order: { name: 'ASC' },
        select: ['id', 'name', 'state', 'municipality'],
      });
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Lista de Centros Médicos');
    }
  }
}
