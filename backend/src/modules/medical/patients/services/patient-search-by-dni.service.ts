import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpersService } from '@/helpers/helpers.service';
import { Patient } from '../entities/patient.entity';

@Injectable()
export class PatientSearchByDniService {
  constructor(
    private helpersService: HelpersService,
    @InjectRepository(Patient)
    private repository: Repository<Patient>,
  ) {}

  async execute(dni: string): Promise<Patient | null> {
    try {
      // Buscador global por cédula - accesible a médicos y DIOS (solo lectura)
      return await this.repository.findOne({
        where: { dni },
        relations: {
          currentMedicalCenter: true,
        },
      });
    } catch (error) {
      throw this.helpersService.genericErrorHandler(error, 'Búsqueda de Paciente por DNI');
    }
  }
}
