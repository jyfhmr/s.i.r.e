// users.controller.ts
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
  HttpCode,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCreateUseCase } from './use-cases/user-create.use-case';
import { UserUpdateUseCase } from './use-cases/user-update.use-case';
import { UserChangeStatusUseCase } from './use-cases/user-change-status.use-case';
import { UserUpdatePasswordUseCase } from './use-cases/user-update-password.use-case';
import { UserFindAllService } from './services/user-find-all.service';
import { UserFindOneService } from './services/user-find-one.service';
import { UserListService } from './services/user-list.service';
import { UserFindByUsernameService } from './services/user-find-by-username.service';
import { UserFindByEmailService } from './services/user-find-by-email.service';
import { USER_ROUTES } from '@shared/core/config/user/routes';
import { RequirePage } from '@/decorators/require-page.decorator';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { Public } from '@/decorators/isPublic.decorator';
import { SUB_PAGES } from '@shared/common/profile-rules';

@Controller(USER_ROUTES.BASE)
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(
    private readonly createUseCase: UserCreateUseCase,
    private readonly updateUseCase: UserUpdateUseCase,
    private readonly changeStatusUseCase: UserChangeStatusUseCase,
    private readonly updatePasswordUseCase: UserUpdatePasswordUseCase,
    private readonly findAllService: UserFindAllService,
    private readonly findOneService: UserFindOneService,
    private readonly listService: UserListService,
    private readonly findByEmailService: UserFindByEmailService,
  ) {}

  @RequirePage(SUB_PAGES.USERS) // <-- Actualizado
  @HttpCode(200)
  @Post(USER_ROUTES.CREATE)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateUserDto,
    @Request() req: any,
  ) {
    return this.createUseCase.execute(dto, req.user.sub);
  }

  @RequirePage(SUB_PAGES.USERS) // <-- Actualizado
  @Get(USER_ROUTES.LIST)
  getList() {
    return this.listService.execute();
  }

  @RequirePage(SUB_PAGES.USERS) // <-- Actualizado
  @Get(USER_ROUTES.FIND_ALL)
  findAll(@Query() query: any) {
    return this.findAllService.execute(query);
  }

  // Esta ruta se mantiene sin RequirePage, tal como lo pediste
  @Get(USER_ROUTES.FIND_ONE)
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.findOneService.execute(id, req.user.sub);
  }

  // Esta ruta se mantiene sin RequirePage, tal como lo pediste
  @Patch(USER_ROUTES.UPDATE)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.updateUseCase.execute(id, dto, req.user, file);
  }

  @RequirePage(SUB_PAGES.USERS) // <-- Actualizado
  @Patch(USER_ROUTES.CHANGE_STATUS)
  changeStatus(@Param('id', ParseIntPipe) id: number) {
    return this.changeStatusUseCase.execute(id);
  }

  @Public()
  @Post(USER_ROUTES.UPDATE_PASSWORD)
  changePassword(@Body() body: { userId: number; password: string }) {
    return this.updatePasswordUseCase.execute(body.userId, body.password);
  }

  @Public()
  @Post(USER_ROUTES.FIND_BY_EMAIL)
  findEmail(@Body() body: { email: string }) {
    return this.findByEmailService.execute(body.email);
  }
}
