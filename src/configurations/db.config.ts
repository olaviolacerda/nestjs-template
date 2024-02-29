import { config } from 'dotenv';

config();

export default {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  migrationsTableName: 'migrations',
  migrations: ['db/migrations/*.ts'],
  entities: ['src/infrastructure/entities/*.entity.ts'],
  ssl: false,
  synchronize: false,
  dropSchema: false,
  logger: 'file',
  logging: Boolean(process.env.DB_LOGGING) || false,
};
