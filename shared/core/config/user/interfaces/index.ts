// @shared/core/users/index.ts

// ================= INTERFACES DE ENTIDAD =================

export interface IUser {
  id?: number;
  fullName: string;
  email: string;
  password: string;
  dni: string | null;
  isActive: boolean;
  resetToken?: string;
  resetTokenExpiration?: Date;

  // Relaciones (tipado básico)
  createdAt?: Date;
  updatedAt?: Date;
}

// ================= DTOs =================

export interface ICreateUserDto {
  name: string;
  fullName: string;
  email: string;
  password: string;
  dni: string;
  profile: number; // ID del perfil a asignar
}

export interface IUpdateUserDto {
  name?: string;
  fullName?: string;
  email?: string;
  dni?: string;
  profile?: number;
}

// ================= FILTROS DE BÚSQUEDA =================

export interface IUserFilter {
  page?: number;
  rows?: number;
  name?: string;
  email?: string;
  profile?: string;
  isActive?: boolean | "true" | "false";
  createdAt?: string; // "startDate,endDate"
  updatedAt?: string;
  export?: boolean;
}

// ================= ENUMS Y CONSTANTES =================

export enum UserProfileName {
  DIOS = "DIOS",
  DOCTOR = "PERSONAL SALUD",
}
