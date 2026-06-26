// src/shared/core/config-pages/interfaces/index.ts

// =============== INTERFACES BASE ===============
export interface IPage {
  id?: number;
  name: string;
  icon?: string | null;
  route?: string | null;
  order?: number | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
  userUpdateId?: number;
  pageFatherId?: number;
}

// =============== DTOs ===============
export interface ICreatePageDto {
  name: string;
  route?: string;
  icon?: string;
  pageFather?: number | any; // ID o entidad
  order?: number;
}

export interface IUpdatePageDto extends Partial<ICreatePageDto> {}

// =============== FILTROS ===============
export interface IPageFilter {
  page?: number;
  rows?: number;
  order?: "ASC" | "DESC";
  id?: string;
  name?: string;
  pageFather?: string;
  isActive?: string | boolean;
  updatedAt?: string;
  createdAt?: string;
  export?: number;
  // 🗑️ ELIMINADO: application
}

// =============== RESPUESTAS ===============
export interface IPageListResponse {
  totalRows: number;
  data: IPage[];
}
