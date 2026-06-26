import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IStatus } from '@shared/core/config/status/interfaces';

@Entity()
export class Status implements IStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  module: string;

  @Column({ default: 'white' })
  color: string;

  // --- AUDITORÍA AUTOMÁTICA ---
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
