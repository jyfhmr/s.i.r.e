import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { QueryRunner } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserChangeStatusUseCase {
  constructor(
    private helpersService: HelpersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // <-- 1. Inyectamos el Cache Manager
  ) {}

  async execute(id: number, externalQR?: QueryRunner) {
    return await this.helpersService.runInTransaction(async (queryRunner) => {
      const user = await this.helpersService.searchFindOneById(User, id, 'Usuario', queryRunner);

      user.isActive = !user.isActive;

      await queryRunner.manager.save(user);

      // 🔥 2. Invalidamos el caché del usuario específico
      // Usamos la misma estructura de llave que tienes en tu AuthGuard
      const cacheKey = `user_active_${user.id}`;

      // Al borrarlo (del), forzamos al AuthGuard a consultar la BD
      // en la próxima petición HTTP que haga este usuario.
      await this.cacheManager.del(cacheKey);

      return {
        message: '¡Cambio de estatus realizado con éxito!',
        id: user.id,
        newStatus: user.isActive,
      };
    }, externalQR);
  }
}
