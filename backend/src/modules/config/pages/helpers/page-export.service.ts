// src/modules/config/pages/services/page-export.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { HelpersService } from '@/helpers/helpers.service';
import { Page } from '../entities/page.entity';

@Injectable()
export class PageExportService {
    constructor(private helpersService: HelpersService) {}

    async execute(data: Page[], res: Response): Promise<void> {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            worksheet.addRow(['Reporte de Datos']);
            worksheet.columns = [
                { header: 'Paginas', key: 'name', width: 20 },
                { header: 'Icono', key: 'icon', width: 20 },
                { header: 'Ruta', key: 'route', width: 20 },
            ];

            // Aplicar estilos a la cabecera
            worksheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '2a953d' },
            };
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getRow(1).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };

            // Agregar datos y aplicar estilos
            data.forEach(item => {
                const row = worksheet.addRow(item);

                row.alignment = { vertical: 'middle', horizontal: 'left' };
                row.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });

            // Configurar el encabezado de la respuesta HTTP
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=pages_data.xlsx`);

            // Escribir el libro de trabajo en la respuesta HTTP
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            throw this.helpersService.genericErrorHandler(error, 'Exportar Páginas a Excel');
        }
    }
}
