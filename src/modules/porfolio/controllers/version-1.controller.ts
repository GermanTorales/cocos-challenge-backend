import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import * as V1UseCases from '@portfolio/use-cases/version-1';
import { PGetPortfolio } from '../presentations/version-1';

@Controller({ path: 'portfolios', version: '1' })
@ApiTags('Portfolios')
export class PortfolioControllerV1 {
  constructor(private readonly getPorfolioUseCase: V1UseCases.GetPorfolio) {}

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({ type: PGetPortfolio })
  async getPorfolio(@Param('userId') userId: number) {
    const portfolio = await this.getPorfolioUseCase.exec(userId);

    return portfolio;
  }
}
