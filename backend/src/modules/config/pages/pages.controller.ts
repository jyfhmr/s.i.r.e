// src/modules/config/pages/pages.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { PageCreateUseCase } from './use-cases/page-create.use-case';
import { PageUpdateUseCase } from './use-cases/page-update.use-case';
import { PageChangeStatusUseCase } from './use-cases/page-change-status.use-case';
import { PageFindAllService } from './services/page-find-all.service';
import { PageFindOneService } from './services/page-find-one.service';
import { PageListActiveService } from './services/page-list-active.service';
import { PageExportService } from './helpers/page-export.service';
import { PAGE_ROUTES } from '@shared/core/config/pages/routes';
import { IPageFilter } from '@shared/core/config/pages/interfaces';
import { RequirePage } from '@/decorators/require-page.decorator';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { SUB_PAGES } from '@shared/common/profile-rules';

@Controller(PAGE_ROUTES.BASE)
@UseGuards(PermissionsGuard)
@RequirePage(SUB_PAGES.PAGES)
export class PagesController {
  constructor(
    private readonly createUseCase: PageCreateUseCase,
    private readonly updateUseCase: PageUpdateUseCase,
    private readonly changeStatusUseCase: PageChangeStatusUseCase,
    private readonly findAllService: PageFindAllService,
    private readonly findOneService: PageFindOneService,
    private readonly listActiveService: PageListActiveService,
  ) {}

  @Post(PAGE_ROUTES.CREATE)
  create(@Body() dto: CreatePageDto, @Request() req: any) {
    return this.createUseCase.execute(dto, req.user.sub);
  }

  @Get(PAGE_ROUTES.FIND_ALL)
  findAll(@Query() query: IPageFilter) {
    return this.findAllService.execute(query);
  }

  @Get(PAGE_ROUTES.LIST_ACTIVE)
  listPages() {
    return this.listActiveService.execute();
  }

  @Get(PAGE_ROUTES.FIND_ONE)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneService.execute(id);
  }

  @Patch(PAGE_ROUTES.UPDATE)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePageDto, @Request() req: any) {
    return this.updateUseCase.execute(id, dto, req.user.sub);
  }

  @Patch(PAGE_ROUTES.CHANGE_STATUS)
  changeStatus(@Param('id', ParseIntPipe) id: number) {
    return this.changeStatusUseCase.execute(id);
  }
}
