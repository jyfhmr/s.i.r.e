import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicMedicalCentersController } from './public-medical-centers.controller';
import { PublicMedicalCentersService } from './public-medical-centers.service';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalCenter } from '@/modules/config/medical-centers/entities/medical-center.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalCenter])],
  controllers: [PublicMedicalCentersController],
  providers: [PublicMedicalCentersService, HelpersService],
})
export class PublicMedicalCentersModule {}
