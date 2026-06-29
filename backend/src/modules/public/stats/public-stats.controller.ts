import { Controller, Get } from '@nestjs/common';
import { PublicStatsService } from './public-stats.service';
import { PUBLIC_STATS_ROUTES } from '@shared/core/public/stats/routes';
import { Public } from '@/decorators/isPublic.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller(PUBLIC_STATS_ROUTES.BASE)
export class PublicStatsController {
  constructor(private readonly service: PublicStatsService) {}

  // Endpoint PÚBLICO - Estadísticas agregadas del sistema
  @Public()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Get(PUBLIC_STATS_ROUTES.INDEX)
  getStats() {
    return this.service.getStats();
  }
}
