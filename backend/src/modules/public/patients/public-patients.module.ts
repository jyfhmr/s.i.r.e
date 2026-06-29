import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicPatientsController } from './public-patients.controller';
import { PublicPatientsService } from './public-patients.service';
import { HelpersService } from '@/helpers/helpers.service';
import { Patient } from '@/modules/medical/patients/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PublicPatientsController],
  providers: [PublicPatientsService, HelpersService],
})
export class PublicPatientsModule {}
