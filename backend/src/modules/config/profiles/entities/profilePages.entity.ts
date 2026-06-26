import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Page } from '../../pages/entities/page.entity';

@Entity('profiles_pages')
export class ProfilePages {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, (profile) => profile.profilePages, { onDelete: 'CASCADE' })
  profile: Profile;

  @ManyToOne(() => Page, (page) => page.profilePages, { onDelete: 'CASCADE' })
  page: Page;
}
