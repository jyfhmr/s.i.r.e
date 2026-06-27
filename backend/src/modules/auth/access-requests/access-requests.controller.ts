import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateAccessRequestDto } from './dto/create-access-request.dto';
import { ApproveAccessRequestDto } from './dto/approve-access-request.dto';
import { AccessRequestCreateUseCase } from './use-cases/access-request-create.use-case';
import { AccessRequestApproveUseCase } from './use-cases/access-request-approve.use-case';
import { AccessRequestRejectUseCase } from './use-cases/access-request-reject.use-case';
import { AccessRequestFindAllService } from './services/access-request-find-all.service';
import { ACCESS_REQUEST_ROUTES } from '@shared/core/auth/access-requests/routes';
import { Public } from '@/decorators/isPublic.decorator';
import { Throttle } from '@nestjs/throttler';
import { RequirePage } from '@/decorators/require-page.decorator';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { SUB_PAGES } from '@shared/common/profile-rules';

@Controller(ACCESS_REQUEST_ROUTES.BASE)
@UseGuards(PermissionsGuard)
export class AccessRequestsController {
  constructor(
    private readonly createUseCase: AccessRequestCreateUseCase,
    private readonly approveUseCase: AccessRequestApproveUseCase,
    private readonly rejectUseCase: AccessRequestRejectUseCase,
    private readonly findAllService: AccessRequestFindAllService,
  ) {}

  // PÚBLICO: Crear solicitud de acceso médico
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 solicitudes por minuto
  @Post(ACCESS_REQUEST_ROUTES.CREATE)
  create(@Body() dto: CreateAccessRequestDto) {
    return this.createUseCase.execute(dto);
  }

  // SOLO DIOS: Ver todas las solicitudes
  @RequirePage(SUB_PAGES.ACCESS_REQUESTS)
  @Get(ACCESS_REQUEST_ROUTES.FIND_ALL)
  findAll(@Query() query: any) {
    return this.findAllService.execute(query);
  }

  // SOLO DIOS: Aprobar solicitud
  @RequirePage(SUB_PAGES.ACCESS_REQUESTS)
  @Post(ACCESS_REQUEST_ROUTES.APPROVE)
  approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApproveAccessRequestDto,
    @Request() req: any,
  ) {
    return this.approveUseCase.execute(id, dto, req.user.sub);
  }

  // SOLO DIOS: Rechazar solicitud
  @RequirePage(SUB_PAGES.ACCESS_REQUESTS)
  @Post(ACCESS_REQUEST_ROUTES.REJECT)
  reject(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.rejectUseCase.execute(id, req.user.sub);
  }
}
