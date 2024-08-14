import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '@user/module';
import { OrderModule } from '@order/module';
import { MarketModule } from '@market/module';
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
    FinancialAssetModule,
    OrderModule,
    UserModule,
    PortfolioModule,
    MarketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
