import { Module, forwardRef } from '@nestjs/common'; // <-- forwardRef por si acaso hay dependencias circulares con Auth
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ProfilesModule } from '@/modules/config/profiles/profiles.module';
import { UsersModule } from '@/modules/config/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/config/users/entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { HelpersService } from '@/helpers/helpers.service';
import { RegisterCitizenUseCase } from './use-cases/register-citizen.use-case';
import { PasswordRequestResetUseCase } from './use-cases/password-request-reset.use-case';
import { PasswordResetUseCase } from './use-cases/password-reset.use-case';
import { PasswordChangeUseCase } from './use-cases/password-change.use-case';
import { Profile } from '@/modules/config/profiles/entities/profile.entity';

@Module({
  imports: [
    UsersModule,
    ProfilesModule,

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forFeature([User, Profile]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HelpersService,
    RegisterCitizenUseCase,
    PasswordRequestResetUseCase,
    PasswordResetUseCase,
    PasswordChangeUseCase,
    {
      provide: APP_GUARD,

      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
