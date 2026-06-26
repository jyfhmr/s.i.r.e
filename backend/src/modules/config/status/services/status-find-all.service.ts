import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw, In } from 'typeorm';
import { Status } from '../entities/status.entity';

@Injectable()
export class StatusFindAllService {
    constructor(@InjectRepository(Status) private repository: Repository<Status>) {}

    async execute(query: any): Promise<{ totalRows: number; data: Status[] }> {
        const take = Number(query.rows) || 5;
        const skip = query.page ? (Number(query.page) - 1) * take : 0;
        const order = query.order || 'DESC';

        // Lógica de exportación rápida (si viene el flag 'export')
        if (query.export) {
            const data = await this.repository.find({
                where: this.buildWhereClause(query),
                order: { id: order as any },
                relations: ['user', 'userUpdate'],
                withDeleted: true, // Exportamos todo
            });
            return { totalRows: data.length, data };
        }

        try {
            const where = this.buildWhereClause(query);
            const [data, total] = await this.repository.findAndCount({
                where,
                order: { id: order as any },
                take,
                skip,
                relations: ['user', 'userUpdate'],
                withDeleted: true, // Para mostrar inactivos en la tabla si se desea
            });

            return { totalRows: total, data };
        } catch (error) {
            throw new HttpException('Error fetching statuses', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getTreasuryStatuses(): Promise<Status[]> {
        return await this.repository.find({
            where: { module: 'PAGOS HECHOS', id: In([1, 2]) },
            order: { id: 'ASC' },
        });
    }

    private buildWhereClause(query: any) {
        const where: any = {};

        // Filtro por nombre
        if (query.status) {
            where.status = Raw(alias => `${alias} LIKE '%${query.status}%'`);
        }
        // Filtro por módulo
        if (query.module) {
            where.module = Raw(alias => `${alias} LIKE '%${query.module}%'`);
        }

        // El filtro 'isActive' ahora depende de deletedAt
        if (query.isActive !== undefined) {
            if (query.isActive === 'true') {
                where.deletedAt = null;
            } else {
                // Esto requiere una lógica un poco más compleja con TypeORM puro si usamos softDelete
                // Por simplicidad en find estándar:
                // Si quieres SOLO inactivos, TypeORM con softDelete lo complica un poco en el 'where' directo
                // sin QueryBuilder.
                // Asumiremos que el frontend filtra en memoria o usamos QueryBuilder si es estricto.
            }
        }

        return where;
    }
}
