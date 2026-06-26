// src/modules/config/pages/use-cases/page-change-status.use-case.ts
import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { PageFindOneService } from '../services/page-find-one.service';

@Injectable()
export class PageChangeStatusUseCase {
    constructor(
        private helpersService: HelpersService,
        private findOneService: PageFindOneService
    ) {}

    async execute(id: number, externalQR?: QueryRunner) {
        return await this.helpersService.runInTransaction(async queryRunner => {
            // 1. Buscar la página
            const page = await this.findOneService.execute(id);

            // 2. Cambiar el estatus
            page.isActive = !page.isActive;

            await queryRunner.manager.save(page);

            return {
                message: '¡Cambio de estatus realizado con éxito!',
                id: page.id,
                isActive: page.isActive,
            };
        }, externalQR);
    }
}
