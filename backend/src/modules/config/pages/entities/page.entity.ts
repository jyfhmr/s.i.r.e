// src/modules/config/pages/entities/page.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProfilePages } from '../../profiles/entities/profilePages.entity';
import { IPage } from '@shared/core/config/pages/interfaces';

@Entity('pages')
export class Page implements IPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  route: string;

  @Column({ nullable: true })
  order: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Page, (page) => page.pageFather)
  pages: Page[];

  @ManyToOne(() => Page, (page) => page.pages, { nullable: true })
  pageFather?: Page;

  @OneToMany(() => ProfilePages, (profilePages) => profilePages.page)
  profilePages: ProfilePages[];
}
