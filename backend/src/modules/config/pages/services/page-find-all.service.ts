import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Like, Raw, Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { Page } from '../entities/page.entity';
import { IPageFilter, IPageListResponse } from '@shared/core/config/pages/interfaces';

@Injectable()
export class PageFindAllService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(Page)
    private repository: Repository<Page>,
  ) {}

  async execute(query: IPageFilter): Promise<IPageListResponse> {
    const take = Number(query.rows) || 5;
    const skip = query.page ? (Number(query.page) - 1) * take : 0;
    const order = query.order || 'DESC';

    try {
      const where: FindOptionsWhere<Page> = {};

      // Filtros dinámicos
      if (query.id) {
        where.id = Raw((id) => `CAST(${id} as char) Like '%${query.id}%'`);
      }

      if (query.name) {
        where.name = Like(`%${query.name}%`);
      }

      if (query.pageFather) {
        where.pageFather = {
          name: Like(`%${query.pageFather}%`),
        };
      }

      if (query.isActive !== undefined) {
        where.isActive = query.isActive === 'true' || query.isActive === true;
      }

      // Filtro por rango de fechas
      if (query.updatedAt) {
        const dates = query.updatedAt.split(',');
        if (dates.length === 2) {
          where.updatedAt = Between(new Date(dates[0]), new Date(dates[1]));
        }
      } else if (query.createdAt) {
        const dates = query.createdAt.split(',');
        if (dates.length === 2) {
          where.createdAt = Between(new Date(dates[0]), new Date(dates[1]));
        }
      }

      // ⚠️ CORRECCIÓN: findAndCount devuelve [data, total], NO [total, data]
      const [data, totalRows] = await this.repository.findAndCount({
        where,
        relations: {
          pageFather: true,
        },
        order: { id: order },
        take: query.export ? undefined : take,
        skip: query.export ? undefined : skip,
      });

      return { totalRows, data };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Listado de Páginas');
    }
  }
}
