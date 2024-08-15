import { Repository, SelectQueryBuilder } from 'typeorm';

import { IInstrumentEntity, InstrumentEntity } from '@financial-asset/entity';

export class InstrumentQuery {
  private queryBuilder: SelectQueryBuilder<InstrumentEntity>;

  constructor(private readonly repository: Repository<InstrumentEntity>) {
    this.queryBuilder = this.repository.createQueryBuilder('i');
  }

  byTicker(ticker: string): this {
    if (!ticker?.length) return this;

    this.queryBuilder.orWhere('i.ticker ILIKE :ticker', { ticker: `%${ticker}%` });

    return this;
  }

  byName(name: string): this {
    if (!name?.length) return this;

    this.queryBuilder.orWhere('i.name ILIKE :name', { name: `%${name}%` });

    return this;
  }

  async getMany(): Promise<IInstrumentEntity[]> {
    return await this.queryBuilder.getMany();
  }

  async getOne(): Promise<IInstrumentEntity | undefined> {
    return await this.queryBuilder.getOne();
  }
}
