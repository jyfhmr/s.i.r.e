import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsController } from './alerts.controller';
import { WatchListItem } from './entities/watch-list-item.entity';
import { HelpersService } from '@/helpers/helpers.service';

// Use Cases
import { AlertCreateUseCase } from './use-cases/alert-create.use-case';
import { AlertDeleteUseCase } from './use-cases/alert-delete.use-case';

// Services
import { AlertFindAllService } from './services/alert-find-all.service';

// Listeners
import { PatientAlertListener } from './listeners/patient-alert.listener';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([WatchListItem])],
  controllers: [AlertsController],
  providers: [
    HelpersService,

    // Use Cases
    AlertCreateUseCase,
    AlertDeleteUseCase,

    // Services
    AlertFindAllService,

    // Listeners
    PatientAlertListener,
  ],
  exports: [],
})
export class AlertsModule {}
