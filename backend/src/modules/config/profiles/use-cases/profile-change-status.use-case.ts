// src/modules/config/profiles/use-cases/profile-change-status.use-case.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { HelpersService } from '@/helpers/helpers.service';

@Injectable()
export class ProfileChangeStatusUseCase {
    constructor(
        private helpersService: HelpersService,

        @InjectRepository(Profile)
        private repository: Repository<Profile>
    ) {}

    async execute(id: number): Promise<{ message: string }> {
        try {
            const updateProfile = await this.repository.findOneBy({ id });

            if (!updateProfile) {
                throw new Error(`Perfil con ID ${id} no encontrado`);
            }

            updateProfile.isActive = !updateProfile.isActive;

            await this.repository.save(updateProfile);

            return { message: '¡Cambio de estatus realizado con éxito!' };
        } catch (error) {
            throw this.helpersService.genericErrorHandler(error, 'Cambio de estatus de Perfil');
        }
    }
}
