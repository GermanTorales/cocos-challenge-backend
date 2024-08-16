import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrderModule } from '@order/module';
import { PortfolioModule } from '@portfolio/module';
import { PostgreSQLModule } from '@config/postgresql';
import { validate, envConfig } from '@config/env-vars';
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
    PortfolioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
