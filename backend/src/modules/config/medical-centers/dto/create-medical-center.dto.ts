import { ICreateMedicalCenterDto } from '@shared/core/config/medical-centers/interfaces';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMedicalCenterDto implements ICreateMedicalCenterDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly state: string;

  @IsString()
  @IsOptional()
  readonly municipality?: string;

  @IsString()
  @IsOptional()
  readonly address?: string;
}
