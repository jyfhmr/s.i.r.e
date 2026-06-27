import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalCenter } from '../entities/medical-center.entity';
import { IMedicalCenterFilter } from '@shared/core/config/medical-centers/interfaces';

@Injectable()
export class MedicalCenterFindAllService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(MedicalCenter)
    private repository: Repository<MedicalCenter>,
  ) {}

  async execute(query: IMedicalCenterFilter): Promise<{ data: MedicalCenter[]; total: number }> {
    const take = Number(query.rows) || 10;
    const skip = query.page ? (Number(query.page) - 1) * take : 0;

    try {
      const where: FindOptionsWhere<MedicalCenter> = {};

      // Filtros dinámicos
      if (query.name) {
        where.name = ILike(`%${query.name}%`);
      }

      if (query.state) {
        where.state = ILike(`%${query.state}%`);
      }

      if (query.municipality) {
        where.municipality = ILike(`%${query.municipality}%`);
      }

      if (query.isActive !== undefined) {
        where.isActive = query.isActive === 'true' || query.isActive === true;
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
        order: { name: 'ASC' },
        take: query.export ? undefined : take,
        skip: query.export ? undefined : skip,
      });

      return { data, total };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Listado de Centros Médicos');
    }
  }
}
