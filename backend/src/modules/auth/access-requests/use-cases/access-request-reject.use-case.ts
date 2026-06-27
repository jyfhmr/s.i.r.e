import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalAccessRequest } from '../entities/medical-access-request.entity';
import { AccessRequestStatus } from '@shared/core/auth/access-requests/interfaces';

@Injectable()
export class AccessRequestRejectUseCase {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(MedicalAccessRequest)
    private requestRepository: Repository<MedicalAccessRequest>,
  ) {}

  async execute(id: number, currentUserId: number) {
    try {
      // 1. Buscar la solicitud
      const request = await this.helpersService.searchFindOneById(
        MedicalAccessRequest,
        id,
        'Solicitud de Acceso',
      );

      // 2. Verificar que esté pendiente
      if (request.status !== AccessRequestStatus.PENDING) {
        throw new HttpException('Esta solicitud ya fue procesada', 400);
      }

      // 3. Actualizar solicitud
      request.status = AccessRequestStatus.REJECTED;
      request.reviewedBy = currentUserId;
      request.reviewedAt = new Date();

      await this.requestRepository.save(request);

      return {
        message: 'Solicitud rechazada exitosamente.',
      };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Rechazar Solicitud de Acceso');
    }
  }
}
