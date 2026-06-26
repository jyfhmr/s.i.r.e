// src/modules/config/profiles/services/profile-find-all.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Like, Raw, Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { HelpersService } from '@/helpers/helpers.service';
import { IProfileFilter, IProfilePaginatedResponse } from '@shared/core/config/profiles/interfaces';

@Injectable()
export class ProfileFindAllService {
  constructor(
    private helpersService: HelpersService,

    @InjectRepository(Profile)
    private repository: Repository<Profile>,
  ) {}

  async execute(query: IProfileFilter): Promise<IProfilePaginatedResponse> {
    const take = Number(query.rows) || 5;
    const skip = query.page ? (Number(query.page) - 1) * take : 0;
    const order = 'DESC'; // Podrías parametrizarlo si lo necesitas

    try {
      const where: FindOptionsWhere<Profile> = {};

      // Filtros dinámicos
      if (query.id) {
        where.id = Raw((id) => `CAST(${id} as char) Like '%${query.id}%'`);
      }

      if (query.name) {
        where.name = Like(`%${query.name}%`);
      }

      if (query.isActive !== undefined) {
        where.isActive = query.isActive === 'true';
      }

      // Filtro por rango de fechas
      let dateRange: any;
      if (query.updatedAt) {
        const dates = query.updatedAt.split(',');
        if (dates.length === 2) {
          dateRange = Between(new Date(dates[0]), new Date(dates[1]));
          where.updatedAt = dateRange;
        }
      } else if (query.createdAt) {
        const dates = query.createdAt.split(',');
        if (dates.length === 2) {
          dateRange = Between(new Date(dates[0]), new Date(dates[1]));
          where.createdAt = dateRange;
        }
      }

      const [totalRows, data] = await Promise.all([
        this.repository.count({ where }),
        this.repository.find({
          where,
          order: { id: order as any },
          take,
          skip,
          withDeleted: true,
        }),
      ]);

      return { totalRows, data };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Listado de Perfiles');
    }
  }
}
