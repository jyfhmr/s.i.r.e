/**
 * Auth Layer - Gestión y validación de sesión con JWT
 * Guarda token, profileId, name, userId en localStorage
 * Maneja login, logout, guards de cliente, y auto-redirección en 401
 */

const API_BASE_URL =
  import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api";

const STORAGE_KEYS = {
  TOKEN: "sire_auth_token",
  PROFILE_ID: "sire_profile_id",
  PROFILE_NAME: "sire_profile_name",
  USER_NAME: "sire_user_name",
  USER_ID: "sire_user_id",
} as const;

// ==================== TIPOS ====================

export interface LoginResponse {
  access_token: string;
  name: string;
  username: string;
  profileId: number;
  profileName?: string;
  userId: number;
}

export interface MenuResponse {
  menu: MenuItem[];
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: string | null;
  route?: string;
  order: number;
  children?: {
    key: string;
    label: string;
    route: string;
    order: number;
  }[];
}

export interface AuthSession {
  token: string;
  profileId: number;
  profileName: string;
  name: string;
  userId: number;
}

// ==================== SESIÓN (localStorage) ====================

export function saveSession(data: LoginResponse): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.TOKEN, data.access_token);
  localStorage.setItem(STORAGE_KEYS.PROFILE_ID, String(data.profileId));
  localStorage.setItem(STORAGE_KEYS.PROFILE_NAME, data.profileName || "");
  localStorage.setItem(STORAGE_KEYS.USER_NAME, data.name);
  localStorage.setItem(STORAGE_KEYS.USER_ID, String(data.userId));
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const profileId = localStorage.getItem(STORAGE_KEYS.PROFILE_ID);
  const profileName = localStorage.getItem(STORAGE_KEYS.PROFILE_NAME);
  const name = localStorage.getItem(STORAGE_KEYS.USER_NAME);
  const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);

  if (!token || !profileId || !name || !userId) return null;

  return {
    token,
    profileId: parseInt(profileId, 10),
    profileName: profileName || "",
    name,
    userId: parseInt(userId, 10),
  };
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.PROFILE_ID);
  localStorage.removeItem(STORAGE_KEYS.PROFILE_NAME);
  localStorage.removeItem(STORAGE_KEYS.USER_NAME);
  localStorage.removeItem(STORAGE_KEYS.USER_ID);

  // Limpiar también los flags falsos del mock antiguo (limpieza)
  sessionStorage.removeItem("sire_user_logged_in");
  sessionStorage.removeItem("sire_medic_logged_in");
  sessionStorage.removeItem("sire_user_name");
  sessionStorage.removeItem("sire_medic_name");
  sessionStorage.removeItem("sire_admin_logged_in");
}

export function logout(): void {
  clearSession();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// ==================== authFetch (Bearer + manejo 401) ====================

export interface AuthFetchOptions extends RequestInit {
  skipAuth?: boolean; // Permite hacer fetch sin Bearer (para endpoints públicos)
}

export async function authFetch<T>(
  endpoint: string,
  options: AuthFetchOptions = {},
): Promise<T> {
  const session = getSession();
  const { skipAuth, ...fetchOptions } = options;

  // Si no hay sesión y no es público, redirigir a login
  if (!skipAuth && !session) {
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
    throw new Error("No hay sesión activa");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Adjuntar Bearer si hay sesión (salvo que sea skipAuth)
  if (session && !skipAuth) {
    headers["Authorization"] = `Bearer ${session.token}`;
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}/${endpoint}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Manejo de 401 (token expirado o inválido)
  if (response.status === 401) {
    clearSession();
    if (typeof window !== "undefined") {
      window.location.replace(
        "/login?error=session_expired&message=Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
      );
    }
    throw new Error("Sesión expirada");
  }

  // Manejo de errores HTTP
  if (!response.ok) {
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
    };
  }

  // Manejo de respuestas vacías (204 No Content, o body vacío en 200)
  // Evita el error: "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
  if (response.status === 204) {
    return null as unknown as T;
  }

  const text = await response.text();
  if (!text) {
    return null as unknown as T;
  }

  return JSON.parse(text) as T;
}

// ==================== LOGIN ====================

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    let errorMessage = "Credenciales incorrectas";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Ignorar error de parseo
    }
    throw new Error(errorMessage);
  }

  const data: LoginResponse = await response.json();
  saveSession(data);
  return data;
}

// ==================== MENÚ DINÁMICO ====================

export async function getMenu(profileId: number): Promise<MenuResponse> {
  // El endpoint de menú es PÚBLICO (cacheable)
  const response = await fetch(`${API_BASE_URL}/auth/menu/${profileId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el menú del usuario");
  }

  return response.json();
}

// ==================== GUARD DE CLIENTE ====================

/**
 * Guard de cliente: ejecutar en páginas /dashboard/*
 * Valida que hay sesión activa, si no → redirige a /login
 * Retorna la sesión si es válida
 */
export function requireAuth(): AuthSession {
  const session = getSession();

  if (!session) {
    if (typeof window !== "undefined") {
      window.location.replace("/login?error=auth_required");
    }
    throw new Error("No autenticado");
  }

  return session;
}

/**
 * Extrae todas las rutas permitidas del menú (planas)
 * Para validar si el usuario tiene acceso a cierta ruta
 */
export function getAllowedRoutes(menu: MenuItem[]): Set<string> {
  const routes = new Set<string>();

  menu.forEach((item) => {
    if (item.route) routes.add(item.route);
    if (item.children) {
      item.children.forEach((child) => {
        if (child.route) routes.add(child.route);
      });
    }
  });

  return routes;
}

/**
 * Verifica si el usuario puede acceder a una ruta específica
 * según su menú dinámico
 */
export function canAccessRoute(menu: MenuItem[], targetRoute: string): boolean {
  const allowedRoutes = getAllowedRoutes(menu);
  return allowedRoutes.has(targetRoute);
}

/**
 * Obtiene la primera ruta válida del menú (para redirección inicial)
 */
export function getFirstRoute(menu: MenuItem[]): string | null {
  if (menu.length === 0) return null;

  // Si el primer item tiene hijos, devolver la ruta del primer hijo
  if (menu[0].children && menu[0].children.length > 0) {
    return menu[0].children[0].route || null;
  }

  // Si no tiene hijos, devolver su ruta directa
  return menu[0].route || null;
}
