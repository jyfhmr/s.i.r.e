import { ICreateContactDto } from '@shared/core/public/contact/interfaces';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateContactDto implements ICreateContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  readonly message: string;
}
