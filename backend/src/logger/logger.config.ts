import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Determinamos en qué entorno estamos
const isProduction = process.env.NODE_ENV === 'production';

// Formato personalizado para la consola en desarrollo
const consoleFormat = format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, context, stack }) => {
        return `${timestamp} [${context || 'Application'}] ${level}: ${message} ${stack ? `\n${stack}` : ''}`;
    })
);

export const winstonConfig = {
    // En producción guardamos desde 'info' en adelante. En desarrollo queremos ver 'debug'
    level: isProduction ? 'info' : 'debug',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }), // Captura el stack trace de los errores
        format.splat(),
        format.json() // Para producción, el formato JSON es mejor para herramientas de análisis
    ),
    transports: [
        // 1. Transporte de Consola (Ideal para Desarrollo)
        new transports.Console({
            format: consoleFormat,
        }),

        // 2. Transporte de Archivo para TODOS los logs (Rotación diaria)
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true, // Comprime los logs viejos en .gz para ahorrar espacio
            maxSize: '20m', // Si el archivo supera los 20MB, crea uno nuevo
            maxFiles: '14d', // ¡CLAVE! Elimina los archivos de más de 14 días
            level: 'info', // Registra todo lo que sea info, warn o error
        }),

        // 3. Transporte de Archivo SOLO para ERRORES (Rotación diaria)
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d', // Guardamos los errores por más tiempo (30 días)
            level: 'error', // Solo registra cuando ocurre un error
        }),
    ],
};
