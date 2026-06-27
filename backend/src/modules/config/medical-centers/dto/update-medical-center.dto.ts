import { IUpdateMedicalCenterDto } from '@shared/core/config/medical-centers/interfaces';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicalCenterDto implements IUpdateMedicalCenterDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly state?: string;

  @IsString()
  @IsOptional()
  readonly municipality?: string;

  @IsString()
  @IsOptional()
  readonly address?: string;
}
