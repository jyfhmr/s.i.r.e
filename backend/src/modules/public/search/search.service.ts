import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '@/modules/medical/patients/entities/patient.entity';
import { IPatientPublicResponse } from '@shared/core/medical/patients/interfaces';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async searchByDni(dni: string): Promise<IPatientPublicResponse> {
    const patient = await this.patientRepository.findOne({
      where: { dni },
      relations: {
        currentMedicalCenter: true,
        // NUNCA traer lastUpdatedByUser - protección del personal
      },
    });

    if (!patient) {
      return {
        found: false,
        message:
          'No hemos encontrado información sobre esta persona en nuestros registros hasta el momento. Si deseas recibir una notificación inmediata cuando aparezca, puedes configurar una alerta.',
      };
    }

    return {
      found: true,
      message: 'Hemos encontrado información sobre esta persona.',
      data: {
        fullName: patient.fullName,
        status: patient.currentStatus,
        location:
          patient.currentMedicalCenter?.name ||
          patient.manualLocation ||
          'Ubicación no especificada',
        lastUpdated: patient.lastUpdatedAt || patient.createdAt,
        registrationSource: patient.registrationSource || undefined,
      },
    };
  }
}
