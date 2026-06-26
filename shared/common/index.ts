export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export const ROLES = {
  DIOS: 1,
  MEDICO: 2,
  USUARIO_COMUN: 3,
} as const;
