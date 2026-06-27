// shared/common/profile-rules.ts
import { ROLES } from "@shared/common";

export const MAIN_PAGES = {
  MEDICAL: "Médico",
  CONFIGURATION: "Configuración",
} as const;

export const SUB_PAGES = {
  PATIENTS: "Pacientes",
  MEDICAL_CENTERS: "Centros Médicos",
  ACCESS_REQUESTS: "Solicitudes de Acceso",
  MY_ALERTS: "Mis Alertas",
  USERS: "Usuarios",
  PROFILES: "Perfiles",
  PAGES: "Páginas",
} as const;

// Tipos para autocompletado
export type RoleId = (typeof ROLES)[keyof typeof ROLES];

// 🚀 AQUÍ ESTÁ LA MAGIA: Todo centralizado
export const PERMISSIONS_BY_ROLE: Record<
  RoleId,
  { isGodMode: boolean; pages: string[] }
> = {
  [ROLES.DIOS]: {
    isGodMode: true,
    pages: [
      SUB_PAGES.MEDICAL_CENTERS,
      SUB_PAGES.ACCESS_REQUESTS,
      SUB_PAGES.USERS,
      SUB_PAGES.PROFILES,
      SUB_PAGES.PAGES,
    ],
  },
  [ROLES.MEDICO]: {
    isGodMode: false,
    pages: [SUB_PAGES.PATIENTS, SUB_PAGES.MY_ALERTS], // Solo gestiona pacientes
  },
  [ROLES.USUARIO_COMUN]: {
    isGodMode: false,
    pages: [SUB_PAGES.MY_ALERTS], // Solo gestiona sus alertas
  },
};
