import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { PublicPatientsService } from './public-patients.service';
import { PUBLIC_PATIENT_ROUTES } from '@shared/core/public/patients/routes';
import { Public } from '@/decorators/isPublic.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller(PUBLIC_PATIENT_ROUTES.BASE)
export class PublicPatientsController {
  constructor(private readonly service: PublicPatientsService) {}

  // Endpoint PÚBLICO - Listado paginado de pacientes (sin estatus de salud)
  @Public()
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 consultas por minuto
  @Get(PUBLIC_PATIENT_ROUTES.FIND_ALL)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('rows', new DefaultValuePipe(50), ParseIntPipe) rows: number,
  ) {
    return this.service.findAll(page, rows);
  }
}
