import { RegistrationSource } from "@shared/common";

// ================= RESPUESTA PÚBLICA DE PACIENTES =================

export interface IPublicPatientResponse {
  dni: string;
  fullName: string;
  location: string; // Nombre del centro médico o ubicación manual
  lastUpdated: Date;
  registrationSource?: RegistrationSource;
}

export interface IPublicPatientListResponse {
  data: IPublicPatientResponse[];
  total: number;
  page: number;
  rows: number;
}
