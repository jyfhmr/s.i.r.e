// ================= INTERFACES DE ENTIDAD =================

export enum AccessRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IMedicalAccessRequest {
  id?: number;
  fullName: string;
  dni: string;
  email: string;
  phoneNumber: string;
  position: string; // Cargo: "Médico", "Enfermero", "Paramédico", etc.
  medicalCenterId?: number; // Centro donde trabaja (opcional, puede escribir a mano)
  manualMedicalCenter?: string; // Si el centro no está en el catálogo
  status: AccessRequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
  reviewedBy?: number; // ID del DIOS que aprobó/rechazó
  reviewedAt?: Date;
}

// ================= DTOs =================

export interface ICreateAccessRequestDto {
  fullName: string;
  dni: string;
  email: string;
  phoneNumber: string;
  position: string;
  medicalCenterId?: number;
  manualMedicalCenter?: string;
}

export interface IApproveAccessRequestDto {
  password: string; // Contraseña inicial para el nuevo médico
}

// ================= FILTROS =================

export interface IAccessRequestFilter {
  page?: number;
  rows?: number;
  status?: AccessRequestStatus;
  fullName?: string;
  dni?: string;
  email?: string;
  createdAt?: string;
  export?: boolean;
}
