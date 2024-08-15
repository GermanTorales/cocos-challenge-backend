import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PORTS } from '@common/enums';
import { OrderEntity } from '@order/entity';
import { MarketModule } from '@market/module';
import { OrderRepository } from '@order/repository';
import { OrderControllers } from '@order/controllers';
import * as V1UseCases from '@order/use-cases/version-1';
import { FinancialAssetModule } from '@financial-asset/module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), FinancialAssetModule, MarketModule],
  controllers: [...OrderControllers],
  providers: [V1UseCases.CreateOrder, { provide: PORTS.Order, useClass: OrderRepository }],
  exports: [TypeOrmModule, PORTS.Order],
})
export class OrderModule {}
