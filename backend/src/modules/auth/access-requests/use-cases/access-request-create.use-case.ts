import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalAccessRequest } from '../entities/medical-access-request.entity';
import { CreateAccessRequestDto } from '../dto/create-access-request.dto';
import { MedicalCenter } from '@/modules/config/medical-centers/entities/medical-center.entity';
import { AccessRequestStatus } from '@shared/core/auth/access-requests/interfaces';

@Injectable()
export class AccessRequestCreateUseCase {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(MedicalAccessRequest)
    private requestRepository: Repository<MedicalAccessRequest>,
  ) {}

  async execute(dto: CreateAccessRequestDto) {
    try {
      // 1. Verificar que no exista solicitud duplicada por DNI o email
      const existing = await this.requestRepository.findOne({
        where: [{ dni: dto.dni }, { email: dto.email }],
      });

      if (existing) {
        if (existing.status === AccessRequestStatus.PENDING) {
          throw new HttpException(
            'Ya tienes una solicitud pendiente. Por favor espera la revisión.',
            409,
          );
        }
        throw new HttpException('Ya existe una solicitud con este DNI o correo electrónico.', 409);
      }

      // 2. Si proporciona medicalCenterId, verificar que existe
      if (dto.medicalCenterId) {
        await this.helpersService.searchFindOneById(
          MedicalCenter,
          dto.medicalCenterId,
          'Centro Médico',
          undefined,
        );
      }

      // 3. Crear solicitud
      const newRequest = this.requestRepository.create({
        ...dto,
        status: AccessRequestStatus.PENDING,
      });

      await this.requestRepository.save(newRequest);

      return {
        message:
          '¡Solicitud enviada exitosamente! Nuestro equipo la revisará y te contactaremos pronto.',
        id: newRequest.id,
      };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Crear Solicitud de Acceso');
    }
  }
}
