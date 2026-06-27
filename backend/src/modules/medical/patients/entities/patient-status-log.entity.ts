import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPatientStatusLog } from '@shared/core/medical/patients/interfaces';
import { PatientStatus } from '@shared/common';
import { Patient } from './patient.entity';
import { MedicalCenter } from '@/modules/config/medical-centers/entities/medical-center.entity';
import { User } from '@/modules/config/users/entities/user.entity';

@Entity('patient_status_logs')
export class PatientStatusLog implements IPatientStatusLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.statusLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: number;

  @Column({
    type: 'enum',
    enum: PatientStatus,
  })
  status: PatientStatus;

  // Relación opcional al centro médico (trazabilidad histórica)
  @ManyToOne(() => MedicalCenter, { nullable: true })
  @JoinColumn({ name: 'medicalCenterId' })
  medicalCenter?: MedicalCenter;

  @Column({ nullable: true })
  medicalCenterId?: number;

  // Ubicación manual histórica
  @Column({ nullable: true })
  manualLocation?: string;

  // Médico que hizo este cambio (NUNCA se expone públicamente)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'updatedBy' })
  updatedByUser: User;

  @Column()
  updatedBy: number;

  @CreateDateColumn()
  createdAt: Date; // Inmutable - cuándo ocurrió este cambio
}
