export const ALERT_ROUTES = {
  BASE: "citizen/alerts",
  FIND_ALL: "", // GET /citizen/alerts (mis alertas)
  CREATE: "", // POST /citizen/alerts (agregar cédula a watchlist)
  DELETE: ":id", // DELETE /citizen/alerts/:id (quitar de watchlist)
} as const;
