// src/modules/config/profiles/dto/create-profile.dto.ts
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ICreateProfileDto } from '@shared/core/config/profiles/interfaces';

export class CreateProfileDto implements ICreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNumber({}, { each: true }) // Validamos que el array contenga solo números (IDs)
  @ArrayMinSize(1)
  pageIds: number[];
}
