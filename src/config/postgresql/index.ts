import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'your_username',
      password: process.env.DB_PASSWORD || 'your_password',
      database: process.env.DB_DATABASE || 'your_database',
      entities: [], // Asegúrate de incluir todas tus entidades
      synchronize: false,
      migrationsRun: false,
      logging: false,
    }),
  ],
  providers: [],
  exports: [],
})
export class PostgreSQLModule {}
