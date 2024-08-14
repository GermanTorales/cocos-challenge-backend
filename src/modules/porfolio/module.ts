import { Module } from '@nestjs/common';

import { UserModule } from '@user/module';
import { OrderModule } from '@order/module';
import { PortfolioControllers } from '@portfolio/controllers';
import * as V1UseCases from '@portfolio/use-cases/version-1';
import { MarketModule } from '@market/module';

@Module({
  imports: [UserModule, OrderModule, MarketModule],
  controllers: [...PortfolioControllers],
  providers: [V1UseCases.GetPorfolio],
  exports: [],
})
export class PortfolioModule {}
