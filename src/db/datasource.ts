import dbConfig from '../config/db.config';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default new DataSource(dbConfig as PostgresConnectionOptions);
