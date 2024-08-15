import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateOrderDto } from '@order/dtos/version-1';
import * as V1UseCases from '@order/use-cases/version-1';

@Controller({ path: 'orders', version: '1' })
export class OrderControllerV1 {
  constructor(private readonly createOrderUseCase: V1UseCases.CreateOrder) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() body: CreateOrderDto) {
    const newOrder = await this.createOrderUseCase.exec(body);

    return newOrder;
  }
}
