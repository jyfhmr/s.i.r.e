// src/modules/config/pages/routes.ts
export const PAGE_ROUTES = {
    BASE: 'config/pages',
    FIND_ALL: '', // GET /config/pages
    FIND_ONE: ':id', // GET /config/pages/1
    LIST_ACTIVE: 'list', // GET /config/pages/list
    CREATE: '', // POST /config/pages
    UPDATE: ':id', // PATCH /config/pages/1
    CHANGE_STATUS: ':id/change_status', // PATCH /config/pages/1/change_status
    EXPORT: 'export', // GET /config/pages/export
} as const;