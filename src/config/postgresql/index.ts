import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvObj, IPostgreSQL } from '@config/env-vars';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const postgresql = configService.get<IPostgreSQL>(EnvObj.POSTGRESQL);

        return {
          type: 'postgres',
          host: postgresql.HOST,
          port: postgresql.PORT,
          username: postgresql.USER,
          password: postgresql.PASS,
          database: postgresql.NAME,
          entities: [],
          synchronize: false,
          migrationsRun: false,
          logging: false,
        };
      },
    }),
  ],
  providers: [],
  exports: [],
})
export class PostgreSQLModule {}
