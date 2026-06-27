import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { stringify } from 'csv-stringify';
import { MedicalCenter } from '../entities/medical-center.entity';

@Injectable()
export class MedicalCenterExportService {
  async execute(data: MedicalCenter[], res: Response): Promise<void> {
    const csvData = data.map((center) => ({
      ID: center.id,
      Nombre: center.name,
      Estado: center.state,
      Municipio: center.municipality || 'N/A',
      Dirección: center.address || 'N/A',
      Activo: center.isActive ? 'Sí' : 'No',
      'Fecha Creación': center.createdAt?.toISOString().split('T')[0] || '',
      'Última Actualización': center.updatedAt?.toISOString().split('T')[0] || '',
    }));

    stringify(csvData, { header: true }, (err, output) => {
      if (err) throw err;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename=centros-medicos.csv');
      res.send('\uFEFF' + output); // BOM para UTF-8
    });
  }
}
