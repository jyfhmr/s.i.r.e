import { Injectable, Inject, ForbiddenException, ConflictException } from '@nestjs/common';
import { Not, QueryRunner } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HelpersService } from '@/helpers/helpers.service';
import { User } from '../entities/user.entity';
import { Profile } from '@/modules/config/profiles/entities/profile.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ROLES } from '@shared/common';

@Injectable()
export class UserUpdateUseCase {
  constructor(
    private helpersService: HelpersService,
    private configService: ConfigService,
  ) {}

  // 2. Añadimos currentUser como parámetro
  async execute(
    id: number,
    dto: UpdateUserDto,
    currentUser: any,
    file?: Express.Multer.File,
    externalQR?: QueryRunner,
  ) {
    console.log('EL usuario actual', currentUser);

    // 🔥 REGLA DE NEGOCIO 1: Solo DIOS puede editar a otros usuarios
    if (currentUser.profileId !== ROLES.DIOS && currentUser.sub !== id) {
      throw new ForbiddenException(
        'No tienes permisos para actualizar la información de otro usuario.',
      );
    }

    console.log('el usuario', currentUser);

    // 🔥 REGLA DE NEGOCIO 2: Un usuario normal no puede cambiarse el rol a sí mismo
    if (
      currentUser.profileId !== ROLES.DIOS &&
      dto.profile &&
      Number(dto.profile) !== currentUser.profileId
    ) {
      throw new ForbiddenException('No tienes permisos para modificar tu propio perfil/rol.');
    }

    return await this.helpersService.runInTransaction(async (queryRunner) => {
      // 1. Buscar usuario existente
      const user = await this.helpersService.searchFindOneById(User, id, 'Usuario', queryRunner);

      // 2. Actualizar campos básicos
      user.name = dto.name ?? user.name;
      user.fullName = dto.fullName ?? user.fullName;
      user.email = dto.email ?? user.email;
      user.dni = dto.dni ?? user.dni;

      // Búsqueda (existe otro usuario con el correo, teléfono o DNI que estás intentando poner?)
      // 🔥 Búsqueda: ¿Existe otro usuario con el correo, teléfono o DNI que estás intentando poner?
      const orConditions = [];

      if (dto.email) {
        orConditions.push({ email: dto.email, id: Not(id) });
      }
      if (dto.dni) {
        orConditions.push({ dni: dto.dni, id: Not(id) });
      }

      // Solo disparamos la consulta si el DTO trae al menos uno de estos campos
      if (orConditions.length > 0) {
        const conflictingUsers = await queryRunner.manager.find(User, {
          where: orConditions,
          select: ['email', 'dni'], // Optimizamos trayendo solo los campos a evaluar
        });

        if (conflictingUsers.length > 0) {
          // Si encontramos conflictos, iteramos para ver exactamente cuál campo falló
          // y le damos al frontend un mensaje ultra específico.
          for (const conflict of conflictingUsers) {
            if (dto.email && conflict.email === dto.email) {
              throw new ConflictException(
                `El correo ${dto.email} ya está registrado por otro usuario.`,
              );
            }
            if (dto.dni && conflict.dni === dto.dni) {
              throw new ConflictException(`El DNI ${dto.dni} ya está registrado en el sistema.`);
            }
          }
        }
      }

      // 3. Actualizar perfil si se proporciona
      if (dto.profile) {
        const newProfile = await this.helpersService.searchFindOneById(
          Profile,
          dto.profile,
          'Perfil',
          queryRunner,
        );
        user.profile = newProfile;
      }

      // 4. Guardar cambios
      await queryRunner.manager.save(user);

      return {
        message: '¡Usuario actualizado con éxito!',
        id: user.id,
      };
    }, externalQR);
  }
}
