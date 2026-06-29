// ================= RESPUESTA PÚBLICA DE ESTADÍSTICAS =================

export interface IPublicStatsResponse {
  totalPatients: number;
  totalMedicalCenters: number;
  patientsByStatus: Array<{ status: string; count: number }>;
  lastUpdated: Date;
}
