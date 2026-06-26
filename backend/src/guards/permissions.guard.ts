// src/guards/permissions.guard.ts
import { IS_PUBLIC_KEY } from '@/decorators/isPublic.decorator';
import { REQUIRE_PAGE_KEY } from '@/decorators/require-page.decorator';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_BY_ROLE } from '@shared/common/profile-rules';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const requiredPage = this.reflector.getAllAndOverride<string>(REQUIRE_PAGE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPage) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.profileId) {
      throw new ForbiddenException('El token no contiene un perfil válido.');
    }

    const rolePermissions = PERMISSIONS_BY_ROLE[user.profileId as number];

    if (!rolePermissions) {
      throw new ForbiddenException('Perfil no autorizado o inexistente.');
    }

    // ¿Es modo DIOS?
    if (rolePermissions.isGodMode) {
      return true;
    }

    // ¿Tiene la página específica en su lista?
    if (rolePermissions.pages.includes(requiredPage)) {
      return true;
    }

    throw new ForbiddenException(
      `Tu perfil no tiene los permisos necesarios para el módulo: ${requiredPage}`,
    );
  }
}
