import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { stringify } from 'csv-stringify';
import { Patient } from '../entities/patient.entity';

@Injectable()
export class PatientExportService {
  async execute(data: Patient[], res: Response): Promise<void> {
    const csvData = data.map((patient) => ({
      DNI: patient.dni,
      'Nombre Completo': patient.fullName,
      Estatus: patient.currentStatus,
      Ubicación: patient.currentMedicalCenter?.name || patient.manualLocation || 'N/A',
      'Última Actualización': patient.lastUpdatedAt?.toISOString() || '',
      'Fecha de Registro': patient.createdAt?.toISOString().split('T')[0] || '',
    }));

    stringify(csvData, { header: true }, (err, output) => {
      if (err) throw err;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=pacientes.csv');
      res.send('\uFEFF' + output); // BOM para UTF-8
    });
  }
}
