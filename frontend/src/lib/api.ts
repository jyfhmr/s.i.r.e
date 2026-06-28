/**
 * API Layer - Conexión con el backend de S.I.R.E.
 * Fuente única de verdad para rutas, DTOs e interfaces de @shared
 */

import { authFetch } from "./auth";
import { PUBLIC_SEARCH_ROUTES } from "@shared/core/public/search/routes";
import { CONTACT_ROUTES } from "@shared/core/public/contact/routes";
import { ACCESS_REQUEST_ROUTES } from "@shared/core/auth/access-requests/routes";
import { PATIENT_ROUTES } from "@shared/core/medical/patients/routes";
import { ALERT_ROUTES } from "@shared/core/citizen/alerts/routes";
import { MEDICAL_CENTER_ROUTES } from "@shared/core/config/medical-centers/routes";
import { USER_ROUTES } from "@shared/core/config/user/routes";
import { PAGE_ROUTES } from "@shared/core/config/pages/routes";
import type {
  IPatientPublicResponse,
  IUpsertPatientDto,
  IPatientFilter,
  IPatient,
  IPatientStatusLog,
} from "@shared/core/medical/patients/interfaces";
import type {
  ICreateAccessRequestDto,
  IApproveAccessRequestDto,
  IAccessRequestFilter,
  IMedicalAccessRequest,
} from "@shared/core/auth/access-requests/interfaces";
import type {
  ICreateAlertDto,
  IWatchListItem,
} from "@shared/core/citizen/alerts/interfaces";
import type { ICreateContactDto } from "@shared/core/public/contact/interfaces";
import type {
  IMedicalCenter,
  ICreateMedicalCenterDto,
  IUpdateMedicalCenterDto,
  IMedicalCenterFilter,
} from "@shared/core/config/medical-centers/interfaces";
import type {
  IUser,
  ICreateUserDto,
  IUpdateUserDto,
  IUserFilter,
} from "@shared/core/config/user/interfaces";
import type {
  IPage,
  ICreatePageDto,
  IUpdatePageDto,
  IPageFilter,
} from "@shared/core/config/pages/interfaces";
import type { PatientStatus } from "@shared/common";

const API_BASE_URL =
  import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api";

// ==================== TIPOS DE ERROR ====================

export interface ApiError {
  message: string;
  statusCode?: number;
  isRateLimit?: boolean;
}

// ==================== HELPERS PRIVADOS ====================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Rate limiting (429)
    if (response.status === 429) {
      throw {
        message:
          "Has realizado demasiadas búsquedas. Por favor espera un momento antes de intentar nuevamente.",
        statusCode: 429,
        isRateLimit: true,
      } as ApiError;
    }

    // Otros errores HTTP
    let errorMessage = `Error del servidor (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Si no se puede parsear el JSON, usar mensaje genérico
    }

    throw {
      message: errorMessage,
      statusCode: response.status,
    } as ApiError;
  }

  return response.json();
}

// ==================== BÚSQUEDA PÚBLICA (CU 2) ====================

/**
 * Busca un paciente por su número de cédula/DNI
 * Endpoint: GET /api/search/:dni
 * @param dni - Cédula del paciente (sin formato, solo números)
 * @throws {ApiError} Si hay error de red o el servidor responde con error
 */
export async function searchPatientByDni(
  dni: string,
): Promise<IPatientPublicResponse> {
  // Limpiar cédula: solo números
  const cleanDni = dni.replace(/[^0-9]/g, "");

  if (!cleanDni) {
    throw {
      message: "Por favor ingresa un número de cédula válido",
      statusCode: 400,
    } as ApiError;
  }

  try {
    const url = `${API_BASE_URL}/${PUBLIC_SEARCH_ROUTES.BASE}/${cleanDni}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<IPatientPublicResponse>(response);
  } catch (error) {
    // Si es un ApiError, lo propagamos
    if ((error as ApiError).message) {
      throw error;
    }

    // Error de red u otro error desconocido
    throw {
      message:
        "No se pudo conectar con el servidor. Por favor verifica tu conexión a internet.",
      statusCode: 0,
    } as ApiError;
  }
}

// ==================== CONTADOR PÚBLICO DE PACIENTES ====================

