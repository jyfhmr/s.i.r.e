import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { EMAIL_SERVICE_TOKEN, IEmailService } from '@/emails/interfaces';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(@Inject(EMAIL_SERVICE_TOKEN) private readonly emailService: IEmailService) {}

  async sendContactMessage(dto: CreateContactDto) {
    const recipient = process.env.CONTACT_EMAIL;

    if (!recipient) {
      this.logger.error(
        'CONTACT_EMAIL no está configurado en el .env. No se puede enviar el mensaje de contacto.',
      );
      throw new HttpException(
        'El servicio de contacto no está disponible en este momento. Inténtalo más tarde.',
        503,
      );
    }

    const sent = await this.emailService.sendEmail({
      to: recipient,
      subject: `Nuevo mensaje de contacto de ${dto.name}`,
      template: 'contact',
      context: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
      },
    });

    if (!sent) {
      throw new HttpException(
        'No pudimos enviar tu mensaje en este momento. Por favor inténtalo de nuevo más tarde.',
        502,
      );
    }

    return {
      success: true,
      message: '¡Gracias! Tu mensaje ha sido enviado correctamente.',
    };
  }
}
