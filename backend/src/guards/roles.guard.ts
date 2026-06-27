import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@/decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '@/decorators/isPublic.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<number[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.profileId) {
      throw new ForbiddenException('El token no contiene un perfil válido.');
    }

    // Verificación estricta: el perfil del usuario DEBE estar en la lista de roles permitidos
    // Esto NO respeta godMode, es una barrera inquebrantable
    if (requiredRoles.includes(user.profileId)) {
      return true;
    }

    throw new ForbiddenException(
      `Tu perfil no tiene autorización para realizar esta acción. Solo permitido para roles específicos.`,
    );
  }
}
