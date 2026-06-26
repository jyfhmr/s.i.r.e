export const USER_ROUTES = {
  BASE: "config/users",
  FIND_ALL: "", // GET /config/users
  FIND_ONE: ":id", // GET /config/users/:id
  LIST: "list", // GET /config/users/list
  CREATE: "", // POST /config/users
  UPDATE: ":id", // PATCH /config/users/:id
  CHANGE_STATUS: ":id/change_status", // PATCH /config/users/:id/change_status
  UPDATE_PASSWORD: "updatePassword", // POST /config/users/updatePassword
  FIND_BY_EMAIL: "changePassByEmail", // POST /config/users/changePassByEmail
  EXPORT: "export", // GET /config/users/export
  UPLOAD_SIGNATURE: "me/signature", // POST /config/users/me/signature
  GET_SIGNATURE: "me/signature", // GET  /config/users/me/signature
} as const;
