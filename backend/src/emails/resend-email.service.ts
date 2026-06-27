import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { IEmailService, SendEmailDto } from './interfaces';
import PatientAlertEmail from './templates/PatientAlertEmail';
import PasswordResetEmail from './templates/PasswordResetEmail';
import MedicalAccessApprovedEmail from './templates/MedicalAccessApprovedEmail';

// Diccionario de Plantillas (Patrón Strategy)
const TemplateRegistry: Record<string, (context: any) => Promise<string>> = {
  'patient-alert': (ctx) => render(PatientAlertEmail(ctx)),
  'password-reset': (ctx) => render(PasswordResetEmail(ctx)),
  'medical-access-approved': (ctx) => render(MedicalAccessApprovedEmail(ctx)),
};

@Injectable()
export class ResendEmailService implements IEmailService {
  private readonly logger = new Logger(ResendEmailService.name);

  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendEmail(data: SendEmailDto): Promise<boolean> {
    try {
      let finalHtml = data.html;

      // Magia: Buscamos en el registro. Cero condicionales if/else encadenados.
      if (data.template && TemplateRegistry[data.template]) {
        finalHtml = await TemplateRegistry[data.template](data.context);
      }

      const { error } = await this.resend.emails.send({
        from: 'Acme <onboarding@resend.dev>', // Recuerda cambiarlo en prod
        to: data.to,
        subject: data.subject,
        html: finalHtml,
        text: data.text,
      });

      if (error) {
        this.logger.error(`Error de Resend:`, error);
        console.log('el error', error);
        return false;
      }

      this.logger.log(`Correo enviado exitosamente a ${data.to}`);

      return true;
    } catch (error) {
      this.logger.error(`Error inesperado enviando correo`, error);

      return false;
    }
  }
}
