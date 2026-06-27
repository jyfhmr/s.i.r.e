import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalCentersController } from './medical-centers.controller';
import { MedicalCenter } from './entities/medical-center.entity';
import { HelpersService } from '@/helpers/helpers.service';

// Use Cases
import { MedicalCenterCreateUseCase } from './use-cases/medical-center-create.use-case';
import { MedicalCenterUpdateUseCase } from './use-cases/medical-center-update.use-case';
import { MedicalCenterChangeStatusUseCase } from './use-cases/medical-center-change-status.use-case';

// Services
import { MedicalCenterFindAllService } from './services/medical-center-find-all.service';
import { MedicalCenterFindOneService } from './services/medical-center-find-one.service';
import { MedicalCenterListService } from './services/medical-center-list.service';
import { MedicalCenterSearchService } from './services/medical-center-search.service';
import { MedicalCenterExportService } from './services/medical-center-export.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([MedicalCenter])],
  controllers: [MedicalCentersController],
  providers: [
    HelpersService,

    // Use Cases
    MedicalCenterCreateUseCase,
    MedicalCenterUpdateUseCase,
    MedicalCenterChangeStatusUseCase,

    // Services
    MedicalCenterFindAllService,
    MedicalCenterFindOneService,
    MedicalCenterListService,
    MedicalCenterSearchService,
    MedicalCenterExportService,
  ],
  exports: [MedicalCenterFindOneService, MedicalCenterListService, MedicalCenterSearchService],
})
export class MedicalCentersModule {}
