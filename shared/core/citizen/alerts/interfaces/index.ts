// ================= INTERFACES DE ENTIDAD =================

export interface IWatchListItem {
  id?: number;
  userId: number; // Usuario civil que creó esta alerta
  watchedDni: string; // Cédula del ser querido a monitorear
  alias?: string; // Apodo/relación opcional: "Mamá", "Hermano Pedro", etc.
  createdAt?: Date;
}

// ================= DTOs =================

export interface ICreateAlertDto {
  watchedDni: string;
  alias?: string;
}

// ================= REGLAS =================

export const MAX_ALERTS_PER_USER = 15;
