import { Repository, SelectQueryBuilder } from 'typeorm';

import { EOrderStatuses, IOrderEntity, OrderEntity } from '@order/entity';

export class OrderQuery {
  private queryBuilder: SelectQueryBuilder<OrderEntity>;

  constructor(private readonly repository: Repository<OrderEntity>) {
    this.queryBuilder = this.repository.createQueryBuilder('o');
  }

  byUserId(id: number): this {
    if (!id) return this;

    this.queryBuilder.orWhere('o.userid = :id', { id });

    return this;
  }

  byStatus(status: EOrderStatuses): this {
    if (!status) return this;

    this.queryBuilder.andWhere('o.status = :status', { status });

    return this;
  }

  orderByCreated(type) {
    this.queryBuilder.orderBy('o.datetime', type);

    return this;
  }

  async getMany(): Promise<IOrderEntity[]> {
    this.queryBuilder.leftJoinAndSelect('o.instrumentid', 'instrument');

    return await this.queryBuilder.getMany();
  }

  async getOne(): Promise<IOrderEntity | undefined> {
    return await this.queryBuilder.getOne();
  }
}
