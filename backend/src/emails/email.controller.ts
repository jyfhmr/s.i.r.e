import { Controller, Get } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Public } from '@/decorators/isPublic.decorator';
import { SendEmailDto } from './interfaces'; // ¡Importamos el DTO!

@Controller('email')
export class EmailController {
    constructor(private eventEmitter: EventEmitter2) {}

    @Public()
    @Get('test-email')
    testEmail() {
        console.log('Encolando correo con EventEmitter...');

        // 💡 Creamos el payload tipado estrictamente con nuestro DTO
        const emailPayload: SendEmailDto = {
            to: 'jyfhmr@gmail.com',
            subject: 'Prueba de Resend + NestJS 🚀',
            template: 'welcome',
            context: {
                name: 'Desarrollador',
                role: 'Admin',
                actionUrl: 'https://tuapp.com/login',
            },
        };

        // Emitimos el evento pasando el payload validado
        this.eventEmitter.emit('email.send', emailPayload);

        return { message: 'El correo se está procesando en segundo plano' };
    }
}
