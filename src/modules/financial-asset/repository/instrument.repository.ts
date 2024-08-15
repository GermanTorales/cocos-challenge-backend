import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { InstrumentQuery } from '@financial-asset/repository';
import { IInstrumentEntity, InstrumentEntity } from '@financial-asset/entity';

export interface IInstrumentRepository {
  create: (data: IInstrumentEntity) => Promise<IInstrumentEntity>;
  find: (query: { text: string }) => Promise<IInstrumentEntity[]>;
  findOne: (query: Partial<IInstrumentEntity>) => Promise<IInstrumentEntity>;
}

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

  async findOne(queries: Partial<IInstrumentEntity>): Promise<IInstrumentEntity> {
    const query = new InstrumentQuery(this.repository);

    query.byTicker(queries.ticker);

    return query.getOne();
  }
}
