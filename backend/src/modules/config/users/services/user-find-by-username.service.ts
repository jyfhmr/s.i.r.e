// services/user-find-by-username.service.ts
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserFindByUsernameService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async execute(username: string): Promise<User> {
    if (!username) throw new HttpException('El nombre de usuario recibido no es válido', 400);

    return await this.repository.findOne({
      relations: {
        profile: {
          profilePages: {
            page: true,
          },
        },
      },
      where: {
        email: username,
        isActive: true,
      },
    });
  }
}
