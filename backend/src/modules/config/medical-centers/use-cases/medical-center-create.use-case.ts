import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalCenter } from '../entities/medical-center.entity';
import { CreateMedicalCenterDto } from '../dto/create-medical-center.dto';
import { User } from '@/modules/config/users/entities/user.entity';

@Injectable()
export class MedicalCenterCreateUseCase {
  constructor(private helpersService: HelpersService) {}

  async execute(dto: CreateMedicalCenterDto, currentUserId: number, externalQR?: QueryRunner) {
    return await this.helpersService.runInTransaction(async (queryRunner) => {
      // Verificar que el usuario actual existe y está activo
      await this.helpersService.searchFindOneById(
        User,
        currentUserId,
        'Usuario actual',
        queryRunner,
        ['profile'],
      );

      // Crear el centro médico
      const newMedicalCenter = queryRunner.manager.create(MedicalCenter, {
        ...dto,
        isActive: true,
      });

      await queryRunner.manager.save(newMedicalCenter);

      return {
        message: '¡Centro Médico creado con éxito!',
        id: newMedicalCenter.id,
      };
    }, externalQR);
  }
}
