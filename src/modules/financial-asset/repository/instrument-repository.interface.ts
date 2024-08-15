import { IInstrumentEntity } from '@financial-asset/entity';

export interface IInstrumentRepository {
  create: (data: IInstrumentEntity) => Promise<IInstrumentEntity>;
  find: (query: { text: string }) => Promise<IInstrumentEntity[]>;
  findOne: (query: Partial<IInstrumentEntity>) => Promise<IInstrumentEntity>;
}
