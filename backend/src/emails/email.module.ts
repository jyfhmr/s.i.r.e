import { Global, Module } from '@nestjs/common';
import { ResendEmailService } from './resend-email.service';
import { EMAIL_SERVICE_TOKEN } from './interfaces';
import { EmailListener } from './email.listener';

@Global()
@Module({
  providers: [
    {
      provide: EMAIL_SERVICE_TOKEN,
      useClass: ResendEmailService, // Si mañana cambias a SendGrid, solo cambias esta línea
    },
    EmailListener,
  ],
  controllers: [],
  exports: [EMAIL_SERVICE_TOKEN],
})
export class EmailModule {}
