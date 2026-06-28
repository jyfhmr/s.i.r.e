export const PATIENT_ROUTES = {
  BASE: "medical/patients",
  FIND_ALL: "", // GET /medical/patients (solo del médico autenticado)
  FIND_ONE: ":id", // GET /medical/patients/:id
  SEARCH_BY_DNI: "search/:dni", // GET /medical/patients/search/:dni (buscador global para médicos)
  UPSERT: "", // POST /medical/patients (crear o actualizar - inteligente)
  EXPORT: "export", // GET /medical/patients/export
  HISTORY: ":id/history", // GET /medical/patients/:id/history (bitácora completa)
  BULK_IMPORT: "admin/bulk-import", // POST /medical/patients/admin/bulk-import (solo DIOS)
} as const;
