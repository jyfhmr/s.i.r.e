import { PatientStatus, RegistrationSource } from "@shared/common";

// ================= INTERFACES DE ENTIDAD =================

export interface IPatient {
  id?: number;
  dni: string; // Cédula - ÚNICO
  fullName: string;
  currentStatus: PatientStatus;
  currentMedicalCenterId?: number; // Relación opcional (puede estar en uno del catálogo)
  manualLocation?: string; // Ubicación escrita a mano si no está en el catálogo
  lastUpdatedBy?: number; // ID del médico que hizo la última actualización
  lastUpdatedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  registrationSource?: RegistrationSource; // Fuente del registro (médico o lista pública)
}

export interface IPatientStatusLog {
  id?: number;
  patientId: number;
  status: PatientStatus;
  medicalCenterId?: number; // Relación opcional para trazabilidad histórica
  manualLocation?: string; // Ubicación manual histórica
  updatedBy: number; // ID del médico que hizo este cambio (NUNCA se expone públicamente)
  createdAt: Date; // Inmutable - cuándo ocurrió este cambio
}

// ================= DTOs =================

export interface IUpsertPatientDto {
  dni: string;
  fullName: string;
  status: PatientStatus;
  medicalCenterId?: number; // Opcional
  manualLocation?: string; // Opcional - usado si medicalCenterId no se proporciona
  registrationSource?: RegistrationSource; // Opcional - fuente del registro
}

export interface IPatientPublicResponse {
  found: boolean;
  message: string; // Empático
  data?: {
    fullName: string;
    status: PatientStatus;
    location: string; // Nombre del centro o ubicación manual
    lastUpdated: Date;
    registrationSource?: RegistrationSource; // Fuente del registro (para UI público)
  };
}

// ================= FILTROS DE BÚSQUEDA =================

export interface IPatientFilter {
  page?: number;
  rows?: number;
  dni?: string;
  fullName?: string;
  status?: PatientStatus;
  location?: string;
  isActive?: boolean | "true" | "false";
  createdAt?: string; // "startDate,endDate"
  updatedAt?: string;
  export?: boolean;
}
