// src/modules/config/profiles/profiles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from './profiles.controller';
import { Profile } from './entities/profile.entity';
import { ProfilePages } from './entities/profilePages.entity';
import { UsersModule } from '../users/users.module';
import { HelpersService } from '@/helpers/helpers.service';

// Use Cases
import { ProfileCreateUseCase } from './use-cases/profile-create.use-case';
import { ProfileUpdateUseCase } from './use-cases/profile-update.use-case';
import { ProfileChangeStatusUseCase } from './use-cases/profile-change-status.use-case';

// Services
import { ProfileFindAllService } from './services/profile-find-all.service';
import { ProfileFindOneService } from './services/profile-find-one.service';
import { ProfileListService } from './services/profile-list.service';
import { ProfileGetAssignableService } from './services/profile-get-assignable.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, ProfilePages]), UsersModule],
  controllers: [ProfilesController],
  providers: [
    HelpersService,
    // Use Cases
    ProfileCreateUseCase,
    ProfileUpdateUseCase,
    ProfileChangeStatusUseCase,
    // Services
    ProfileFindAllService,
    ProfileFindOneService,
    ProfileListService,
    ProfileGetAssignableService,
  ],
  exports: [
    ProfileFindOneService, // Por si otros módulos necesitan consultar perfiles
  ],
})
export class ProfilesModule {}
