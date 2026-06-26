// src/modules/config/profiles/routes.ts
export const PROFILE_ROUTES = {
    BASE: 'config/profiles',
    FIND_ALL: '', // GET /config/profiles
    FIND_ONE: ':id', // GET /config/profiles/:id
    CREATE: '', // POST /config/profiles
    UPDATE: ':id', // PATCH /config/profiles/:id
    CHANGE_STATUS: ':id/change_status', // PATCH /config/profiles/:id/change_status
    LIST: 'list', // GET /config/profiles/list (perfiles activos)
    ASSIGNABLE_PROFILES: 'assignable-profiles', // GET /config/profiles/assignable-profiles
    EXPORT: 'export', // GET /config/profiles/export
} as const;