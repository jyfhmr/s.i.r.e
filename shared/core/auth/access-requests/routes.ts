export const ACCESS_REQUEST_ROUTES = {
  BASE: "auth/access-requests",
  FIND_ALL: "", // GET /auth/access-requests (solo DIOS - ver pendientes)
  FIND_ONE: ":id", // GET /auth/access-requests/:id
  CREATE: "", // POST /auth/access-requests - PÚBLICO (solicitud inicial)
  APPROVE: ":id/approve", // POST /auth/access-requests/:id/approve (solo DIOS)
  REJECT: ":id/reject", // POST /auth/access-requests/:id/reject (solo DIOS)
} as const;
