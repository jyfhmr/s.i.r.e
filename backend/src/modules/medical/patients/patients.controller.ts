import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UpsertPatientDto } from './dto/upsert-patient.dto';
import { PatientUpsertUseCase } from './use-cases/patient-upsert.use-case';
import { PatientFindAllService } from './services/patient-find-all.service';
import { PatientSearchByDniService } from './services/patient-search-by-dni.service';
import { PatientFindHistoryService } from './services/patient-find-history.service';
import { PatientExportService } from './services/patient-export.service';
import { PATIENT_ROUTES } from '@shared/core/medical/patients/routes';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { ROLES } from '@shared/common';

@Controller(PATIENT_ROUTES.BASE)
@UseGuards(RolesGuard)
export class PatientsController {
  constructor(
    private readonly upsertUseCase: PatientUpsertUseCase,
    private readonly findAllService: PatientFindAllService,
    private readonly searchByDniService: PatientSearchByDniService,
    private readonly findHistoryService: PatientFindHistoryService,
    private readonly exportService: PatientExportService,
  ) {}

  // ESCRITURA: Solo MEDICO (bloquea DIOS)
  @Roles(ROLES.MEDICO)
  @Post(PATIENT_ROUTES.UPSERT)
  upsert(@Body() dto: UpsertPatientDto, @Request() req: any) {
    return this.upsertUseCase.execute(dto, req.user.sub);
  }

  // LECTURA: Dashboard del médico (solo sus pacientes)
  @Roles(ROLES.MEDICO)
  @Get(PATIENT_ROUTES.FIND_ALL)
  findAll(@Query() query: any, @Request() req: any) {
    return this.findAllService.execute(query, req.user.sub);
  }

  // LECTURA: Buscador global por DNI (accesible a MEDICO y DIOS)
  @Roles(ROLES.MEDICO, ROLES.DIOS)
  @Get(PATIENT_ROUTES.SEARCH_BY_DNI)
  searchByDni(@Param('dni') dni: string) {
    return this.searchByDniService.execute(dni);
  }

  // LECTURA: Historial/bitácora completa de un paciente
  @Roles(ROLES.MEDICO, ROLES.DIOS)
  @Get(PATIENT_ROUTES.HISTORY)
  getHistory(@Param('id', ParseIntPipe) id: number) {
    return this.findHistoryService.execute(id);
  }

  // EXPORTAR: Solo médicos
  @Roles(ROLES.MEDICO)
  @Get(PATIENT_ROUTES.EXPORT)
  async exportData(@Query() query: any, @Res() res: Response, @Request() req: any): Promise<void> {
    query.export = true;
    const { data } = await this.findAllService.execute(query, req.user.sub);
    await this.exportService.execute(data, res);
  }
}
