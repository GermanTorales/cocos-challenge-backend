import { EOrderSides, IOrderEntity } from '@/modules/order/entity';

export const calculateAvailableCash = (orders: IOrderEntity[]): number => {
  return orders.reduce((cash, order) => {
    if (order.side === EOrderSides.CASH_IN) return cash + order.size;
    else if (order.side === EOrderSides.CASH_OUT) return cash - order.size;
    else if (order.side === EOrderSides.BUY) return cash - order.size * order.price;
    else if (order.side === EOrderSides.SELL) return cash + order.size * order.price;

    return cash;
  }, 0);
};
