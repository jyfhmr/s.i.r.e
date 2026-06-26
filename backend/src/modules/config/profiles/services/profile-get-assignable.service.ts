import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { UserFindOneService } from '../../users/services/user-find-one.service';
import { ROLES } from '@shared/common';

@Injectable()
export class ProfileGetAssignableService {
  constructor(
    @InjectRepository(Profile)
    private repository: Repository<Profile>,

    private userFindOneService: UserFindOneService,
  ) {}

  async execute(userId: number): Promise<Profile[]> {
    const user = await this.userFindOneService.execute(userId, userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.profile.id !== ROLES.DIOS)
      throw new HttpException('Tu perfil no tiene permisos para ver los perfiles', 409);

    return this.repository.find({
      where: {
        isActive: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }
}
