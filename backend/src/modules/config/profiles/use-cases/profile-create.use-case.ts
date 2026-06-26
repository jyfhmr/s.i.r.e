// src/modules/config/profiles/use-cases/profile-create.use-case.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { Profile } from '../entities/profile.entity';
import { ProfilePages } from '../entities/profilePages.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ProfileCreateUseCase {
  constructor(private helpersService: HelpersService) {}

  async execute(dto: CreateProfileDto, userId: number, externalQR?: QueryRunner) {
    return await this.helpersService.runInTransaction(async (queryRunner) => {
      const user = new User();
      user.id = userId;

      // 1. Crear el perfil principal
      const newProfile = queryRunner.manager.create(Profile, {
        name: dto.name.toUpperCase(),
        description: dto.description,
        user: user,
        userUpdate: user,
      });

      const resultNewProfile = await queryRunner.manager.save(newProfile);

      // 2. Insertar directamente las páginas en la tabla pivote
      // El frontend nos enviará los IDs exactos que el usuario tildó
      for (const pageId of dto.pageIds) {
        const newProfilePage = queryRunner.manager.create(ProfilePages, {
          profile: resultNewProfile,
          page: { id: pageId }, // Guardamos la relación
        });
        await queryRunner.manager.save(newProfilePage);
      }

      return { message: '¡Perfil creado con éxito!', id: resultNewProfile.id };
    }, externalQR);
  }
}
