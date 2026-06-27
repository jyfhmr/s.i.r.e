import { ICreateAlertDto } from '@shared/core/citizen/alerts/interfaces';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlertDto implements ICreateAlertDto {
  @IsString()
  @IsNotEmpty()
  readonly watchedDni: string;

  @IsString()
  @IsOptional()
  readonly alias?: string;
}
