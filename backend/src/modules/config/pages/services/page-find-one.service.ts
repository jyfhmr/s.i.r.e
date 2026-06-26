// src/modules/config/pages/services/page-find-one.service.ts
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { Page } from '../entities/page.entity';

@Injectable()
export class PageFindOneService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(Page)
    private repository: Repository<Page>,
  ) {}

  async execute(id: number): Promise<Page> {
    try {
      const page = await this.repository.findOne({
        where: { id },
        relations: {
          pageFather: true,
        },
      });

      if (!page) {
        throw new HttpException(`No se encontró la Página con el ID ${id}`, 404);
      }

      return page;
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Consultar Página');
    }
  }
}
