export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export const ROLES = {
  DIOS: 1,
  MEDICO: 2,
  USUARIO_COMUN: 3,
} as const;

export enum PatientStatus {
  ESTABLE = "ESTABLE",
  CRITICO = "CRÍTICO",
  CONTACTAR_INMEDIATO = "CONTACTAR_INMEDIATO",
  DESAPARECIDO = "DESAPARECIDO",
  NO_ESPECIFICADO = "NO ESPECIFICADO",
}

/**
 * Fuente de registro del paciente
 * - MEDICAL_STAFF: Registrado directamente por personal médico en el sistema
 * - PUBLIC_LIST: Recopilado de un listado público publicado por un hospital
 */
export enum RegistrationSource {
  MEDICAL_STAFF = "MEDICAL_STAFF",
  PUBLIC_LIST = "PUBLIC_LIST",
}
