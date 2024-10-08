require('dotenv').config();

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_DB_HOST,
  port: parseInt(process.env.PG_DB_PORT),
  username: process.env.PG_DB_USER,
  password: process.env.PG_DB_PASS,
  database: process.env.PG_DB_NAME,
  entities: [__dirname + './**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('PostgreSQL Data Source initializated.');
  })
  .catch((err) => {
    console.error('Error during PostgreSQL Data Source initialization', err);
  });
