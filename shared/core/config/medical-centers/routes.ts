export const MEDICAL_CENTER_ROUTES = {
  BASE: "config/medical-centers",
  FIND_ALL: "", // GET /config/medical-centers
  FIND_ONE: ":id", // GET /config/medical-centers/:id
  LIST: "list", // GET /config/medical-centers/list (para dropdown/autocomplete)
  SEARCH: "search", // GET /config/medical-centers/search?q=... (autocomplete liviano)
  CREATE: "", // POST /config/medical-centers
  UPDATE: ":id", // PATCH /config/medical-centers/:id
  CHANGE_STATUS: ":id/change_status", // PATCH /config/medical-centers/:id/change_status
  EXPORT: "export", // GET /config/medical-centers/export
} as const;
