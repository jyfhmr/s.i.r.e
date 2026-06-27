import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalCenter } from '../entities/medical-center.entity';

@Injectable()
export class MedicalCenterChangeStatusUseCase {
  constructor(private helpersService: HelpersService) {}

  async execute(id: number, externalQR?: QueryRunner) {
    return await this.helpersService.runInTransaction(async (queryRunner) => {
      const medicalCenter = await this.helpersService.searchFindOneById(
        MedicalCenter,
        id,
        'Centro Médico',
        queryRunner,
      );

      medicalCenter.isActive = !medicalCenter.isActive;

      await queryRunner.manager.save(medicalCenter);

      return {
        message: '¡Cambio de estatus realizado con éxito!',
        id: medicalCenter.id,
        newStatus: medicalCenter.isActive,
      };
    }, externalQR);
  }
}
