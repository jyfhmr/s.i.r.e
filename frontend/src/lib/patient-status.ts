/**
 * Configuración de estados de pacientes para vista pública
 * Por privacidad, solo mostramos "Localizado" sin detalles médicos
 */

import { PatientStatus, RegistrationSource } from "@shared/common";

export interface StatusConfig {
  label: string;
  bgClass: string;
  badgeClass: string;
  description: string;
}

/**
 * Mapa de configuración para cada estado de paciente
 * En la vista pública, todos los pacientes localizados se muestran como "Localizado"
 * para proteger la privacidad médica.
 */
export const PATIENT_STATUS_CONFIG: Record<PatientStatus, StatusConfig> = {
  [PatientStatus.ESTABLE]: {
    label: "Localizado",
    bgClass: "bg-success-light text-success-text border-success-border",
    badgeClass: "bg-emerald-500",
    description: "",
  },

  [PatientStatus.CRITICO]: {
    label: "Localizado",
    bgClass: "bg-success-light text-success-text border-success-border",
    badgeClass: "bg-emerald-500",
    description: "",
  },

  [PatientStatus.CONTACTAR_INMEDIATO]: {
    label: "Localizado",
    bgClass: "bg-success-light text-success-text border-success-border",
    badgeClass: "bg-emerald-500",
    description: "",
  },

  [PatientStatus.DESAPARECIDO]: {
    label: "Persona Desaparecida - Búsqueda Activa",
    bgClass: "bg-info-light text-info-text border-info-border",
    badgeClass: "bg-sky-500",
    description:
      "Esta persona está siendo buscada activamente. Si tiene información sobre su paradero, contacte a las autoridades.",
  },

  [PatientStatus.NO_ESPECIFICADO]: {
    label: "Localizado",
    bgClass: "bg-success-light text-success-text border-success-border",
    badgeClass: "bg-emerald-500",
    description: "",
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

/**
 * Obtiene el texto descriptivo de la fuente de registro
 */
export function getRegistrationSourceInfo(source?: RegistrationSource): {
  icon: string;
  label: string;
} {
  switch (source) {
    case RegistrationSource.PUBLIC_LIST:
      return {
        icon: "📋",
        label: "Recopilado de lista hospitalaria pública",
      };
    case RegistrationSource.MEDICAL_STAFF:
    default:
      return {
        icon: "🏥",
        label: "Registrado por personal médico en el sistema",
      };
  }
}
