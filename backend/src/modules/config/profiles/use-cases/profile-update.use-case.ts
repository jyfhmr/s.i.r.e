// src/modules/config/profiles/use-cases/profile-update.use-case.ts
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profile } from '../entities/profile.entity';
import { ProfilePages } from '../entities/profilePages.entity';
import { User } from '../../users/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProfileUpdateUseCase {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(Profile)
    private repository: Repository<Profile>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(
    id: number,
    dto: UpdateProfileDto,
    userId: number,
    externalQR?: QueryRunner,
  ): Promise<{ message: string; id: number }> {
    return await this.helpersService.runInTransaction(async (queryRunner) => {
      // 1. Buscamos el perfil a actualizar
      const updateProfile = await this.repository.findOneBy({ id });

      if (!updateProfile) {
        throw new HttpException(`Perfil con ID ${id} no encontrado`, HttpStatus.NOT_FOUND);
      }

      const user = new User();
      user.id = userId;

      // 2. Actualizar datos básicos
      updateProfile.name = dto.name.toUpperCase();
      updateProfile.description = dto.description;

      const resultUpdatedProfile = await queryRunner.manager.save(updateProfile);

      // 3. Validación de seguridad básica
      // (Asumiendo que actualizaste UpdateProfileDto para usar pageIds igual que CreateProfileDto)
      if (!dto.pageIds || dto.pageIds.length === 0) {
        throw new HttpException('Debe seleccionar al menos una página', HttpStatus.BAD_REQUEST);
      }

      // 4. Limpieza: Eliminar páginas existentes de la tabla pivote
      await queryRunner.manager.delete(ProfilePages, { profile: resultUpdatedProfile });

      // 5. Reasignación: Insertar las nuevas páginas enviadas desde el frontend
      for (const pageId of dto.pageIds) {
        const newProfilePage = queryRunner.manager.create(ProfilePages, {
          profile: resultUpdatedProfile,
          page: { id: pageId },
        });

        await queryRunner.manager.save(newProfilePage);
      }

      // 🔥 LÓGICA DE INVALIDACIÓN DE CACHÉ
      // La movemos fuera del bucle 'for' para no golpear Redis/Memoria en cada iteración,
      // con una sola vez al final es suficiente.
      const cacheKey = `/auth/menu/${id}`;
      await this.cacheManager.del(cacheKey);
      await this.cacheManager.del(`/api/auth/menu/${id}`);

      return { message: '¡Perfil editado con éxito!', id: resultUpdatedProfile.id };
    }, externalQR);
  }
}
