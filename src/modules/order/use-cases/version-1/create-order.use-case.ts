import { Inject, Injectable } from '@nestjs/common';

import { PORTS } from '@common/enums';
import { IMarketEntity } from '@market/entity';
import { IOrderRepository } from '@order/repository';
import { CreateOrderDto } from '@order/dtos/version-1';
import { IMarketRepository } from '@market/repository';
import { IInstrumentEntity } from '@financial-asset/entity';
import { IInstrumentRepository } from '@financial-asset/repository';
import { InstrumentNotFound, OrderRejected } from '@order/exceptions';
import { EOrderSides, EOrderStatuses, EOrderTypes, IOrderEntity, OrderConstructor } from '@order/entity';

@Injectable()
export class CreateOrder {
  constructor(
    @Inject(PORTS.Order) private readonly orderRepository: IOrderRepository,
    @Inject(PORTS.Instrument) private readonly instrumentRepository: IInstrumentRepository,
    @Inject(PORTS.Market) private readonly marketRepository: IMarketRepository,
  ) {}

  async exec(data: CreateOrderDto): Promise<IOrderEntity> {
    const instrument: IInstrumentEntity = await this.instrumentRepository.findOne({ ticker: data.ticker });

    if (!instrument) throw new InstrumentNotFound(data.ticker);

    const marketData: IMarketEntity = await this.marketRepository.findOne({ id: instrument.id });
    const userOrders: IOrderEntity[] = await this.orderRepository.find({ userid: data.userid, status: EOrderStatuses.FILLED });

    let newOrder: IOrderEntity;

    if (data.side === EOrderSides.CASH_IN || data.side === EOrderSides.CASH_OUT) {
      newOrder = this.createOrderForCash(data, instrument, userOrders);
    } else {
      newOrder = this.createOrderByType(data, instrument, marketData, userOrders);
    }

    const orderCreated: IOrderEntity = await this.orderRepository.create(newOrder);

    if (newOrder.status === EOrderStatuses.REJECTED) throw new OrderRejected();

    return orderCreated;
  }

  // TODO: Modularizar para su reutilizacion
  private calculateAvailableCash(orders: IOrderEntity[]): number {
    return orders.reduce((cash, order) => {
      if (order.side === EOrderSides.CASH_IN) return cash + order.size;
      else if (order.side === EOrderSides.CASH_OUT) return cash - order.size;
      else if (order.side === EOrderSides.BUY) return cash - order.size * order.price;
      else if (order.side === EOrderSides.SELL) return cash + order.size * order.price;

      return cash;
    }, 0);
  }

  private getSizeToBuy(currentPrice: number, quantity: number, investment: number, availableCash: number): number {
    if (availableCash < currentPrice) return 0;

    if (investment) {
      if (investment > availableCash) return 0;
      if (investment < currentPrice) return 0;

      return Math.floor(investment / currentPrice);
    }

    if (availableCash < quantity * currentPrice) return 0;

    return quantity;
  }

  private getSizeToSell(currentQuantity: number, wantToSell: number): number {
    if (!currentQuantity) return 0;
    if (wantToSell > currentQuantity) return 0;

    return wantToSell;
  }

  private getCurrentPositionQuantity(orders: IOrderEntity[], instrumentId: number): number {
    return orders.reduce((acc, order) => {
      if (order.side === EOrderSides.CASH_IN || order.side === EOrderSides.CASH_OUT) return acc;

      const positionId: number = order.instrumentid['id'];

      if (positionId !== instrumentId) return acc;

      if (order.side === EOrderSides.BUY) acc += order.size;
      else if (order.side === EOrderSides.SELL) acc -= order.size;

      return acc;
    }, 0);
  }

  private createOrderByType(
    data: CreateOrderDto,
    instrument: IInstrumentEntity,
    marketData: IMarketEntity,
    orders: IOrderEntity[],
  ): OrderConstructor {
    const instrumentid: number = instrument.id;
    const type = data.type;
    const availableCash: number = this.calculateAvailableCash(orders);
    const positionQuantity: number = this.getCurrentPositionQuantity(orders, instrumentid);
    const price: number = type === EOrderTypes.MARKET ? marketData.close : data.price;
    let instrumentQuantity: number;

    if (data.side === EOrderSides.BUY) {
      instrumentQuantity = this.getSizeToBuy(price, data.quantity, data.totalInvestment, availableCash);
    } else if (data.side === EOrderSides.SELL) {
      instrumentQuantity = this.getSizeToSell(positionQuantity, data.quantity);
    }

    return new OrderConstructor({ ...data, price, size: instrumentQuantity, instrumentid });
  }

  private createOrderForCash(data: CreateOrderDto, instrument: IInstrumentEntity, orders: IOrderEntity[]) {
    const instrumentid: number = instrument.id;
    const price: number = 1;
    let instrumentQuantity: number = data.quantity;

    if (data.side === EOrderSides.CASH_OUT) {
      const availableCash: number = this.calculateAvailableCash(orders);

      if (availableCash < data.quantity) instrumentQuantity = 0;
    }

    return new OrderConstructor({ ...data, price, size: instrumentQuantity, instrumentid });
  }
}
