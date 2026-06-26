import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '../entities/status.entity';

@Injectable()
export class StatusChangeStatusUseCase {
    constructor(@InjectRepository(Status) private repository: Repository<Status>) {}

    async execute(id: number): Promise<string> {
        // Buscamos incluyendo eliminados para poder restaurar
        const status = await this.repository.findOne({
            where: { id },
            withDeleted: true,
        });

        if (!status) throw new NotFoundException(`Status #${id} not found`);

        if (status.deletedAt) {
            // Si está eliminado -> Restaurar (Activar)
            await this.repository.restore(id);
            return '¡Estatus activado con éxito!';
        } else {
            // Si está activo -> Soft Delete (Desactivar)
            await this.repository.softDelete(id);
            return '¡Estatus desactivado con éxito!';
        }
    }
}
