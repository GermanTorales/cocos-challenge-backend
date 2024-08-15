import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MarketQuery } from '@market/repository';
import { IMarketEntity, MarketEntity } from '@market/entity';

export interface IMarketRepository {
  find: (queries: { ids: number[] }) => Promise<IMarketEntity[]>;
  findOne: (queries: Partial<IMarketEntity>) => Promise<IMarketEntity>;
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

  async findOne(queries: Partial<IMarketEntity>): Promise<IMarketEntity> {
    const query = new MarketQuery(this.repository);

    query.byId([queries.id]);
    query.byDate('DESC');

    return query.getOne();
  }
}
