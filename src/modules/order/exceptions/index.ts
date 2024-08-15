import { GenericHttpException } from '@common/exceptions';
import { HttpStatus } from '@nestjs/common';

export class InstrumentNotFound extends GenericHttpException {
  constructor(ticker: string) {
    super(`Instrument [${ticker}] not found.`, HttpStatus.NOT_FOUND, 'TICKER_NOT_FOUND');
  }
}

export class OrderRejected extends GenericHttpException {
  constructor() {
    super(`Order rejected`, HttpStatus.BAD_REQUEST, 'ORDER_REJECTED');
  }
}
