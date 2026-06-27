import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalAccessRequest } from '../entities/medical-access-request.entity';
import { IAccessRequestFilter } from '@shared/core/auth/access-requests/interfaces';

@Injectable()
export class AccessRequestFindAllService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(MedicalAccessRequest)
    private repository: Repository<MedicalAccessRequest>,
  ) {}

  async execute(
    query: IAccessRequestFilter,
  ): Promise<{ data: MedicalAccessRequest[]; total: number }> {
    const take = Number(query.rows) || 10;
    const skip = query.page ? (Number(query.page) - 1) * take : 0;

    try {
      const where: FindOptionsWhere<MedicalAccessRequest> = {};

      if (query.status) {
        where.status = query.status;
      }

      if (query.fullName) {
        where.fullName = ILike(`%${query.fullName}%`);
      }

      if (query.dni) {
        where.dni = ILike(`%${query.dni}%`);
      }

      if (query.email) {
        where.email = ILike(`%${query.email}%`);
      }

      if (query.createdAt) {
        const [startDate, endDate] = query.createdAt.split(',');
        where.createdAt = Between(new Date(startDate), new Date(endDate)) as any;
      }

      const [data, total] = await this.repository.findAndCount({
        where,
        relations: {
          medicalCenter: true,
          reviewer: true,
        },
        order: { createdAt: 'DESC' },
        take: query.export ? undefined : take,
        skip: query.export ? undefined : skip,
      });

      return { data, total };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Listado de Solicitudes de Acceso');
    }
  }
}
