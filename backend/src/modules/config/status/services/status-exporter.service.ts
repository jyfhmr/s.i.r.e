import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { Status } from '../entities/status.entity';

@Injectable()
export class StatusExporterService {
    async execute(data: Status[], res: Response): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');

        // --- 1. Configuración de Cabeceras ---
        worksheet.addRow(['Reporte de Datos']); // Título en la primera fila

        // Definición de columnas (Claves deben coincidir con las propiedades de la entidad)
        worksheet.columns = [
            { header: 'Estatus', key: 'status', width: 25 },
            { header: 'Módulo', key: 'module', width: 25 },
            // Puedes agregar más columnas si quieres exportar el color o la fecha
            { header: 'Color', key: 'color', width: 15 },
        ];

        // --- 2. Estilos del Encabezado (Fila 1) ---
        const headerRow = worksheet.getRow(1);

        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2a953d' }, // Verde corporativo
        };

        headerRow.font = {
            bold: true,
            color: { argb: 'FFFFFF' }, // Texto blanco para contraste
            size: 12,
        };

        headerRow.alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };

        headerRow.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };

        // --- 3. Inserción de Datos y Estilos de Filas ---
        data.forEach(item => {
            // ExcelJS mapea automáticamente las propiedades del objeto a las columnas por 'key'
            const row = worksheet.addRow({
                status: item.status,
                module: item.module,
                color: item.color,
            });

            // Estilo para cada celda de la fila de datos
            row.alignment = { vertical: 'middle', horizontal: 'left' };
            row.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // --- 4. Preparación de la Respuesta HTTP ---
        // Headers para forzar la descarga del archivo
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=reporte_estatus_${new Date().getTime()}.xlsx`);

        // Escribir el buffer directamente en la respuesta (Stream)
        await workbook.xlsx.write(res);

        // Finalizar la respuesta
        res.end();
    }
}