/**
 * Obtiene el número total de pacientes registrados en el sistema
 * Endpoint: GET /api/search/count
 */
export async function getPatientCount(): Promise<{ total: number }> {
  try {
    const url = `${API_BASE_URL}/${PUBLIC_SEARCH_ROUTES.BASE}/${PUBLIC_SEARCH_ROUTES.COUNT}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<{ total: number }>(response);
  } catch (error) {
    // Si falla, devolvemos 0 silenciosamente (no crítico)
    return { total: 0 };
  }
}

// ==================== SOLICITUD DE ACCESO MÉDICO (CU 4) ====================

/**
 * Crea una solicitud de acceso médico (Personal de Salud)
 * Endpoint: POST /api/auth/access-requests
 * @param dto - Datos del profesional de salud
 * @throws {ApiError} Si hay error de red o validación
 */
export async function createMedicalAccessRequest(
  dto: ICreateAccessRequestDto,
): Promise<{ success: boolean; message: string }> {
  try {
    const url = `${API_BASE_URL}/${ACCESS_REQUEST_ROUTES.BASE}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    return handleResponse<{ success: boolean; message: string }>(response);
  } catch (error) {
    // Si es un ApiError, lo propagamos
    if ((error as ApiError).message) {
      throw error;
    }

    // Error de red u otro error desconocido
    throw {
      message:
        "No se pudo enviar la solicitud. Por favor verifica tu conexión a internet.",
      statusCode: 0,
    } as ApiError;
  }
}

// ==================== CONTACTO (PÚBLICO) ====================

/**
 * Envía un mensaje desde el formulario de contacto
 * Endpoint: POST /api/contact
 * @param dto - Nombre, correo y mensaje del usuario
 * @throws {ApiError} Si hay error de red o validación
 */
