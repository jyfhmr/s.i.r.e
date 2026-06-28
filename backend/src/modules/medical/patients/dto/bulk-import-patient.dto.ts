import { PatientStatus } from '@shared/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/**
 * Item individual del array de importación masiva
 * NOTA: No extiende UpsertPatientDto a propósito, porque en bulk
 * no es obligatorio tener medicalCenterId o manualLocation (el @ValidateIf
 * de UpsertPatientDto es demasiado restrictivo para este caso de uso).
 */
export class BulkImportPatientItemDto {
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
  readonly manualLocation?: string;
}

/**
 * DTO para la importación masiva de pacientes (solo DIOS)
 * Recibe un array de pacientes en el body.
 */
export class BulkImportPatientDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkImportPatientItemDto)
  readonly patients: BulkImportPatientItemDto[];
}
