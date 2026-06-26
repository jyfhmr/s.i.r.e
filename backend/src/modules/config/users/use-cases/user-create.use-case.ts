import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HelpersService } from '@/helpers/helpers.service';
import { User } from '../entities/user.entity';
import { Profile } from '@/modules/config/profiles/entities/profile.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserCreateUseCase {
  constructor(private helpersService: HelpersService) {}

  async execute(dto: CreateUserDto, currentUserId: number, externalQR?: QueryRunner) {
    return await this.helpersService.runInTransaction(async (queryRunner) => {
      console.log('EL dto', dto);

      // 1. Buscar usuario actual
      await this.helpersService.searchFindOneById(
        User,
        currentUserId,
        'Usuario actual',
        queryRunner,
        ['profile'], // <--- AGREGAR ESTO
      );

      // 2. Buscar el perfil a asignar
      const profileToAssign = await this.helpersService.searchFindOneById(
        Profile,
        dto.profile,
        'Perfil',
        queryRunner,
      );

      // 4. Verificar unicidad de email y DNI
      const existingUserByEmail = await queryRunner.manager.findOne(User, {
        where: { email: dto.email },
      });

      const existingUserByDni = await queryRunner.manager.findOne(User, {
        where: { dni: dto.dni },
      });

      if (existingUserByEmail || existingUserByDni) {
        throw new HttpException('Ese correo o DNI ya se encuentra registrado', 400);
      }

      // 5. Hash de contraseña
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      // 7. Crear usuario
      const newUser = queryRunner.manager.create(User, {
        ...dto,
        password: hashedPassword,
        profile: profileToAssign,
        isActive: true,
      });

      await queryRunner.manager.save(newUser);

      return {
        message: '¡Usuario creado con éxito!',
        id: newUser.id,
      };
    }, externalQR);
  }
}
