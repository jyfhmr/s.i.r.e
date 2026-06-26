import { ICreateUserDto } from '@shared/core/config/user/interfaces';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto implements ICreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly fullName: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    readonly dni: string;

    @IsString()
    @IsNotEmpty()
    readonly phoneNumber: string;

    @IsInt()
    @IsNotEmpty()
    @Type(() => Number) // <-- Magia: Convierte el string "1" al número 1 antes de validar
    readonly profile: number;
}
