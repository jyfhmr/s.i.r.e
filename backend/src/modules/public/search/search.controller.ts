import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { PUBLIC_SEARCH_ROUTES } from '@shared/core/public/search/routes';
import { Public } from '@/decorators/isPublic.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller(PUBLIC_SEARCH_ROUTES.BASE)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // Endpoint PÚBLICO - Contador total de pacientes registrados
  // DEBE ir ANTES que :dni para que Express no capture 'count' como parámetro
  @Public()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Get(PUBLIC_SEARCH_ROUTES.COUNT)
  getCount() {
    return this.searchService.getCount();
  }

  // Endpoint PÚBLICO - Sin autenticación
  // Throttle MUY estricto para evitar scraping masivo
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // Solo 10 búsquedas por minuto por IP
  @Get(PUBLIC_SEARCH_ROUTES.BY_DNI)
  searchByDni(@Param('dni') dni: string) {
    return this.searchService.searchByDni(dni);
  }
}
