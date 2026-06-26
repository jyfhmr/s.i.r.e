import { IsString, IsNotEmpty } from 'class-validator';
import { ICreateStatus } from '@shared/core/config/status/interfaces';

export class CreateStatusDto implements ICreateStatus {
    @IsString()
    @IsNotEmpty()
    readonly status: string;

    @IsString()
    @IsNotEmpty()
    readonly module: string;

    @IsString()
    @IsNotEmpty()
    readonly color: string;
}
