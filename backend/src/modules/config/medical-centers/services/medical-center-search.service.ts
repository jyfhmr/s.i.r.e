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
      const term = (query || '').trim();

      // Sin término de búsqueda: devolver los 10 centros más recientes
      if (!term) {
        return await this.repository.find({
          where: { isActive: true },
          order: { createdAt: 'DESC' },
          take: 10,
          select: ['id', 'name', 'state', 'municipality'],
        });
      }

      // Búsqueda liviana para autocomplete - máximo 10 resultados
      return await this.repository.find({
        where: [
          { name: ILike(`%${term}%`), isActive: true },
          { state: ILike(`%${term}%`), isActive: true },
          { municipality: ILike(`%${term}%`), isActive: true },
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
