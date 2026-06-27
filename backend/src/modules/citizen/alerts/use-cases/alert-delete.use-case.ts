import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { WatchListItem } from '../entities/watch-list-item.entity';

@Injectable()
export class AlertDeleteUseCase {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(WatchListItem)
    private watchListRepository: Repository<WatchListItem>,
  ) {}

  async execute(id: number, currentUserId: number) {
    try {
      // 1. Buscar la alerta
      const alert = await this.watchListRepository.findOne({
        where: { id },
      });

      if (!alert) {
        throw new HttpException('Alerta no encontrada', 404);
      }

      // 2. OWNERSHIP: Verificar que pertenezca al usuario actual
      if (alert.userId !== currentUserId) {
        throw new HttpException('No tienes permiso para eliminar esta alerta', 403);
      }

      // 3. Eliminar
      await this.watchListRepository.remove(alert);

      return {
        message: '¡Alerta eliminada exitosamente!',
      };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Eliminación de Alerta');
    }
  }
}
