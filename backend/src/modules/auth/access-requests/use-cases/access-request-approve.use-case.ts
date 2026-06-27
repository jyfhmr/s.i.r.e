import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HelpersService } from '@/helpers/helpers.service';
import { MedicalAccessRequest } from '../entities/medical-access-request.entity';
import { ApproveAccessRequestDto } from '../dto/approve-access-request.dto';
import { User } from '@/modules/config/users/entities/user.entity';
import { Profile } from '@/modules/config/profiles/entities/profile.entity';
import { ROLES } from '@shared/common';
import { AccessRequestStatus } from '@shared/core/auth/access-requests/interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AccessRequestApproveUseCase {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(MedicalAccessRequest)
    private requestRepository: Repository<MedicalAccessRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(id: number, dto: ApproveAccessRequestDto, currentUserId: number) {
    try {
      // 1. Buscar la solicitud
      const request = await this.helpersService.searchFindOneById(
        MedicalAccessRequest,
        id,
        'Solicitud de Acceso',
        undefined,
        ['medicalCenter'],
      );

      // 2. Verificar que esté pendiente
      if (request.status !== AccessRequestStatus.PENDING) {
        throw new HttpException('Esta solicitud ya fue procesada', 400);
      }

      // 3. Obtener perfil de médico
      const medicoProfile = await this.profileRepository.findOne({
        where: { id: ROLES.MEDICO },
      });

      if (!medicoProfile) {
        throw new HttpException('Error de configuración del sistema', 500);
      }

      // 4. Hash de contraseña
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      // 5. Crear usuario médico
      const newUser = this.userRepository.create({
        name: request.fullName,
        fullName: request.fullName,
        email: request.email,
        password: hashedPassword,
        profile: medicoProfile,
        dni: request.dni,
        isActive: true,
      });

      await this.userRepository.save(newUser);

      // 6. Actualizar solicitud
      request.status = AccessRequestStatus.APPROVED;
      request.reviewedBy = currentUserId;
      request.reviewedAt = new Date();

      await this.requestRepository.save(request);

      // 7. Enviar correo de bienvenida al nuevo médico
      this.eventEmitter.emit('email.send', {
        to: request.email,
        subject: '¡Bienvenido al equipo de S.I.R.E!',
        template: 'medical-access-approved',
        context: {
          fullName: request.fullName,
          email: request.email,
          position: request.position,
          medicalCenter:
            request.medicalCenter?.name || request.manualMedicalCenter || 'No especificado',
        },
      });

      return {
        message: `¡Solicitud aprobada! Se ha creado la cuenta para ${request.fullName} y se le ha enviado un correo de bienvenida.`,
        userId: newUser.id,
      };
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Aprobar Solicitud de Acceso');
    }
  }
}
