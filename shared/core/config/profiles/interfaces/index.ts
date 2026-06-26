// src/modules/config/profiles/interfaces/index.ts

export interface IProfile {
  id?: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProfilePage {
  id?: number;
  page: number; // ID de la página
  // 🗑️ ELIMINADO: package
}

export interface IProfileFilter {
  page?: number;
  rows?: number;
  id?: string;
  name?: string;
  isActive?: boolean | string;
  updatedAt?: string;
  createdAt?: string;
}

export interface IProfilePaginatedResponse {
  totalRows: number;
  data: any[];
}

export interface ICreateProfileDto {
  name: string;
  description: string;
  pageIds: number[]; // ✅ AHORA ES UN SIMPLE ARRAY DE IDs
}
