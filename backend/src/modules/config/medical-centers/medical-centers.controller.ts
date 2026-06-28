import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateMedicalCenterDto } from './dto/create-medical-center.dto';
import { UpdateMedicalCenterDto } from './dto/update-medical-center.dto';
import { MedicalCenterCreateUseCase } from './use-cases/medical-center-create.use-case';
import { MedicalCenterUpdateUseCase } from './use-cases/medical-center-update.use-case';
import { MedicalCenterChangeStatusUseCase } from './use-cases/medical-center-change-status.use-case';
import { MedicalCenterFindAllService } from './services/medical-center-find-all.service';
import { MedicalCenterFindOneService } from './services/medical-center-find-one.service';
import { MedicalCenterListService } from './services/medical-center-list.service';
import { MedicalCenterSearchService } from './services/medical-center-search.service';
import { MedicalCenterExportService } from './services/medical-center-export.service';
import { MEDICAL_CENTER_ROUTES } from '@shared/core/config/medical-centers/routes';
import { RequirePage } from '@/decorators/require-page.decorator';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { Public } from '@/decorators/isPublic.decorator';
import { SUB_PAGES } from '@shared/common/profile-rules';

@Controller(MEDICAL_CENTER_ROUTES.BASE)
@UseGuards(PermissionsGuard)
export class MedicalCentersController {
  constructor(
    private readonly createUseCase: MedicalCenterCreateUseCase,
    private readonly updateUseCase: MedicalCenterUpdateUseCase,
    private readonly changeStatusUseCase: MedicalCenterChangeStatusUseCase,
    private readonly findAllService: MedicalCenterFindAllService,
    private readonly findOneService: MedicalCenterFindOneService,
    private readonly listService: MedicalCenterListService,
    private readonly searchService: MedicalCenterSearchService,
    private readonly exportService: MedicalCenterExportService,
  ) {}

  @RequirePage(SUB_PAGES.MEDICAL_CENTERS)
  @Get(MEDICAL_CENTER_ROUTES.EXPORT)
  async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
    query.export = true;
    const { data } = await this.findAllService.execute(query);
    await this.exportService.execute(data, res);
  }

  @RequirePage(SUB_PAGES.MEDICAL_CENTERS)
  @Post(MEDICAL_CENTER_ROUTES.CREATE)
  create(@Body() dto: CreateMedicalCenterDto, @Request() req: any) {
    return this.createUseCase.execute(dto, req.user.sub);
  }

  @RequirePage(SUB_PAGES.MEDICAL_CENTERS)
  @Get(MEDICAL_CENTER_ROUTES.FIND_ALL)
  findAll(@Query() query: any) {
    return this.findAllService.execute(query);
  }

  // Endpoint liviano para autocomplete - accesible a médicos autenticados y público
  @Public()
  @Get(MEDICAL_CENTER_ROUTES.SEARCH)
  search(@Query('q') query: string) {
    return this.searchService.execute(query || '');
  }

  // Lista simple para dropdowns - accesible a médicos autenticados
  @Get(MEDICAL_CENTER_ROUTES.LIST)
  getList() {
    return this.listService.execute();
  }

  @RequirePage(SUB_PAGES.MEDICAL_CENTERS)
  @Get(MEDICAL_CENTER_ROUTES.FIND_ONE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @RequirePage(SUB_PAGES.MEDICAL_CENTERS)
  @Patch(MEDICAL_CENTER_ROUTES.UPDATE)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicalCenterDto,
    @Request() req: any,
  ) {
    return this.updateUseCase.execute(id, dto, req.user.sub);
  }

  @RequirePage(SUB_PAGES.MEDICAL_CENTERS)
  @Patch(MEDICAL_CENTER_ROUTES.CHANGE_STATUS)
  changeStatus(@Param('id', ParseIntPipe) id: number) {
    return this.changeStatusUseCase.execute(id);
  }
}
