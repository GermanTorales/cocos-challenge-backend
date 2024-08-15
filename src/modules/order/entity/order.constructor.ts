import { EOrderSides, EOrderStatuses, EOrderTypes, IOrderEntity } from './order.entity';

export class OrderConstructor implements Omit<IOrderEntity, 'id'> {
  instrumentid: number;
  userid: number;
  size: number;
  price: number;
  type: EOrderTypes;
  side: EOrderSides;
  status: EOrderStatuses;
  datetime: string;

  constructor(data: Partial<IOrderEntity>) {
    this.instrumentid = data.instrumentid;
    this.userid = data.userid;
    this.type = data.type;
    this.side = data.side;
    this.size = data.size;
    this.price = data.price;
    this.status = this.getStatus(data.size, data.type);
    this.datetime = new Date().toDateString();
  }

  private getStatus(size: number, type: EOrderTypes) {
    if (size <= 0) return EOrderStatuses.REJECTED;
    else if (type === EOrderTypes.MARKET) return EOrderStatuses.FILLED;
    else return EOrderStatuses.NEW;
  }
}
