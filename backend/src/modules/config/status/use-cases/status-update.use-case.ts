import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../entities/status.entity';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { UserFindOneService } from '../../users/services/user-find-one.service';

@Injectable()
export class StatusUpdateUseCase {
  constructor(@InjectRepository(Status) private repository: Repository<Status>) {}

  async execute(id: number, dto: UpdateStatusDto, userId: number): Promise<Status> {
    const statusToUpdate = await this.repository.preload({
      id,
      ...dto,
    });

    if (!statusToUpdate) throw new NotFoundException(`Status #${id} not found`);

    return await this.repository.save(statusToUpdate);
  }
}
