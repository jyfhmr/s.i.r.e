import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  // Instanciamos el logger de NestJS (que por debajo usará Winston automáticamente)
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determinar el estado HTTP
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let extractedMessage = exception.message || 'Internal server error';
    let extractedCode = undefined;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      // Si le pasamos un objeto (ej. { message: '...', code: '...' })
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        extractedMessage = (exceptionResponse as any).message || extractedMessage;
        extractedCode = (exceptionResponse as any).code || undefined;
      } else if (typeof exceptionResponse === 'string') {
        extractedMessage = exceptionResponse;
      }
    }

    // Crear el objeto de respuesta conservando tu estructura
    const errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: extractedMessage,
    };

    // Si tu Guard (u otro lugar) mandó un "code", lo adjuntamos a la respuesta
    if (extractedCode) {
      errorResponse.code = extractedCode;
    }

    // Delegamos el registro del error a nuestro Logger
    this.logger.error(
      `Error en ${request.method} ${request.url} - Mensaje: ${
        Array.isArray(extractedMessage) ? extractedMessage.join(', ') : extractedMessage
      }`,
      exception instanceof Error ? exception.stack : 'No stack trace available',
    );

    // Enviar la respuesta al cliente
    response.status(status).json(errorResponse);
  }
}
