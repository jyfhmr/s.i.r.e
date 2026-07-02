import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/config/users/entities/user.entity';
import { Profile } from '@/modules/config/profiles/entities/profile.entity';
import { RegisterCitizenDto } from '../dto/register-citizen.dto';
import { ROLES } from '@shared/common';
import { HelpersService } from '@/helpers/helpers.service';

@Injectable()
export class RegisterCitizenUseCase {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private helpersService: HelpersService,
  ) {}

  async execute(dto: RegisterCitizenDto) {
    try {
      // 1. Verificar que el email no esté en uso
      const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new HttpException('Este correo electrónico ya está registrado', 409);
      }

      // 2. Obtener el perfil de USUARIO_COMUN
      const citizenProfile = await this.profileRepository.findOne({
        where: { id: ROLES.USUARIO_COMUN },
      });

      if (!citizenProfile) {
        throw new HttpException('Error de configuración del sistema', 500);
      }

      // 3. Hash de contraseña
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      // 4. Crear usuario ciudadano
      const newUser = this.userRepository.create({
        name: dto.fullName,
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
        profile: citizenProfile,
        dni: null, // Los ciudadanos no requieren DNI
        isActive: true,
      });

      await this.userRepository.save(newUser);

      return {
        message: '¡Cuenta creada exitosamente! Ya puedes iniciar sesión.',
        userId: newUser.id,
      };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Registro de Ciudadano');
    }
  }
}
