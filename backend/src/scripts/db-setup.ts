// src/scripts/db-setup.ts
import { DataSource } from 'typeorm';
import { createDatabase, dropDatabase, runSeeders } from 'typeorm-extension';
import { dbdatasource } from '../database/data.source';
import UserSeeder from '@/database/seeds/1716776942560-users.seeder';
import { StatusSeeder1726770256000 } from '@/database/seeds/1726770256000-status-seeder';
import { PagesSeeder } from '@/database/seeds/1716777747675-pages.seeder';

async function setupDatabase() {
  console.log('🚀 Iniciando la configuración de la base de datos...\n');

  try {
    // 1. Borrar la base de datos si existe
    console.log('🗑️  Eliminando la base de datos (si existe)...');
    await dropDatabase({
      options: dbdatasource,
      initialDatabase: 'mysql',
    });

    // 2. Crear la base de datos vacía
    console.log('✨ Creando la base de datos vacía...');
    await createDatabase({
      options: dbdatasource,
      initialDatabase: 'mysql',
    });

    // 3. Inicializar el DataSource
    console.log('🔌 Conectando a la nueva base de datos...');
    const dataSource = new DataSource(dbdatasource);
    await dataSource.initialize();

    // 4. Sincronizar el esquema (Tablas)
    console.log('🏗️  Sincronizando el esquema (Tablas)...');
    await dataSource.synchronize();

    // 5. Correr los seeders
    console.log('🌱 Ejecutando Seeders y Factories...');

    await runSeeders(dataSource, {
      seeds: [UserSeeder, PagesSeeder, StatusSeeder1726770256000],
      factories: [],
    });

    // 6. Cerrar conexión
    await dataSource.destroy();
    console.log('\n✅ ¡Base de datos creada y poblada con éxito!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante la configuración de la base de datos:', error);
    process.exit(1);
  }
}

setupDatabase();
