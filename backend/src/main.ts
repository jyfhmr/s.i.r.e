import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

// 🔥 POLYFILL PARA HOSTING COMPARTIDO (Evitar WebAssembly OOM) 🔥
if (typeof global.fetch === 'undefined') {
  const nodeFetch = require('node-fetch');
  global.fetch = nodeFetch;
  global.Headers = nodeFetch.Headers;
  global.Request = nodeFetch.Request;
  global.Response = nodeFetch.Response;
}

import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { json, urlencoded } from 'express';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/logger.config';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  // 🔥 1. LA CONFIGURACIÓN CRÍTICA PARA RAILWAY / AWS 🔥
  // Esto asegura que el rate-limiter (Throttler) lea la IP real del usuario
  // y no la IP del balanceador de carga.
  app.set('trust proxy', 1);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigin = process.env.URL_FRONTEND;

      console.log('el origen', origin);

      // 1. Permitimos si no hay origen (Postman, Same-Origin, etc.)
      // 2. O si el origen coincide con nuestro frontend
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        console.error('Bloqueado por CORS. Origen detectado:', origin);
        callback(new Error('Acceso denegado por política de seguridad'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.useStaticAssets('uploads', {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
          typeofValueGiven: typeof err.value,
          valueGiven: err.value,
        }));
        console.log('ERRORES PROCEDENTES DEL DTO', formattedErrors);
        throw new BadRequestException(formattedErrors);
      },
    }),
  );

  // 🔥 2. CORRECCIÓN DE SEGURIDAD (Evitar DDoS por RAM) 🔥
  // Bajamos el límite a algo razonable. 50mb es muchísimo para un JSON,
  // pero suficiente si estás enviando imágenes pequeñas en base64.
  app.use(json({ limit: '30mb' }));
  app.use(urlencoded({ limit: '30mb', extended: true }));

  await app.enableShutdownHooks();
  await app.listen(process.env.SERVER_PORT || 3000);
}

bootstrap();
