import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PublicMedicalCentersService } from './public-medical-centers.service';
import { PUBLIC_MEDICAL_CENTER_ROUTES } from '@shared/core/public/medical-centers/routes';
import { Public } from '@/decorators/isPublic.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller(PUBLIC_MEDICAL_CENTER_ROUTES.BASE)
export class PublicMedicalCentersController {
  constructor(private readonly service: PublicMedicalCentersService) {}

  // Endpoint PÚBLICO - Lista de centros médicos activos
  @Public()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Get(PUBLIC_MEDICAL_CENTER_ROUTES.FIND_ALL)
  findAll() {
    return this.service.findAll();
  }

  // Endpoint PÚBLICO - Detalle de centro médico activo
  @Public()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Get(PUBLIC_MEDICAL_CENTER_ROUTES.FIND_ONE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