export async function sendContactMessage(
  dto: ICreateContactDto,
): Promise<{ success: boolean; message: string }> {
  try {
    const url = `${API_BASE_URL}/${CONTACT_ROUTES.BASE}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    return handleResponse<{ success: boolean; message: string }>(response);
  } catch (error) {
    // Si es un ApiError, lo propagamos
    if ((error as ApiError).message) {
      throw error;
    }

    // Error de red u otro error desconocido
    throw {
      message:
        "No se pudo enviar tu mensaje. Por favor verifica tu conexión a internet.",
      statusCode: 0,
    } as ApiError;
  }
}

// ==================== AUTENTICACIÓN (CU 6, CU 7, CU 9) ====================

/**
 * Registro de ciudadano (CU 6)
 * Endpoint: POST /api/auth/register/citizen
 */
export async function registerCitizen(data: {
  fullName: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; message: string }> {
  return authFetch("auth/register/citizen", {
    method: "POST",
    body: JSON.stringify(data),
    skipAuth: true,
  });
}

/**
 * Solicitar reset de contraseña (CU 7)
 * Endpoint: POST /api/auth/password/request-reset
 */
export async function requestPasswordReset(
  email: string,
): Promise<{ success: boolean; message: string }> {
  return authFetch("auth/password/request-reset", {
    method: "POST",
    body: JSON.stringify({ email }),
    skipAuth: true,
  });
}

/**
 * Resetear contraseña con token (CU 7)
 * Endpoint: POST /api/auth/password/reset
 */
export async function resetPassword(
  userId: number,
  token: string,
  password: string,
): Promise<{ success: boolean; message: string }> {
  return authFetch("auth/password/reset", {
    method: "POST",
    body: JSON.stringify({ userId, token, password }),
    skipAuth: true,
  });
}

// ==================== PACIENTES (CU 1, CU 8) ====================

/**
 * Upsert (crear o actualizar) paciente
 * Endpoint: POST /api/medical/patients
 */
export async function upsertPatient(dto: IUpsertPatientDto): Promise<IPatient> {
  return authFetch(PATIENT_ROUTES.BASE, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/**
 * Listar pacientes del médico autenticado (paginado)
 * Endpoint: GET /api/medical/patients
 */
export async function findAllPatients(
  filters?: IPatientFilter,
): Promise<{ data: IPatient[]; total: number }> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const endpoint = `${PATIENT_ROUTES.BASE}?${params.toString()}`;
  return authFetch(endpoint, { method: "GET" });
}

/**
 * Buscar paciente por DNI (buscador global para médicos)
 * Endpoint: GET /api/medical/patients/search/:dni
 */
export async function searchPatientByDniMedical(
  dni: string,
): Promise<IPatient | null> {
  const cleanDni = dni.replace(/[^0-9]/g, "");
  return authFetch(
    `${PATIENT_ROUTES.BASE}/${PATIENT_ROUTES.SEARCH_BY_DNI.replace(":dni", cleanDni)}`,
    {
      method: "GET",
    },
  );
}

/**
 * Obtener historial completo de un paciente (bitácora)
 * Endpoint: GET /api/medical/patients/:id/history
 */
export async function getPatientHistory(
  patientId: number,
): Promise<IPatientStatusLog[]> {
  return authFetch(`${PATIENT_ROUTES.BASE}/${patientId}/history`, {
    method: "GET",
  });
}

// ==================== ALERTAS (CU 3) ====================

/**
 * Listar las alertas del usuario autenticado
 * Endpoint: GET /api/citizen/alerts
 */
export async function findAllAlerts(): Promise<IWatchListItem[]> {
  return authFetch(ALERT_ROUTES.BASE, { method: "GET" });
}

/**
 * Crear una nueva alerta (agregar cédula a watchlist)
 * Endpoint: POST /api/citizen/alerts
 */
export async function createAlert(
  dto: ICreateAlertDto,
): Promise<IWatchListItem> {
  return authFetch(ALERT_ROUTES.BASE, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/**
 * Eliminar alerta (quitar de watchlist)
 * Endpoint: DELETE /api/citizen/alerts/:id
 */
export async function deleteAlert(id: number): Promise<{ success: boolean }> {
  return authFetch(`${ALERT_ROUTES.BASE}/${id}`, { method: "DELETE" });
}

// ==================== CENTROS MÉDICOS (CU 5) ====================

/**
 * Listar todos los centros médicos (paginado)
 * Endpoint: GET /api/config/medical-centers
 */
export async function findAllMedicalCenters(
  filters?: IMedicalCenterFilter,
): Promise<{ data: IMedicalCenter[]; total: number }> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const endpoint = `${MEDICAL_CENTER_ROUTES.BASE}?${params.toString()}`;
  return authFetch(endpoint, { method: "GET" });
}

/**
 * Buscar centros médicos (autocomplete)
 * Endpoint: GET /api/config/medical-centers/search?q=...
 */
export async function searchMedicalCenters(
  query: string,
  skipAuth?: boolean,
): Promise<IMedicalCenter[]> {
  return authFetch(
    `${MEDICAL_CENTER_ROUTES.BASE}/${MEDICAL_CENTER_ROUTES.SEARCH}?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      skipAuth,
    },
  );
}

/**
 * Lista simple de centros (dropdown)
 * Endpoint: GET /api/config/medical-centers/list
 */
export async function listMedicalCenters(): Promise<IMedicalCenter[]> {
  return authFetch(
    `${MEDICAL_CENTER_ROUTES.BASE}/${MEDICAL_CENTER_ROUTES.LIST}`,
    {
      method: "GET",
    },
  );
}

/**
 * Crear centro médico
 * Endpoint: POST /api/config/medical-centers
 */
