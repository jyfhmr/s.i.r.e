import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { User } from '../entities/user.entity';
import { IUserFilter } from '@shared/core/config/user/interfaces';

@Injectable()
export class UserFindAllService {
  constructor(
    private helpersService: HelpersService,

    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async execute(query: IUserFilter): Promise<{ data: User[]; total: number }> {
    const take = Number(query.rows) || 10;
    const skip = query.page ? (Number(query.page) - 1) * take : 0;

    console.log('el query', query);

    try {
      const where: FindOptionsWhere<User> = {};

      // Filtros dinámicos
      if (query.name) {
        where.name = ILike(`%${query.name}%`);
      }

      if (query.email) {
        where.email = ILike(`%${query.email}%`);
      }

      if (query.isActive !== undefined) {
        where.isActive = query.isActive === 'true' || query.isActive === true;
      }

      if (query.profile) {
        where.profile = {
          name: ILike(`%${query.profile}%`),
        } as any;
      }

      if (query.createdAt) {
        const [startDate, endDate] = query.createdAt.split(',');
        where.createdAt = Between(new Date(startDate), new Date(endDate)) as any;
      }

      if (query.updatedAt) {
        const [startDate, endDate] = query.updatedAt.split(',');
        where.updatedAt = Between(new Date(startDate), new Date(endDate)) as any;
      }

      const [data, total] = await this.repository.findAndCount({
        where,
        relations: {
          profile: true,
        },
        order: { id: 'DESC' },
        take: query.export ? undefined : take,
        skip: query.export ? undefined : skip,
      });

      console.log('La data y el total de users', total);

      return { data, total };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Listado de Usuarios');
    }
  }
}
