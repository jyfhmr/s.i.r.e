import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/config/users/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';

@Injectable()
export class PasswordRequestResetUseCase {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(email: string) {
    // 1. Buscar usuario por email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    // Por seguridad, siempre retornamos el mismo mensaje (evita enumeración de usuarios)
    const successMessage =
      'Si ese correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.';

    if (!user) {
      return { message: successMessage };
    }

    // 2. Generar token de restablecimiento (6 dígitos o hash)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = new Date();
    resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 1); // Token válido por 1 hora

    // 3. Guardar token en BD
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await this.userRepository.save(user);

    // 4. Enviar correo con instrucciones
    this.eventEmitter.emit('email.send', {
      to: user.email,
      subject: 'Recuperación de contraseña - S.I.R.E',
      template: 'password-reset',
      context: {
        name: user.name,
        resetToken,
        userId: user.id,
      },
    });

    return { message: successMessage };
  }
}
