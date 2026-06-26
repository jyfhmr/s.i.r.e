import { Status } from '@/modules/config/status/entities/status.entity';
import { SYSTEM_STATUSES } from '@shared/common/statuses';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
// Importa el diccionario desde tu ruta shared

export class StatusSeeder1726770256000 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Status);

    // Mapeamos el diccionario fuertemente tipeado a un formato que el Repositorio espera
    const kind_of_statuses = Object.values(SYSTEM_STATUSES).map((statusDef) => ({
      id: statusDef.id, // Forzamos la creación con este ID exacto
      status: statusDef.status,
      module: statusDef.module,
      color: statusDef.color,
      user: { id: 1 }, // Requerimiento de tu entidad
    }));

    // Guardamos los estatus (TypeORM actualizará o insertará respetando el ID si usas save)
    await repository.save(kind_of_statuses);
  }
}
