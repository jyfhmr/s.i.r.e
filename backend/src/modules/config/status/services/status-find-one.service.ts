import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../entities/status.entity';

@Injectable()
export class StatusFindOneService {
    constructor(@InjectRepository(Status) private repository: Repository<Status>) {}

    async execute(id: number): Promise<Status> {
        const status = await this.repository.findOne({
            where: { id },
            relations: ['user', 'userUpdate'],
            withDeleted: true, // Permitimos buscar incluso si está "inactivo"
        });

        if (!status) throw new NotFoundException(`Status #${id} not found`);
        return status;
    }
}
