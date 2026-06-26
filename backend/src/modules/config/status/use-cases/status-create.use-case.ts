import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../entities/status.entity';
import { CreateStatusDto } from '../dto/create-status.dto';

@Injectable()
export class StatusCreateUseCase {
  constructor(@InjectRepository(Status) private repository: Repository<Status>) {}

  async execute(dto: CreateStatusDto): Promise<string> {
    const newStatus = this.repository.create({
      ...dto,
      status: dto.status.toUpperCase(),
    });

    await this.repository.save(newStatus);
    return '¡Status creado con éxito!';
  }
}
