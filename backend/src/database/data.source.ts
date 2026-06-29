// src/database/data.source.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

//crear migración npm run migration:generate -- src/database/migrations/CreateFinancesTables
//crear seeder manual

config();

export const dbdatasource: any = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['src/database/migrations/**/*{.ts,.js}'],
  connectTimeout: 600000,
  extra: {
    connectionLimit: 50,
  },
  timezone: 'Z',
};

const dataSource = new DataSource(dbdatasource);
export default dataSource;
