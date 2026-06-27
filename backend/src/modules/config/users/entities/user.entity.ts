import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Page } from '../../pages/entities/page.entity';
import { IUser } from '@shared/core/config/user/interfaces';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Profile, (profile) => profile.id)
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date; // Creation date

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date; // Last updated date

  @Column()
  fullName: string;

  @Column({ unique: true })
  dni: string;

  //campos para reiniciar password
  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpiration: Date;
}
