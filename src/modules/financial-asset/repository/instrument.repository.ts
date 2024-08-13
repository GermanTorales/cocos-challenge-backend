import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { IInstrumentRepository } from '@financial-asset/repository';
import { IInstrumentEntity, InstrumentEntity } from '@financial-asset/entity';

@Injectable()
export class InstrumentRepository implements IInstrumentRepository {
  constructor(
    @InjectRepository(InstrumentEntity)
    private repository: Repository<InstrumentEntity>,
  ) {}

  async create(data: IInstrumentEntity): Promise<IInstrumentEntity> {
    return this.repository.save(this.repository.create(data));
  }

  async find(queries: { text: string }): Promise<IInstrumentEntity[]> {
    const query = new InstrumentQuery(this.repository);

    query.byTicker(queries.text);
    query.byName(queries.text);

    return query.getMany();
  }
}

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
