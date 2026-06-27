import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  AccessRequestStatus,
  IMedicalAccessRequest,
} from '@shared/core/auth/access-requests/interfaces';
import { MedicalCenter } from '@/modules/config/medical-centers/entities/medical-center.entity';
import { User } from '@/modules/config/users/entities/user.entity';

@Entity('medical_access_requests')
export class MedicalAccessRequest implements IMedicalAccessRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  dni: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  position: string;

  @ManyToOne(() => MedicalCenter, { nullable: true })
  @JoinColumn({ name: 'medicalCenterId' })
  medicalCenter?: MedicalCenter;

  @Column({ nullable: true })
  medicalCenterId?: number;

  @Column({ nullable: true })
  manualMedicalCenter?: string;

  @Column({
    type: 'enum',
    enum: AccessRequestStatus,
    default: AccessRequestStatus.PENDING,
  })
  status: AccessRequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewedBy' })
  reviewer?: User;

  @Column({ nullable: true })
  reviewedBy?: number;

  @Column({ nullable: true })
  reviewedAt?: Date;
}
