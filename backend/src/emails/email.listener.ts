import { Injectable, Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EMAIL_SERVICE_TOKEN, IEmailService, SendEmailDto } from './interfaces';

@Injectable()
export class EmailListener {
    private readonly logger = new Logger(EmailListener.name);

    constructor(@Inject(EMAIL_SERVICE_TOKEN) private readonly emailService: IEmailService) {}

    @OnEvent('email.send', { async: true })
    async handleEmailSendEvent(payload: SendEmailDto) {
        console.log(`Procesando envío a: ${payload.to}`);

        // Ejecutamos el servicio
        await this.emailService.sendEmail(payload);
    }
}
