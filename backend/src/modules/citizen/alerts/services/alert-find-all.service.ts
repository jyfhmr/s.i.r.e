import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { WatchListItem } from '../entities/watch-list-item.entity';

@Injectable()
export class AlertFindAllService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(WatchListItem)
    private repository: Repository<WatchListItem>,
  ) {}

  async execute(currentUserId: number): Promise<WatchListItem[]> {
    try {
      // OWNERSHIP: Solo las alertas del usuario actual
      return await this.repository.find({
        where: { userId: currentUserId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Listado de Alertas');
    }
  }
}
