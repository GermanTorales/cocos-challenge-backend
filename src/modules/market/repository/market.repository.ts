import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { IMarketEntity, MarketEntity } from '@market/entity';

export interface IMarketRepository {
  find: (queries: { ids: number[] }) => Promise<IMarketEntity[]>;
}

@Injectable()
export class MarketRepository implements IMarketRepository {
  constructor(@InjectRepository(MarketEntity) private repository: Repository<MarketEntity>) {}

  async find(queries: { ids: number[] }): Promise<IMarketEntity[]> {
    const query = new MarketQuery(this.repository);

    query.joinInstruments();
    query.byId(queries.ids);

    return query.getMany();
  }
}

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

  async getMany(): Promise<IMarketEntity[]> {
    return await this.queryBuilder.getMany();
  }

  async getOne(): Promise<IMarketEntity | undefined> {
    return await this.queryBuilder.getOne();
  }
}
