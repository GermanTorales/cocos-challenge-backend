import { Inject, Injectable } from '@nestjs/common';

import { PORTS } from '@common/enums';
import { IMarketEntity } from '@market/entity';
import { IOrderRepository } from '@order/repository';
import { IMarketRepository } from '@market/repository';
import { IInstrumentEntity } from '@financial-asset/entity';
import { EOrderSides, EOrderStatuses, IOrderEntity } from '@order/entity';

@Injectable()
export class GetPorfolio {
  constructor(
    @Inject(PORTS.Order) private readonly orderRepository: IOrderRepository,
    @Inject(PORTS.Market) private readonly marketRepository: IMarketRepository,
  ) {}

  async exec(userid: number) {
    const status = EOrderStatuses.FILLED;

    const orders: IOrderEntity[] = await this.orderRepository.find({ userid, status });

    const positionsIds = this.getPositionsId(orders);

    const marketData: IMarketEntity[] = await this.marketRepository.find({ ids: positionsIds });

    const availableCash: number = this.calculateAvailableCash(orders);
    const positionsCalculated = this.calculatePositions(orders, marketData);

    return { availableCash, positions: positionsCalculated };
  }

  private calculateAvailableCash(orders: IOrderEntity[]) {
    return orders.reduce((cash, order) => {
      if (order.side === EOrderSides.CASH_IN) return cash + order.size;
      else if (order.side === EOrderSides.CASH_OUT) return cash - order.size;
      else if (order.side === EOrderSides.BUY) return cash - order.size * order.price;
      else if (order.side === EOrderSides.SELL) return cash + order.size * order.price;

      return cash;
    }, 0);
  }

  private getPositionsId(orders: IOrderEntity[]) {
    const positions = orders.reduce((acc, order) => {
      if (order.side === EOrderSides.CASH_IN || order.side === EOrderSides.CASH_OUT) return acc;

      const instrumentId: number = order.instrumentid['id'];

      if (!acc[instrumentId]) acc[instrumentId] = [];

      acc[instrumentId].push(order);

      return acc;
    }, {});

    return Object.keys(positions).map((p) => parseInt(p));
  }

  private calculatePositions(orders: IOrderEntity[], marketData: IMarketEntity[]) {
    const positions = new Map<number, { quantity: number; totalValue: number; profitLoss: number }>();

    // TODO: PREGUNTAR
    // SI UNA POSICION PUEDE QUEDAR CON CANTIDAD NEGATIVA. EJ INSTRUMENTO ID 31 QUE PRIMERO COMPRA 20 Y
    // Y DESPUES VENDE 30, POR LO QUE LA CANTIDAD QUEDA EN -10

    orders.forEach((order) => {
      const instrument: IInstrumentEntity = order.instrumentid as unknown as IInstrumentEntity;
      const instrumentId: number = instrument.id;

      if (order.side === EOrderSides.CASH_IN || order.side === EOrderSides.CASH_OUT) return;

      if (order.side === EOrderSides.BUY) {
        if (!positions.has(instrumentId)) {
          positions.set(instrumentId, { quantity: 0, totalValue: 0, profitLoss: 0 });
        }

        const position = positions.get(instrumentId);

        position.quantity += order.size;
        position.totalValue += order.size * order.price;
      } else if (order.side === EOrderSides.SELL) {
        const position = positions.get(instrumentId);

        if (position) {
          position.quantity -= order.size;
          position.totalValue -= order.size * order.price;
        }
      }
    });

    return Array.from(positions.entries()).map(([instrumentId, position]) => {
      const market: IMarketEntity = marketData.find((m) => m.instrumentid['id'] === instrumentId);

      const currentPositionValuation: number = position.quantity * market.close;
      const returnOnInvestment: number = ((currentPositionValuation - position.totalValue) / position.totalValue) * 100;
      const loss: number = currentPositionValuation - position.totalValue;
      const instrumentData: IInstrumentEntity = market.instrumentid as unknown as IInstrumentEntity;

      const instrument = {
        id: instrumentId,
        ticker: instrumentData.ticker,
        name: instrumentData.name,
        type: instrumentData.type,
      };

      const positionData = {
        quantity: position.quantity,
        totalValue: currentPositionValuation,
        returnOnInvestment: returnOnInvestment.toFixed(2),
        loss,
      };

      return { instrument, position: positionData };
    });
  }
}
