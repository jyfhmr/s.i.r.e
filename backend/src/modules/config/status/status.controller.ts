import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  Query,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { STATUS_ROUTES } from '@shared/core/config/status/route';

// DTOs
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

// Services & Use Cases
import { StatusFindAllService } from './services/status-find-all.service';
import { StatusFindOneService } from './services/status-find-one.service';
import { StatusCreateUseCase } from './use-cases/status-create.use-case';
import { StatusUpdateUseCase } from './use-cases/status-update.use-case';
import { StatusChangeStatusUseCase } from './use-cases/status-change-status.use-case';
import { StatusExporterService } from './services/status-exporter.service';
import { RequirePage } from '@/decorators/require-page.decorator';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { Public } from '@/decorators/isPublic.decorator';
import { SUB_PAGES } from '@shared/common/profile-rules';

@Controller(STATUS_ROUTES.BASE)
@UseGuards(PermissionsGuard) // <-- Añadimos el nuevo Guard
@RequirePage(SUB_PAGES.STATUS) // <-- Actualizado
export class StatusController {
  constructor(
    private readonly createUseCase: StatusCreateUseCase,
    private readonly updateUseCase: StatusUpdateUseCase,
    private readonly changeStatusUseCase: StatusChangeStatusUseCase,
    private readonly findAllService: StatusFindAllService,
    private readonly findOneService: StatusFindOneService,
    private readonly exporterService: StatusExporterService,
  ) {}

  @Post(STATUS_ROUTES.CREATE)
  create(@Body() dto: CreateStatusDto, @Request() req: any) {
    return this.createUseCase.execute(dto);
  }

  @Get(STATUS_ROUTES.FIND_ALL)
  findAll(@Query() query: any) {
    return this.findAllService.execute(query);
  }

  @Get(STATUS_ROUTES.TREASURY)
  treasuryStatuses() {
    return this.findAllService.getTreasuryStatuses();
  }

  @Public()
  @Get(STATUS_ROUTES.EXPORT)
  async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
    query.export = 1;
    const result = await this.findAllService.execute(query);
    await this.exporterService.execute(result.data, res);
  }

  @Get(STATUS_ROUTES.FIND_ONE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Patch(STATUS_ROUTES.UPDATE)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto, @Request() req: any) {
    return this.updateUseCase.execute(id, dto, req.user.sub);
  }

  @Patch(STATUS_ROUTES.CHANGE_STATUS)
  changeStatus(@Param('id', ParseIntPipe) id: number) {
    return this.changeStatusUseCase.execute(id);
  }
}
