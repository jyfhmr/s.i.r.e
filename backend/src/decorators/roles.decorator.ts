import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// Decorador para verificación estricta de roles (no afectado por godmode)
// Útil para endpoints donde DIOS NO debe tener acceso (ej: gestión de pacientes)
export const Roles = (...roles: number[]) => SetMetadata(ROLES_KEY, roles);
