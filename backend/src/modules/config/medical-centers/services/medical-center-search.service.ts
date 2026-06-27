import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalCenter } from '../entities/medical-center.entity';

@Injectable()
export class MedicalCenterSearchService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(MedicalCenter)
    private repository: Repository<MedicalCenter>,
  ) {}

  async execute(query: string): Promise<MedicalCenter[]> {
    try {
      // Búsqueda liviana para autocomplete - máximo 10 resultados
      return await this.repository.find({
        where: [
          { name: ILike(`%${query}%`), isActive: true },
          { state: ILike(`%${query}%`), isActive: true },
          { municipality: ILike(`%${query}%`), isActive: true },
        ],
        order: { name: 'ASC' },
        take: 10,
        select: ['id', 'name', 'state', 'municipality'],
      });
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Búsqueda de Centros Médicos');
    }
  }
}
