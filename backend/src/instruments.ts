import * as Sentry from '@sentry/nestjs';
import { config } from 'dotenv'; // <-- 1. Importar

config();

console.log('Inicializando Sentry con DSN:', process.env.URL_SENTRY);

if (process.env.URL_SENTRY) {
    Sentry.init({
        dsn: process.env.URL_SENTRY || '',
        sendDefaultPii: true,
    });
} else {
    console.log('No se iniciará sentry, no hay URL');
}
