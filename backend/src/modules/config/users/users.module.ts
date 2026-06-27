// users.module.ts
import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { HelpersService } from '@/helpers/helpers.service';

// Use Cases
import { UserCreateUseCase } from './use-cases/user-create.use-case';
import { UserUpdateUseCase } from './use-cases/user-update.use-case';
import { UserChangeStatusUseCase } from './use-cases/user-change-status.use-case';
import { UserUpdatePasswordUseCase } from './use-cases/user-update-password.use-case';

// Services
import { UserFindAllService } from './services/user-find-all.service';
import { UserFindOneService } from './services/user-find-one.service';
import { UserListService } from './services/user-list.service';
import { UserFindByUsernameService } from './services/user-find-by-username.service';
import { UserFindByEmailService } from './services/user-find-by-email.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    HelpersService,

    // Use Cases
    UserCreateUseCase,
    UserUpdateUseCase,
    UserChangeStatusUseCase,
    UserUpdatePasswordUseCase,

    // Services
    UserFindAllService,
    UserFindOneService,
    UserListService,
    UserFindByUsernameService,
    UserFindByEmailService,
  ],
  exports: [
    UserFindByUsernameService,
    UserFindOneService,
    UserFindByEmailService,
    UserChangeStatusUseCase,
  ],
})
export class UsersModule {}
