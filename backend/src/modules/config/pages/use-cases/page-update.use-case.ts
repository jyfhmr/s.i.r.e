// src/modules/config/pages/use-cases/page-update.use-case.ts
import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { UpdatePageDto } from '../dto/update-page.dto';
import { Page } from '../entities/page.entity';
import { User } from '../../users/entities/user.entity';
import { PageFindOneService } from '../services/page-find-one.service';

@Injectable()
export class PageUpdateUseCase {
  constructor(
    private helpersService: HelpersService,
    private findOneService: PageFindOneService,
  ) {}

  async execute(id: number, dto: UpdatePageDto, userId: number, externalQR?: QueryRunner) {
    return await this.helpersService.runInTransaction(async (queryRunner) => {
      // 1. Buscar la página existente
      const page = await this.findOneService.execute(id);

      // 2. Instanciar usuario
      const user = new User();
      user.id = userId;

      // 3. Reordenar páginas si se proporciona orden
      const newOrder = dto.order !== undefined ? Number(dto.order) : null;

      if (newOrder !== null && newOrder !== page.order) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Page)
          .set({ order: () => 'order + 1' })
          .where('order >= :newOrder', { newOrder })
          .execute();
      }

      // 4. Actualizar la página
      page.name = dto.name;
      page.icon = dto.icon || null;
      page.route = dto.route || null;
      page.order = newOrder;

      // Manejar la relación o anularla
      if (dto.pageFather) {
        page.pageFather = { id: dto.pageFather } as Page;
      } else {
        page.pageFather = null;
      }

      await queryRunner.manager.save(page);

      return {
        message: '¡Página editada con éxito!',
        id: page.id,
      };
    }, externalQR);
  }
}
