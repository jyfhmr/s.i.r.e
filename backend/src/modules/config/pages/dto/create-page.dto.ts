import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ICreatePageDto } from '@shared/core/config/pages/interfaces';

export class CreatePageDto implements ICreatePageDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @ValidateIf((object, value) => value)
  readonly route?: string;

  @IsString()
  @ValidateIf((object, value) => value)
  readonly icon?: string;

  @IsNumber()
  @IsOptional()
  readonly pageFather?: number; // 👈 Ahora recibe un número explícitamente

  @IsNumber()
  @IsOptional()
  readonly order?: number;
}
