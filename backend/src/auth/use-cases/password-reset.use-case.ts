import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/config/users/entities/user.entity';

@Injectable()
export class PasswordResetUseCase {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async execute(userId: number, token: string, newPassword: string) {
    // 1. Buscar usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('Token inválido o expirado', 400);
    }

    // 2. Validar token
    if (user.resetToken !== token) {
      throw new HttpException('Token inválido o expirado', 400);
    }

    // 3. Validar expiración
    if (!user.resetTokenExpiration || new Date() > user.resetTokenExpiration) {
      throw new HttpException('El token ha expirado. Solicita uno nuevo.', 400);
    }

    // 4. Hash de nueva contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Actualizar contraseña y limpiar token
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;

    await this.userRepository.save(user);

    return {
      message: '¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión.',
    };
  }
}
