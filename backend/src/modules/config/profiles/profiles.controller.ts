import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  ParseIntPipe,
  Res,
  Query,
  UseGuards,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileCreateUseCase } from './use-cases/profile-create.use-case';
import { ProfileUpdateUseCase } from './use-cases/profile-update.use-case';
import { ProfileChangeStatusUseCase } from './use-cases/profile-change-status.use-case';
import { ProfileFindAllService } from './services/profile-find-all.service';
import { ProfileFindOneService } from './services/profile-find-one.service';
import { ProfileGetAssignableService } from './services/profile-get-assignable.service';
import { PROFILE_ROUTES } from '@shared/core/config/profiles/routes';
import { ProfileListService } from './services/profile-list.service';
import { RequirePage } from '@/decorators/require-page.decorator';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { Public } from '@/decorators/isPublic.decorator';
import { CACHE_MANAGER, CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'; // <-- Aseguramos la importación correcta
import { SUB_PAGES } from '@shared/common/profile-rules';

@Controller(PROFILE_ROUTES.BASE)
@UseGuards(PermissionsGuard)
export class ProfilesController {
  constructor(
    private readonly createUseCase: ProfileCreateUseCase,
    private readonly updateUseCase: ProfileUpdateUseCase,
    private readonly changeStatusUseCase: ProfileChangeStatusUseCase,
    private readonly findAllService: ProfileFindAllService,
    private readonly findOneService: ProfileFindOneService,
    private readonly listService: ProfileListService,
    private readonly getAssignableService: ProfileGetAssignableService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // <-- Inyectamos el caché
  ) {}

  @Post(PROFILE_ROUTES.CREATE)
  @RequirePage(SUB_PAGES.PROFILES)
  create(@Body() dto: CreateProfileDto, @Request() req: any) {
    return this.createUseCase.execute(dto, req.user.sub);
  }

  @Get(PROFILE_ROUTES.FIND_ALL)
  @RequirePage(SUB_PAGES.PROFILES)
  findAll(@Query() query: any) {
    return this.findAllService.execute(query);
  }

  @Get(PROFILE_ROUTES.ASSIGNABLE_PROFILES)
  @RequirePage(SUB_PAGES.PROFILES)
  getAssignableProfiles(@Request() req: any) {
    return this.getAssignableService.execute(req.user.sub);
  }

  @Get(PROFILE_ROUTES.LIST)
  @RequirePage(SUB_PAGES.PROFILES)
  listProfiles() {
    return this.listService.execute();
  }

  @Get(PROFILE_ROUTES.FIND_ONE)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600000)
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log('Haciendo petición a /id perfiles...');
    return this.findOneService.execute(id);
  }

  @Patch(PROFILE_ROUTES.UPDATE)
  @RequirePage(SUB_PAGES.PROFILES)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfileDto,
    @Request() req: any,
  ) {
    // 1. Ejecutamos la actualización normal
    const result = await this.updateUseCase.execute(id, dto, req.user.sub);

    // 🔥 2. INVALIDACIÓN DEL CACHÉ DEL FIND_ONE 🔥
    // Añadimos el prefijo '/api' porque NestJS lo incluye automáticamente en la llave cuando intercepta la petición
    const cacheKeyWithApi = `/api/${PROFILE_ROUTES.BASE}/${id}`;
    await this.cacheManager.del(cacheKeyWithApi);

    // (Opcional) Borramos la llave sin '/api' por si alguna vez quitas el prefijo global y se te olvida cambiar esto
    const cacheKeyWithoutApi = `/${PROFILE_ROUTES.BASE}/${id}`;
    await this.cacheManager.del(cacheKeyWithoutApi);

    return result;
  }

  @Patch(PROFILE_ROUTES.CHANGE_STATUS)
  @RequirePage(SUB_PAGES.PROFILES)
  changeStatus(@Param('id', ParseIntPipe) id: number) {
    return this.changeStatusUseCase.execute(id);
  }
}
