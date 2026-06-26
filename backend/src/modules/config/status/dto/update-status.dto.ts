import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusDto } from './create-status.dto';
import { IUpdateStatus } from '@shared/core/config/status/interfaces';

export class UpdateStatusDto extends PartialType(CreateStatusDto) implements IUpdateStatus {}
