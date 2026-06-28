export const PUBLIC_SEARCH_ROUTES = {
  BASE: "search",
  BY_DNI: ":dni", // GET /api/search/:dni - PÚBLICO, sin autenticación
  COUNT: "count", // GET /api/search/count - PÚBLICO, contador de pacientes
} as const;
