import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import * as V1UseCases from '@financial-asset/use-cases/version-1';
import { GetInstrumentDto } from '@financial-asset/dtos/version-1';

@Controller({ path: 'financial-assets', version: '1' })
export class FinancialAssetControllerV1 {
  constructor(private readonly getInstrumentsUseCase: V1UseCases.GetInstruments) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getInstruments(@Query() queries: GetInstrumentDto) {
    const instruments = await this.getInstrumentsUseCase.exec(queries);

    return instruments;
  }
}
