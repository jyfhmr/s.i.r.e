// shared/statuses.ts
import { SUB_PAGES } from "./profile-rules";

export type SubPageType = (typeof SUB_PAGES)[keyof typeof SUB_PAGES];

// 1. Creamos el Enum explícito con los IDs
export enum ExampleEnum {
  EXAMPLE = 1,
}

export interface StatusDefinition {
  id: number;
  status: string;
  module: SubPageType;
  color: string;
}

// 2. Usamos el Enum en nuestro diccionario
// Nota: Los estados de membresía se manejan como strings en enum, no en esta tabla numérica
export const SYSTEM_STATUSES = {
  EXMAPLE: {
    id: ExampleEnum.EXAMPLE,
    status: "Pendiente",
    module: SUB_PAGES.PAGES,
    color: "#fadb14",
  },
} as const satisfies Record<string, StatusDefinition>;
