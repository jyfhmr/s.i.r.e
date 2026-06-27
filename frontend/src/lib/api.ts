/**
 * API Layer - Conexión con el backend de S.I.R.E.
 * Fuente única de verdad para rutas, DTOs e interfaces de @shared
 */

import { PUBLIC_SEARCH_ROUTES } from "@shared/core/public/search/routes";
import { ACCESS_REQUEST_ROUTES } from "@shared/core/auth/access-requests/routes";
import type { IPatientPublicResponse } from "@shared/core/medical/patients/interfaces";
import type { ICreateAccessRequestDto } from "@shared/core/auth/access-requests/interfaces";

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
