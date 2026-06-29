// ================= RESPUESTA PÚBLICA DE CENTROS MÉDICOS =================

export interface IPublicMedicalCenterResponse {
  id: number;
  name: string;
  state: string;
  municipality?: string;
  address?: string;
  isActive: boolean;
}

export interface IPublicMedicalCenterDetailResponse extends IPublicMedicalCenterResponse {
  createdAt: Date;
  updatedAt: Date;
}
