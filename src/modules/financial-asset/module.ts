import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PORTS } from '@common/enums';
import { InstrumentEntity } from '@financial-asset/entity';
import * as V1UseCases from '@financial-asset/use-cases/version-1';
import { InstrumentRepository } from '@financial-asset/repository';
import { FinancialAssetControllers } from '@financial-asset/controllers';

@Module({
  imports: [TypeOrmModule.forFeature([InstrumentEntity])],
  controllers: [...FinancialAssetControllers],
  providers: [V1UseCases.GetInstruments, { provide: PORTS.Instrument, useClass: InstrumentRepository }],
  exports: [TypeOrmModule, PORTS.Instrument],
})
export class FinancialAssetModule {}
