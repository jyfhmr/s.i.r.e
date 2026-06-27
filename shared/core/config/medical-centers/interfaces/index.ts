// ================= INTERFACES DE ENTIDAD =================

export interface IMedicalCenter {
  id?: number;
  name: string;
  state: string;
  municipality?: string;
  address?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ================= DTOs =================

export interface ICreateMedicalCenterDto {
  name: string;
  state: string;
  municipality?: string;
  address?: string;
}

export interface IUpdateMedicalCenterDto {
  name?: string;
  state?: string;
  municipality?: string;
  address?: string;
}

// ================= FILTROS DE BÚSQUEDA =================

export interface IMedicalCenterFilter {
  page?: number;
  rows?: number;
  name?: string;
  state?: string;
  municipality?: string;
  isActive?: boolean | "true" | "false";
  createdAt?: string; // "startDate,endDate"
  updatedAt?: string;
  export?: boolean;
  q?: string; // Para búsqueda rápida/autocomplete
}
