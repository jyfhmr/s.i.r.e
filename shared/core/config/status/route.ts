export const STATUS_ROUTES = {
  BASE: "config/status",
  FIND_ALL: "",             // GET /config/status
  FIND_ONE: ":id",          // GET /config/status/1
  CREATE: "",               // POST /config/status
  UPDATE: ":id",            // PATCH /config/status/1
  CHANGE_STATUS: ":id/change_status", // PATCH /config/status/1/change_status
  EXPORT: "export",         // GET /config/status/export
  TREASURY: "treasuryStatuses" // GET /config/status/treasuryStatuses
} as const;