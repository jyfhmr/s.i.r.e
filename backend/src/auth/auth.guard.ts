import { IS_PUBLIC_KEY } from '@/decorators/isPublic.decorator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { User } from '@/modules/config/users/entities/user.entity'; // Ajusta la ruta a tu entidad
import { ExceptionCodes } from '@shared/http-errors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Verificamos si la ruta es pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    // 2. Extraemos y validamos el token JWT
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({ message: 'Token no proporcionado', code: 'TOKEN_MISSING' });
    }

    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'secret', // Usa variables de entorno
      });
    } catch (error: any) {
      // Evaluamos exactamente por qué falló el JWT
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          message: 'El token ha expirado',
          code: ExceptionCodes.TOKEN_EXPIRED,
        });
      }
      throw new UnauthorizedException({
        message: 'Token inválido o malformado',
        code: 'TOKEN_INVALID',
      });
    }

    // 3. Verificación Industrial con Caché: ¿El usuario sigue activo?
    const cacheKey = `user_active_${payload.sub}`;
    let isActive = await this.cacheManager.get<boolean>(cacheKey);

    // Si no está en caché, vamos a la base de datos
    if (isActive === undefined) {
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        select: ['id', 'isActive'], // Solo traemos lo esencial
      });

      // Si el usuario no existe, asumimos que está inactivo
      isActive = user?.isActive ?? false;

      // Guardamos en caché por 10 minutos (600000 ms). Ajusta según tus necesidades.
      await this.cacheManager.set(cacheKey, isActive, 600000);
    }

    // Si el usuario fue desactivado
    if (!isActive) {
      throw new UnauthorizedException({
        message: 'Usuario desactivado por el administrador',
        code: ExceptionCodes.USER_DEACTIVATED,
      });
    }

    // 4. Asignamos el payload
    request['user'] = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
