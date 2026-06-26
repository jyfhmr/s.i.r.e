// src/modules/config/pages/dto/update-page.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePageDto } from './create-page.dto';
import { IUpdatePageDto } from '@shared/core/config/pages/interfaces';

export class UpdatePageDto extends PartialType(CreatePageDto) implements IUpdatePageDto {}
