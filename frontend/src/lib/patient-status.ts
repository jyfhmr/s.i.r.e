/**
 * Configuración de estados de pacientes
 * Mapeo único de los 4 estados reales del enum PatientStatus (@shared/common)
 * a sus representaciones visuales y textos empáticos
 */

import { PatientStatus } from "@shared/common";

export interface StatusConfig {
  label: string;
  bgClass: string;
  badgeClass: string;
  description: string;
}

/**
 * Mapa de configuración para cada estado de paciente
 * Alineado con el enum real del backend
 */
export const PATIENT_STATUS_CONFIG: Record<PatientStatus, StatusConfig> = {
  [PatientStatus.ESTABLE]: {
    label: "Localizado - Estable",
    bgClass: "bg-success-light text-success-text border-success-border",
    badgeClass: "bg-emerald-500",
    description:
      "La persona se encuentra bien, fuera de peligro inmediato. Está recibiendo atención médica de rutina.",
  },

  [PatientStatus.CRITICO]: {
    label: "Localizado - Situación Crítica",
    bgClass: "bg-error-light text-error-text border-error-border",
    badgeClass: "bg-rose-500",
    description:
      "Bajo cuidado médico intensivo. Se solicita a los familiares directos contactar urgentemente con el centro de salud.",
  },

  [PatientStatus.CONTACTAR_INMEDIATO]: {
    label: "Localizado - Contactar Inmediatamente",
    bgClass: "bg-alert-light text-alert-text border-alert-border",
    badgeClass: "bg-amber-500",
    description:
      "Es necesario el contacto urgente de familiares directos. Por favor dirigirse al centro de salud indicado a la brevedad.",
  },

  [PatientStatus.DESAPARECIDO]: {
    label: "Persona Desaparecida - Búsqueda Activa",
    bgClass: "bg-info-light text-info-text border-info-border",
    badgeClass: "bg-sky-500",
    description:
      "Esta persona está siendo buscada activamente. Si tiene información sobre su paradero, contacte a las autoridades.",
  },
};

/**
 * Obtiene la configuración de un estado
 * Con fallback a ESTABLE si el estado no existe
 */
export function getStatusConfig(status: PatientStatus): StatusConfig {
  return (
    PATIENT_STATUS_CONFIG[status] ||
    PATIENT_STATUS_CONFIG[PatientStatus.ESTABLE]
  );
}
