import { Inject, Injectable } from '@nestjs/common';

import { PORTS } from '@common/enums';
import { IMarketEntity } from '@market/entity';
import { IOrderRepository } from '@order/repository';
import { CreateOrderDto } from '@order/dtos/version-1';
import { IMarketRepository } from '@market/repository';
import { calculateAvailableCash } from '@/common/utils';
import { IInstrumentEntity } from '@financial-asset/entity';
import { IInstrumentRepository } from '@financial-asset/repository';
import { InstrumentNotFound, OrderRejected } from '@order/exceptions';
import { EOrderSides, EOrderStatuses, EOrderTypes, IOrderEntity, OrderConstructor } from '@order/entity';

interface ICreateOrderFn {
  dto: CreateOrderDto;
  instrument: IInstrumentEntity;
  orders: IOrderEntity[];
}

interface ICreateOrderRes {
  newOrder: IOrderEntity;
  canCompleteOrder: boolean;
}

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

    const userOrders: IOrderEntity[] = await this.orderRepository.find({ userid: data.userid, status: EOrderStatuses.FILLED });

    let newOrder: IOrderEntity;

    if (data.side === EOrderSides.CASH_IN || data.side === EOrderSides.CASH_OUT) {
      newOrder = this.createOrderForCash({ dto: data, instrument, orders: userOrders });
    } else {
      const result = await this.createOrderByType({ dto: data, instrument, orders: userOrders });

      newOrder = result.newOrder;

      if (!result.canCompleteOrder) newOrder.status = EOrderStatuses.REJECTED;
    }

    const orderCreated: IOrderEntity = await this.orderRepository.create(newOrder);

    if (newOrder.status === EOrderStatuses.REJECTED) throw new OrderRejected();

    return orderCreated;
  }

  private getSize(currentPrice: number, quantity: number = 0, investment: number): number {
    return investment ? Math.floor(investment / currentPrice) : quantity;
  }

  private checkBuyConditions(currentPrice: number, quantity: number = 0, investment: number, availableCash: number): boolean {
    if (availableCash < currentPrice) return false;

    if (investment) {
      if (investment > availableCash) return false;
      if (investment < currentPrice) return false;

      return true;
    }

    if (availableCash < quantity * currentPrice) return false;

    return true;
  }

  private checkSellConditions(currentQuantity: number, wantToSell: number): boolean {
    if (!currentQuantity) return false;
    if (wantToSell > currentQuantity) return false;

    return true;
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

  private async createOrderByType(data: ICreateOrderFn): Promise<ICreateOrderRes> {
    const { instrument, orders, dto } = data;
    const marketData: IMarketEntity = await this.marketRepository.findOne({ id: instrument.id });

    const instrumentid: number = instrument.id;
    const type = dto.type;
    const availableCash: number = calculateAvailableCash(orders);
    const positionQuantity: number = this.getCurrentPositionQuantity(orders, instrumentid);
    const price: number = type === EOrderTypes.MARKET ? marketData.close : dto.price;

    let instrumentQuantity: number;
    let canCompleteOrder: boolean;

    if (dto.side === EOrderSides.BUY) {
      instrumentQuantity = this.getSize(price, dto.quantity, dto.totalInvestment);
      canCompleteOrder = this.checkBuyConditions(price, instrumentQuantity, dto.totalInvestment, availableCash);
    } else if (dto.side === EOrderSides.SELL) {
      instrumentQuantity = this.getSize(price, dto.quantity, dto.totalInvestment);
      canCompleteOrder = this.checkSellConditions(positionQuantity, instrumentQuantity);
    }

    const newOrder = new OrderConstructor({ ...dto, price, size: instrumentQuantity, instrumentid });

    return { newOrder, canCompleteOrder };
  }

  private createOrderForCash(data: ICreateOrderFn): IOrderEntity {
    const { instrument, dto, orders } = data;
    const instrumentid: number = instrument.id;
    const price: number = 1;
    let instrumentQuantity: number = dto.quantity;

    if (dto.side === EOrderSides.CASH_OUT) {
      const availableCash: number = calculateAvailableCash(orders);

      if (availableCash < dto.quantity) instrumentQuantity = 0;
    }

    return new OrderConstructor({ ...dto, price, size: instrumentQuantity, instrumentid });
  }
}
