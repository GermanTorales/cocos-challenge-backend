import { Inject, Injectable } from '@nestjs/common';

import { PORTS } from '@common/enums';
import { IInstrumentEntity } from '@financial-asset/entity';
import { IInstrumentRepository } from '@financial-asset/repository';
import { GetInstrumentDto } from '@financial-asset/dtos/version-1';

@Injectable()
export class GetInstruments {
  constructor(
    @Inject(PORTS.Instrument)
    private readonly instrumentRepository: IInstrumentRepository,
  ) {}

  async exec(queries: GetInstrumentDto) {
    const instruments: IInstrumentEntity[] = await this.instrumentRepository.find(queries);

    return instruments;
  }
}
