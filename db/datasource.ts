import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import dbConfig from '../src/configurations/db.config';

export default new DataSource(dbConfig as PostgresConnectionOptions);
