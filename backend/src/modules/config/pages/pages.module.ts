// src/modules/config/pages/pages.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagesController } from './pages.controller';
import { Page } from './entities/page.entity';
import { HelpersService } from '@/helpers/helpers.service';
import { UsersModule } from '../users/users.module';

// Use Cases
import { PageCreateUseCase } from './use-cases/page-create.use-case';
import { PageUpdateUseCase } from './use-cases/page-update.use-case';
import { PageChangeStatusUseCase } from './use-cases/page-change-status.use-case';

// Services
import { PageFindAllService } from './services/page-find-all.service';
import { PageFindOneService } from './services/page-find-one.service';
import { PageListActiveService } from './services/page-list-active.service';
import { PageExportService } from './helpers/page-export.service';

@Module({
    imports: [TypeOrmModule.forFeature([Page]), UsersModule],
    controllers: [PagesController],
    providers: [
        HelpersService,
        // Use Cases
        PageCreateUseCase,
        PageUpdateUseCase,
        PageChangeStatusUseCase,
        // Services
        PageFindAllService,
        PageFindOneService,
        PageListActiveService,
        PageExportService,
    ],
    exports: [PageFindOneService, PageFindAllService],
})
export class PagesModule {}
