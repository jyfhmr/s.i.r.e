import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbdatasource } from './database/data.source';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { SocketModule } from './socket/socket.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './modules/config/users/users.module';
import { PagesModule } from './modules/config/pages/pages.module';
import { ProfilesModule } from './modules/config/profiles/profiles.module';
import { MedicalCentersModule } from './modules/config/medical-centers/medical-centers.module';
import { PatientsModule } from './modules/medical/patients/patients.module';
import { SearchModule } from './modules/public/search/search.module';
import { AlertsModule } from './modules/citizen/alerts/alerts.module';
import { AccessRequestsModule } from './modules/auth/access-requests/access-requests.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './emails/email.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // Entorno y Servidor
        NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
        SERVER_PORT: Joi.number().default(3000),

        // Frontend
        URL_FRONTEND: Joi.string().uri().required(),

        // Base de datos
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().allow('').required(),
        DB_NAME: Joi.string().required(),

        // Credenciales Resend
        RESEND_API_KEY: Joi.string().required(),

        // Secret de Autenticación
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300000,
      max: 100,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(dbdatasource),
    UsersModule,
    AuthModule,
    PagesModule,
    ProfilesModule,
    MedicalCentersModule,
    PatientsModule,
    SearchModule,
    AlertsModule,
    AccessRequestsModule,
    SocketModule,
    EmailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
