import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalCenter } from '../entities/medical-center.entity';
import { UpdateMedicalCenterDto } from '../dto/update-medical-center.dto';
import { User } from '@/modules/config/users/entities/user.entity';

@Injectable()
export class MedicalCenterUpdateUseCase {
  constructor(private helpersService: HelpersService) {}

  async execute(
    id: number,
    dto: UpdateMedicalCenterDto,
    currentUserId: number,
    externalQR?: QueryRunner,
  ) {
    return await this.helpersService.runInTransaction(async (queryRunner) => {
      // Verificar que el usuario actual existe
      await this.helpersService.searchFindOneById(
        User,
        currentUserId,
        'Usuario actual',
        queryRunner,
        ['profile'],
      );

      // Buscar el centro médico a actualizar
      const medicalCenter = await this.helpersService.searchFindOneById(
        MedicalCenter,
        id,
        'Centro Médico',
        queryRunner,
      );

      // Actualizar campos
      Object.assign(medicalCenter, dto);

      await queryRunner.manager.save(medicalCenter);

      return {
        message: '¡Centro Médico actualizado con éxito!',
        id: medicalCenter.id,
      };
    }, externalQR);
  }
}
