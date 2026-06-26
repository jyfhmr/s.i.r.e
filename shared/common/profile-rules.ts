// shared/common/profile-rules.ts
import { ROLES } from "@shared/common";

export const MAIN_PAGES = {
  MEDICAL: "Médico",
  CONFIGURATION: "Configuración",
  FINANCES: "Finanzas",
  SCHEDULE: "Agenda",
  ADMINISTRATION: "Administración",
  TUTORIALS: "Tutoriales",
} as const;

export const SUB_PAGES = {
  PATIENTS: "Pacientes",
  USERS: "Usuarios",
  PROFILES: "Perfiles",
  PAGES: "Páginas",
  STATUS: "Estatus",
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
    pages: [],
  },
  [ROLES.MEDICO]: {
    isGodMode: false,
    pages: [SUB_PAGES.PATIENTS],
  },
  // 👇 Agrega el rol faltante (asumiendo que se llama ENFERMERO o similar)
  [ROLES.USUARIO_COMUN]: {
    isGodMode: false,
    pages: [], // Si no tiene acceso a nada por ahora, déjalo vacío
  },
};
