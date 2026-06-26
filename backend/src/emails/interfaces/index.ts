// 1. Define las propiedades exactas que necesita cada plantilla
export interface WelcomeEmailContext {
  name: string;
  role: string;
  actionUrl: string;
}

// 2. Creamos una Unión Discriminada.
// Esto ata un nombre de plantilla específico con su contexto específico.
export type EmailTemplatePayload =
  | { template: 'welcome'; context: WelcomeEmailContext }
  | { template?: never; context?: never };

// 3. El DTO principal ahora es la intersección de la base y el payload de la plantilla
export type SendEmailDto = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
} & EmailTemplatePayload;

export const EMAIL_SERVICE_TOKEN = Symbol('EMAIL_SERVICE_TOKEN');

export interface IEmailService {
  sendEmail(data: SendEmailDto): Promise<boolean>;
}
