import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchListItem } from '../entities/watch-list-item.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface PatientUpdatedEvent {
  dni: string;
  fullName: string;
  status: string;
  location: string;
  updatedAt: Date;
}

@Injectable()
export class PatientAlertListener {
  private readonly logger = new Logger(PatientAlertListener.name);

  constructor(
    @InjectRepository(WatchListItem)
    private watchListRepository: Repository<WatchListItem>,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('patient.updated', { async: true })
  async handlePatientUpdated(payload: PatientUpdatedEvent) {
    this.logger.log(`Verificando alertas para DNI: ${payload.dni}`);

    try {
      // Buscar todos los usuarios que tienen esta cédula en su watchlist
      const alerts = await this.watchListRepository.find({
        where: { watchedDni: payload.dni },
        relations: {
          user: true,
        },
      });

      if (alerts.length === 0) {
        this.logger.log(`No hay alertas configuradas para DNI: ${payload.dni}`);
        return;
      }

      this.logger.log(`Encontradas ${alerts.length} alertas para DNI: ${payload.dni}`);

      // Enviar correo a cada usuario en la watchlist
      for (const alert of alerts) {
        this.eventEmitter.emit('email.send', {
          to: alert.user.email,
          subject: `Información sobre ${alert.alias || payload.fullName}`,
          template: 'patient-alert',
          context: {
            recipientName: alert.user.name,
            patientName: payload.fullName,
            alias: alert.alias,
            status: payload.status,
            location: payload.location,
            dni: payload.dni,
          },
        });
      }

      this.logger.log(`Correos encolados exitosamente para DNI: ${payload.dni}`);
    } catch (error) {
      this.logger.error(`Error procesando alertas para DNI: ${payload.dni}`, error);
    }
  }
}
