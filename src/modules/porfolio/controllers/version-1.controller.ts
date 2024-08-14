import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';

import * as V1UseCases from '@portfolio/use-cases/version-1';

@Controller({ path: 'portfolios', version: '1' })
export class PortfolioControllerV1 {
  constructor(private readonly getPorfolioUseCase: V1UseCases.GetPorfolio) {}

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getPorfolio(@Param('userId') userId: number) {
    const portfolio = await this.getPorfolioUseCase.exec(userId);

    return portfolio;
  }
}
