import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsController } from './patients.controller';
import { Patient } from './entities/patient.entity';
import { PatientStatusLog } from './entities/patient-status-log.entity';
import { HelpersService } from '@/helpers/helpers.service';

// Use Cases
import { PatientUpsertUseCase } from './use-cases/patient-upsert.use-case';

// Services
import { PatientFindAllService } from './services/patient-find-all.service';
import { PatientSearchByDniService } from './services/patient-search-by-dni.service';
import { PatientFindHistoryService } from './services/patient-find-history.service';
import { PatientExportService } from './services/patient-export.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Patient, PatientStatusLog])],
  controllers: [PatientsController],
  providers: [
    HelpersService,

    // Use Cases
    PatientUpsertUseCase,

    // Services
    PatientFindAllService,
    PatientSearchByDniService,
    PatientFindHistoryService,
    PatientExportService,
  ],
  exports: [PatientSearchByDniService],
})
export class PatientsModule {}
