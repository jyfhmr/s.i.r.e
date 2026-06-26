import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class RequestResetDto {
    @IsEmail({}, { message: 'El correo debe ser válido' })
    email: string;
}

export class ResetPasswordDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
}
