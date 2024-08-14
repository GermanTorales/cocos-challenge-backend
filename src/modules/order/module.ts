import { PORTS } from '@common/enums';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderEntity } from '@order/entity';
import { OrderRepository } from '@order/repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  controllers: [],
  providers: [{ provide: PORTS.Order, useClass: OrderRepository }],
  exports: [TypeOrmModule, PORTS.Order],
})
export class OrderModule {}
