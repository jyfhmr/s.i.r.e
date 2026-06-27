import { IApproveAccessRequestDto } from '@shared/core/auth/access-requests/interfaces';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ApproveAccessRequestDto implements IApproveAccessRequestDto {
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty()
  readonly password: string;
}
