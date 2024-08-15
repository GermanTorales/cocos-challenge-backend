import * as dayjs from 'dayjs';

import { IMarketEntity } from '@market/entity';
import { IInstrumentEntity } from '@financial-asset/entity';
import { EOrderSides, EOrderStatuses, EOrderTypes, IOrderEntity } from '@order/entity';

export const instrument: IInstrumentEntity = { id: 42, ticker: 'PAMP', name: 'Pampa', type: 'ACTIONS' };

export const marketData: IMarketEntity = {
  id: 1,
  instrumentid: 42,
  high: 100,
  low: 100,
  open: 90,
  close: 101,
  previousclose: 90,
  date: new Date(),
};

export const userOrders: IOrderEntity[] = [
  {
    instrumentid: 66,
    userid: 1,
    size: 10000,
    price: 1,
    side: EOrderSides.CASH_IN,
    type: EOrderTypes.MARKET,
    status: EOrderStatuses.FILLED,
    datetime: dayjs().subtract(7, 'd').toISOString(),
  },
  {
    instrumentid: 42,
    userid: 1,
    size: 50,
    price: marketData.previousclose,
    side: EOrderSides.BUY,
    type: EOrderTypes.MARKET,
    status: EOrderStatuses.FILLED,
    datetime: dayjs().subtract(1, 'd').toISOString(),
  },
  {
    instrumentid: 42,
    userid: 1,
    size: 10,
    price: marketData.close,
    side: EOrderSides.SELL,
    type: EOrderTypes.MARKET,
    status: EOrderStatuses.FILLED,
    datetime: dayjs().toISOString(),
  },
  {
    instrumentid: 66,
    userid: 1,
    size: 1000,
    price: 1,
    side: EOrderSides.CASH_OUT,
    type: EOrderTypes.MARKET,
    status: EOrderStatuses.FILLED,
    datetime: dayjs().toISOString(),
  },
];
