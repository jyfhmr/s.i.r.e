import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/config/users/entities/user.entity';

@Injectable()
export class PasswordChangeUseCase {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async execute(userId: number, currentPassword: string, newPassword: string) {
    if (!currentPassword || !newPassword) {
      throw new HttpException('Debes indicar la contraseña actual y la nueva', 400);
    }

    if (newPassword.length < 6) {
      throw new HttpException('La nueva contraseña debe tener al menos 6 caracteres', 400);
    }

    // 1. Buscar usuario autenticado
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('Usuario no encontrado', 404);
    }

    // 2. Validar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new HttpException('La contraseña actual es incorrecta', 400);
    }

    // 3. Evitar reutilizar la misma contraseña
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      throw new HttpException('La nueva contraseña no puede ser igual a la actual', 400);
    }

    // 4. Hash y guardar
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    await this.userRepository.save(user);

    return { message: '¡Contraseña actualizada exitosamente!' };
  }
}
