import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    // Agregamos el flag como opcional
    @IsOptional()
    @IsString()
    removeImage?: string;
}
