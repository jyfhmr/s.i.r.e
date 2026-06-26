import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { StatusController } from './status.controller';
import { UsersModule } from '../users/users.module';

// Import Services
import { StatusFindAllService } from './services/status-find-all.service';
import { StatusFindOneService } from './services/status-find-one.service';

// Import Use Cases
import { StatusCreateUseCase } from './use-cases/status-create.use-case';
import { StatusUpdateUseCase } from './use-cases/status-update.use-case';
import { StatusChangeStatusUseCase } from './use-cases/status-change-status.use-case';
import { StatusExporterService } from './services/status-exporter.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Status]),
        UsersModule, // Necesario para inyectar UsersService en los UseCases
    ],
    controllers: [StatusController],
    providers: [
        // Services
        StatusFindAllService,
        StatusFindOneService,
        StatusExporterService,
        // Use Cases
        StatusCreateUseCase,
        StatusUpdateUseCase,
        StatusChangeStatusUseCase,
    ],
    exports: [
        StatusFindOneService, // Por si alguien necesita validar status
    ],
})
export class StatusModule {}
