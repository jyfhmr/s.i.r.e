import { ICreateAccessRequestDto } from '@shared/core/auth/access-requests/interfaces';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateAccessRequestDto implements ICreateAccessRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly fullName: string;

  @IsString()
  @IsNotEmpty()
  readonly dni: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly position: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly medicalCenterId?: number;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.medicalCenterId)
  @IsNotEmpty({
    message: 'Debes proporcionar un centro médico del catálogo o escribir uno manualmente',
  })
  readonly manualMedicalCenter?: string;
}
