import { Repository, SelectQueryBuilder } from 'typeorm';

import { IMarketEntity, MarketEntity } from '@market/entity';

export class MarketQuery {
  private queryBuilder: SelectQueryBuilder<MarketEntity>;

  constructor(private readonly repository: Repository<MarketEntity>) {
    this.queryBuilder = this.repository.createQueryBuilder('m');
  }

  byId(ids: number[]): this {
    if (!ids?.length) return this;

    this.queryBuilder.orWhere('m.instrumentid IN (:...ids)', { ids });

    return this;
  }

  joinInstruments() {
    this.queryBuilder.leftJoinAndSelect('m.instrumentid', 'instrument');

    return this;
  }

  byDate(type) {
    this.queryBuilder.orderBy('m.date', type);

    return this;
  }

  async getMany(): Promise<IMarketEntity[]> {
    return await this.queryBuilder.getMany();
  }

  async getOne(): Promise<IMarketEntity | undefined> {
    return await this.queryBuilder.getOne();
  }
}
