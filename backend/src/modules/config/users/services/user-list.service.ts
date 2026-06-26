import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserListService {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>
    ) {}

    async execute(): Promise<User[]> {
        return await this.repository.find({
            where: { isActive: true },
        });
    }
}
