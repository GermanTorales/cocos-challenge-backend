import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate, envConfig } from '@config/env-vars';
import { PostgreSQLModule } from '@config/postgresql';
import { FinancialAssetModule } from '@financial-asset/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [envConfig],
    }),
    PostgreSQLModule,

    // Modules
    FinancialAssetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
