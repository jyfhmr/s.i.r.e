export const PUBLIC_SEARCH_ROUTES = {
  BASE: "search",
  BY_DNI: ":dni", // GET /api/search/:dni - PÚBLICO, sin autenticación
} as const;
