import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { OrderQuery } from '@order/repository';
import { IOrderEntity, OrderEntity } from '@order/entity';

export interface IOrderRepository {
  find: (query: Partial<IOrderEntity>) => Promise<IOrderEntity[]>;
  create: (data: IOrderEntity) => Promise<IOrderEntity>;
}

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(@InjectRepository(OrderEntity) private repository: Repository<OrderEntity>) {}

  async find(queries: Partial<IOrderEntity>): Promise<IOrderEntity[]> {
    const query = new OrderQuery(this.repository);

    query.byUserId(queries.userid);
    query.byStatus(queries.status);
    query.orderByCreated('ASC');

    return query.getMany();
  }

  async create(data: IOrderEntity): Promise<IOrderEntity> {
    return this.repository.save(this.repository.create(data));
  }
}
