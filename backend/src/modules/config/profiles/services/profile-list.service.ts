// src/modules/config/profiles/services/profile-list.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';

@Injectable()
export class ProfileListService {
    constructor(
        @InjectRepository(Profile)
        private repository: Repository<Profile>
    ) {}

    async execute(): Promise<Profile[]> {
        return this.repository.find({ where: { isActive: true } });
    }
}
