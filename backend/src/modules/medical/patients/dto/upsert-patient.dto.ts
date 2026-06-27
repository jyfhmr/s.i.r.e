import { IUpsertPatientDto } from '@shared/core/medical/patients/interfaces';
import { PatientStatus } from '@shared/common';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpsertPatientDto implements IUpsertPatientDto {
  @IsString()
  @IsNotEmpty()
  readonly dni: string;

  @IsString()
  @IsNotEmpty()
  readonly fullName: string;

  @IsEnum(PatientStatus)
  @IsNotEmpty()
  readonly status: PatientStatus;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly medicalCenterId?: number;

  @IsString()
  @IsOptional()
  // Validar que al menos uno de los dos esté presente (medicalCenterId o manualLocation)
  @ValidateIf((o) => !o.medicalCenterId)
  @IsNotEmpty({
    message: 'Debes proporcionar un centro médico del catálogo o una ubicación manual',
  })
  readonly manualLocation?: string;
}
