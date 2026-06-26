// use-cases/user-update-password.use-case.ts
import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HelpersService } from '@/helpers/helpers.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserUpdatePasswordUseCase {
    constructor(private helpersService: HelpersService) {}

    async execute(userId: number, newPassword: string, externalQR?: QueryRunner) {
        return await this.helpersService.runInTransaction(async queryRunner => {
            const user = await this.helpersService.searchFindOneById(User, userId, 'Usuario', queryRunner);

            // Hash de nueva contraseña
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Actualizar contraseña y limpiar token
            user.password = hashedPassword;
            user.resetToken = '';
            user.resetTokenExpiration = new Date();

            await queryRunner.manager.save(user);

            return {
                message: 'Contraseña actualizada con éxito!',
            };
        }, externalQR);
    }
}
