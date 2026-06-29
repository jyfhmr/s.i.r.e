import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicStatsController } from './public-stats.controller';
import { PublicStatsService } from './public-stats.service';
import { HelpersService } from '@/helpers/helpers.service';
import { Patient } from '@/modules/medical/patients/entities/patient.entity';
import { MedicalCenter } from '@/modules/config/medical-centers/entities/medical-center.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, MedicalCenter])],
  controllers: [PublicStatsController],
  providers: [PublicStatsService, HelpersService],
})
export class PublicStatsModule {}
