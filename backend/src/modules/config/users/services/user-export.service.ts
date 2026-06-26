// services/user-export.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { User } from '../entities/user.entity';

@Injectable()
export class UserExportService {
  async execute(data: User[], res: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuarios');

    // Configurar columnas
    worksheet.columns = [
      { header: 'Usuario', key: 'name', width: 20 },
      { header: 'Correo electrónico', key: 'email', width: 30 },
      { header: 'DNI', key: 'dni', width: 15 },
      { header: 'Teléfono', key: 'phoneNumber', width: 15 },
      { header: 'Perfil', key: 'profile', width: 20 },
    ];

    // Estilo del encabezado
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2a953d' },
    };
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Agregar datos
    data.forEach((user) => {
      worksheet.addRow({
        name: user.name,
        email: user.email,
        dni: user.dni,
        profile: user.profile?.name || 'N/A',
      });
    });

    // Configurar respuesta HTTP
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=usuarios_${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  }
}
