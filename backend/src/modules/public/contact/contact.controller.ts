import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { CONTACT_ROUTES } from '@shared/core/public/contact/routes';
import { Public } from '@/decorators/isPublic.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller(CONTACT_ROUTES.BASE)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Endpoint PÚBLICO - Sin autenticación
  // Throttle estricto para evitar spam del formulario
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 mensajes por minuto por IP
  @Post(CONTACT_ROUTES.CREATE)
  create(@Body() dto: CreateContactDto) {
    return this.contactService.sendContactMessage(dto);
  }
}
