import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PORTS } from '@common/enums';
import { MarketEntity } from '@market/entity';
import { MarketRepository } from '@market/repository';

@Module({
  imports: [TypeOrmModule.forFeature([MarketEntity])],
  controllers: [],
  providers: [{ provide: PORTS.Market, useClass: MarketRepository }],
  exports: [TypeOrmModule, PORTS.Market],
})
export class MarketModule {}
