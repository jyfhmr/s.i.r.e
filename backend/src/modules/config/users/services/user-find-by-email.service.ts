import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserFindByEmailService {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>
    ) {}

    async execute(email: string): Promise<User | null> {
        return await this.repository.findOne({
            relations: {
                profile: true,
            },
            where: {
                email,
            },
        });
    }
}
