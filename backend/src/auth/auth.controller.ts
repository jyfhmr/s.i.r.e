import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@/decorators/isPublic.decorator';
import { Throttle } from '@nestjs/throttler';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { RegisterCitizenDto } from './dto/register-citizen.dto';
import { RegisterCitizenUseCase } from './use-cases/register-citizen.use-case';
import { RequestResetDto, ResetPasswordDto } from './dto/password-reset.dto';
import { PasswordRequestResetUseCase } from './use-cases/password-request-reset.use-case';
import { PasswordResetUseCase } from './use-cases/password-reset.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private registerCitizenUseCase: RegisterCitizenUseCase,
    private passwordRequestResetUseCase: PasswordRequestResetUseCase,
    private passwordResetUseCase: PasswordResetUseCase,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // <-- Solo 5 intentos cada 60 segundos
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    console.log('signInDto', signInDto);
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }

  @Public()
  @UseInterceptors(CacheInterceptor) // Intercepta la petición y devuelve el caché si existe Los perfiles son consultados con frecuencia
  @CacheTTL(600000) // 10 minutos (si estás usando milisegundos en v5)
  @Get('/menu/:id')
  getMenu(@Param('id', ParseIntPipe) id: number): any {
    return this.authService.getMenu(id);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 registros por minuto
  @Post('register/citizen')
  registerCitizen(@Body() dto: RegisterCitizenDto) {
    return this.registerCitizenUseCase.execute(dto);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('password/request-reset')
  requestPasswordReset(@Body() dto: RequestResetDto) {
    return this.passwordRequestResetUseCase.execute(dto.email);
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('password/reset')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordResetUseCase.execute(dto.userId, dto.token, dto.password);
  }
}
