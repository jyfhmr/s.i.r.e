// 1. Define las propiedades exactas que necesita cada plantilla
export interface PatientAlertEmailContext {
  recipientName: string;
  patientName: string;
  alias?: string;
  status: string;
  location: string;
  dni: string;
}

export interface PasswordResetEmailContext {
  name: string;
  resetToken: string;
  userId: number;
}

export interface MedicalAccessApprovedEmailContext {
  fullName: string;
  email: string;
  position: string;
  medicalCenter: string;
}

export interface ContactEmailContext {
  name: string;
  email: string;
  message: string;
}

// 2. Creamos una Unión Discriminada.
// Esto ata un nombre de plantilla específico con su contexto específico.
export type EmailTemplatePayload =
  | { template: 'patient-alert'; context: PatientAlertEmailContext }
  | { template: 'password-reset'; context: PasswordResetEmailContext }
  | { template: 'medical-access-approved'; context: MedicalAccessApprovedEmailContext }
  | { template: 'contact'; context: ContactEmailContext }
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
