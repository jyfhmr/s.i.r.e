export interface IStatus {
  id: number;
  status: string;
  module: string;
  color: string;
  // Auditoría
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null; 
}

export interface ICreateStatus {
  status: string;
  module: string;
  color: string;
}

export type IUpdateStatus = Partial<ICreateStatus>;