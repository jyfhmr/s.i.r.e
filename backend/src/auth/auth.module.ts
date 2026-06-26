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

@Module({
  imports: [
    UsersModule,
    ProfilesModule,

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HelpersService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
