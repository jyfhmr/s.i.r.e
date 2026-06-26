// services/user-find-one.service.ts
import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { User } from '../entities/user.entity';
import { ROLES } from '@shared/common';

@Injectable()
export class UserFindOneService {
  constructor(
    private helpersService: HelpersService,

    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async execute(id: number, userId: number): Promise<User> {
    try {
      const user = await this.repository.findOne({
        where: { id },
        relations: {
          profile: true,
        },
      });

      if (!user) {
        throw new HttpException(`No se encontró el Usuario con el ID ${id}`, 404);
      }

      // Si no eres DIOS (1) y el ID que quieres ver no es el tuyo (sub), bloqueamos.
      if (userId !== ROLES.DIOS && userId !== id) {
        throw new ForbiddenException(
          'No tienes permisos para ver la información de otros usuarios.',
        );
      }

      return user;
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Consultar Usuario');
    }
  }
}