export async function createMedicalCenter(
  dto: ICreateMedicalCenterDto,
): Promise<IMedicalCenter> {
  return authFetch(MEDICAL_CENTER_ROUTES.BASE, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/**
 * Actualizar centro médico
 * Endpoint: PATCH /api/config/medical-centers/:id
 */
export async function updateMedicalCenter(
  id: number,
  dto: IUpdateMedicalCenterDto,
): Promise<IMedicalCenter> {
  return authFetch(`${MEDICAL_CENTER_ROUTES.BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
}

/**
 * Cambiar estado de centro médico (activar/desactivar)
 * Endpoint: PATCH /api/config/medical-centers/:id/change_status
 */
export async function changeMedicalCenterStatus(
  id: number,
): Promise<{ success: boolean }> {
  return authFetch(`${MEDICAL_CENTER_ROUTES.BASE}/${id}/change_status`, {
    method: "PATCH",
  });
}

// ==================== SOLICITUDES DE ACCESO (CU 5) ====================

/**
 * Listar solicitudes de acceso médico
 * Endpoint: GET /api/auth/access-requests
 */
export async function findAllAccessRequests(
  filters?: IAccessRequestFilter,
): Promise<{ data: IMedicalAccessRequest[]; total: number }> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const endpoint = `${ACCESS_REQUEST_ROUTES.BASE}?${params.toString()}`;
  return authFetch(endpoint, { method: "GET" });
}

/**
 * Aprobar solicitud de acceso médico
 * Endpoint: POST /api/auth/access-requests/:id/approve
 */
export async function approveAccessRequest(
  id: number,
  dto: IApproveAccessRequestDto,
): Promise<{ success: boolean; message: string }> {
  return authFetch(`${ACCESS_REQUEST_ROUTES.BASE}/${id}/approve`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/**
 * Rechazar solicitud de acceso médico
 * Endpoint: POST /api/auth/access-requests/:id/reject
 */
export async function rejectAccessRequest(
  id: number,
): Promise<{ success: boolean; message: string }> {
  return authFetch(`${ACCESS_REQUEST_ROUTES.BASE}/${id}/reject`, {
    method: "POST",
  });
}

// ==================== USUARIOS (CU 5 - ADMIN) ====================

/**
 * Listar usuarios (paginado)
 * Endpoint: GET /api/config/users
 */
export async function findAllUsers(
  filters?: IUserFilter,
): Promise<{ data: IUser[]; total: number }> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const endpoint = `${USER_ROUTES.BASE}?${params.toString()}`;
  return authFetch(endpoint, { method: "GET" });
}

/**
 * Lista simple de usuarios
 * Endpoint: GET /api/config/users/list
 */
export async function listUsers(): Promise<IUser[]> {
  return authFetch(`${USER_ROUTES.BASE}/${USER_ROUTES.LIST}`, {
    method: "GET",
  });
}

/**
 * Crear usuario
 * Endpoint: POST /api/config/users
 */
export async function createUser(dto: ICreateUserDto): Promise<IUser> {
  return authFetch(USER_ROUTES.BASE, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/**
 * Actualizar usuario
 * Endpoint: PATCH /api/config/users/:id
 */
export async function updateUser(
  id: number,
  dto: IUpdateUserDto,
): Promise<IUser> {
  return authFetch(`${USER_ROUTES.BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
}

/**
 * Cambiar estado de usuario (activar/desactivar)
 * Endpoint: PATCH /api/config/users/:id/change_status
 */
export async function changeUserStatus(
  id: number,
): Promise<{ success: boolean }> {
  return authFetch(`${USER_ROUTES.BASE}/${id}/change_status`, {
    method: "PATCH",
  });
}

// ==================== PÁGINAS (CU 5 - ADMIN) ====================

/**
 * Listar páginas (paginado)
 * Endpoint: GET /api/config/pages
 */
export async function findAllPages(
  filters?: IPageFilter,
): Promise<{ data: IPage[]; total: number }> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const endpoint = `${PAGE_ROUTES.BASE}?${params.toString()}`;
  return authFetch(endpoint, { method: "GET" });
}

/**
 * Lista de páginas activas
 * Endpoint: GET /api/config/pages/list
 */
export async function listActivePages(): Promise<IPage[]> {
  return authFetch(`${PAGE_ROUTES.BASE}/${PAGE_ROUTES.LIST_ACTIVE}`, {
    method: "GET",
  });
}

/**
 * Crear página
 * Endpoint: POST /api/config/pages
 */
export async function createPage(dto: ICreatePageDto): Promise<IPage> {
  return authFetch(PAGE_ROUTES.BASE, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

/**
 * Actualizar página
 * Endpoint: PATCH /api/config/pages/:id
 */
export async function updatePage(
  id: number,
  dto: IUpdatePageDto,
): Promise<IPage> {
  return authFetch(`${PAGE_ROUTES.BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
}

/**
 * Cambiar estado de página
 * Endpoint: PATCH /api/config/pages/:id/change_status
 */
export async function changePageStatus(
  id: number,
): Promise<{ success: boolean }> {
  return authFetch(`${PAGE_ROUTES.BASE}/${id}/change_status`, {
    method: "PATCH",
  });
}
