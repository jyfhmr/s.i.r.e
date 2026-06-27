import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { WatchListItem } from '../entities/watch-list-item.entity';
import { CreateAlertDto } from '../dto/create-alert.dto';
import { User } from '@/modules/config/users/entities/user.entity';
import { MAX_ALERTS_PER_USER } from '@shared/core/citizen/alerts/interfaces';

@Injectable()
export class AlertCreateUseCase {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(WatchListItem)
    private watchListRepository: Repository<WatchListItem>,
  ) {}

  async execute(dto: CreateAlertDto, currentUserId: number) {
    try {
      // 1. Verificar que el usuario no exceda el límite de 15 alertas
      const currentCount = await this.watchListRepository.count({
        where: { userId: currentUserId },
      });

      if (currentCount >= MAX_ALERTS_PER_USER) {
        throw new HttpException(
          `Has alcanzado el límite máximo de ${MAX_ALERTS_PER_USER} alertas. Elimina alguna para agregar una nueva.`,
          400,
        );
      }

      // 2. Verificar que no haya duplicado para este usuario
      const existing = await this.watchListRepository.findOne({
        where: {
          userId: currentUserId,
          watchedDni: dto.watchedDni,
        },
      });

      if (existing) {
        throw new HttpException('Ya tienes una alerta configurada para esta cédula', 409);
      }

      // 3. Crear la alerta
      const newAlert = this.watchListRepository.create({
        userId: currentUserId,
        watchedDni: dto.watchedDni,
        alias: dto.alias,
      });

      await this.watchListRepository.save(newAlert);

      return {
        message:
          '¡Alerta configurada exitosamente! Te notificaremos por correo cuando esta persona sea registrada.',
        id: newAlert.id,
      };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Creación de Alerta');
    }
  }
}
