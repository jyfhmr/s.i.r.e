import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IWatchListItem } from '@shared/core/citizen/alerts/interfaces';
import { User } from '@/modules/config/users/entities/user.entity';

@Entity('watch_list_items')
export class WatchListItem implements IWatchListItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column()
  watchedDni: string;

  @Column({ nullable: true })
  alias?: string;

  @CreateDateColumn()
  createdAt: Date;
}
