import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IPatient } from '@shared/core/medical/patients/interfaces';
import { PatientStatus } from '@shared/common';
import { MedicalCenter } from '@/modules/config/medical-centers/entities/medical-center.entity';
import { User } from '@/modules/config/users/entities/user.entity';
import { PatientStatusLog } from './patient-status-log.entity';

@Entity('patients')
export class Patient implements IPatient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  dni: string;

  @Column()
  fullName: string;

  @Column({
    type: 'enum',
    enum: PatientStatus,
  })
  currentStatus: PatientStatus;

  // Relación opcional al centro médico del catálogo
  @ManyToOne(() => MedicalCenter, { nullable: true })
  @JoinColumn({ name: 'currentMedicalCenterId' })
  currentMedicalCenter?: MedicalCenter;

  @Column({ nullable: true })
  currentMedicalCenterId?: number;

  // Ubicación manual (si el centro no está en el catálogo)
  @Column({ nullable: true })
  manualLocation?: string;

  // Médico que hizo la última actualización (NUNCA se expone públicamente)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'lastUpdatedBy' })
  lastUpdatedByUser?: User;

  @Column({ nullable: true })
  lastUpdatedBy?: number;

  @Column({ nullable: true })
  lastUpdatedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relación a la bitácora
  @OneToMany(() => PatientStatusLog, (log) => log.patient)
  statusLogs: PatientStatusLog[];
}
