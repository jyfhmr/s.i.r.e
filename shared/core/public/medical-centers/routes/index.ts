export const PUBLIC_MEDICAL_CENTER_ROUTES = {
  BASE: "public/medical-centers",
  FIND_ALL: "", // GET /api/public/medical-centers - Lista de centros activos
  FIND_ONE: ":id", // GET /api/public/medical-centers/:id - Detalle de centro
} as const;
