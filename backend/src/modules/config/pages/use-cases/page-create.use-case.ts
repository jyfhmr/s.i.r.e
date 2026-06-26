// src/modules/config/pages/use-cases/page-create.use-case.ts
import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { CreatePageDto } from '../dto/create-page.dto';
import { Page } from '../entities/page.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class PageCreateUseCase {
  constructor(private helpersService: HelpersService) {}

  async execute(dto: CreatePageDto, userId: number, externalQR?: QueryRunner) {
    return await this.helpersService.runInTransaction(async (queryRunner) => {
      // 1. Instanciar usuario (no necesitas hacer un SELECT completo, solo el ID basta para la FK)
      const user = new User();
      user.id = userId;

      // 2. Reordenar páginas si se proporciona orden
      const newOrder = dto.order !== undefined ? Number(dto.order) : null;

      if (newOrder !== null) {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Page)
          .set({ order: () => 'order + 1' })
          .where('order >= :newOrder', { newOrder })
          .execute();
      }

      // 3. Crear la nueva página
      const newPage = queryRunner.manager.create(Page, {
        name: dto.name,
        icon: dto.icon || null,
        route: dto.route || null,
        // Si hay pageFather, le decimos a TypeORM que lo vincule a ese ID
        pageFather: dto.pageFather ? { id: dto.pageFather } : null,
        user: user,
        userUpdate: user,
        order: newOrder,
      });

      await queryRunner.manager.save(newPage);

      return {
        message: '¡Página creada con éxito!',
        id: newPage.id,
      };
    }, externalQR);
  }
}
