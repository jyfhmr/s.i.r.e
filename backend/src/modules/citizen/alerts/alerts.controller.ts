import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertCreateUseCase } from './use-cases/alert-create.use-case';
import { AlertDeleteUseCase } from './use-cases/alert-delete.use-case';
import { AlertFindAllService } from './services/alert-find-all.service';
import { ALERT_ROUTES } from '@shared/core/citizen/alerts/routes';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';
import { ROLES } from '@shared/common';

@Controller(ALERT_ROUTES.BASE)
@UseGuards(RolesGuard)
@Roles(ROLES.USUARIO_COMUN, ROLES.MEDICO, ROLES.DIOS) // Ciudadanos, médicos y DIOS pueden configurar alertas
export class AlertsController {
  constructor(
    private readonly createUseCase: AlertCreateUseCase,
    private readonly deleteUseCase: AlertDeleteUseCase,
    private readonly findAllService: AlertFindAllService,
  ) {}

  @Post(ALERT_ROUTES.CREATE)
  create(@Body() dto: CreateAlertDto, @Request() req: any) {
    return this.createUseCase.execute(dto, req.user.sub);
  }

  @Get(ALERT_ROUTES.FIND_ALL)
  findAll(@Request() req: any) {
    return this.findAllService.execute(req.user.sub);
  }

  @Delete(ALERT_ROUTES.DELETE)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.deleteUseCase.execute(id, req.user.sub);
  }
}
