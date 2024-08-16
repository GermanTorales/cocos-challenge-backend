import { ApiProperty } from '@nestjs/swagger';

export class PInstrument {
  @ApiProperty({ description: 'Instrument ID', type: Number, example: 1 })
  id: number;

  @ApiProperty({ description: 'Instrument ticker', type: String, example: 'CEPU' })
  ticker: string;

  @ApiProperty({ description: 'Instrument name', type: String, example: 'Central Puerto' })
  name: string;

  @ApiProperty({ description: 'Instrument type', type: String, example: 'ACCIONES' })
  type: string;
}

export class PPositionInfo {
  @ApiProperty({ description: 'Position quantity', type: Number, example: 10 })
  quantity: number;

  @ApiProperty({ description: 'Position total value', type: Number, example: 1000 })
  totalValue: number;

  @ApiProperty({ description: 'Position yield percentage', type: Number, example: 0.5 })
  yieldPercentage: number;

  @ApiProperty({ description: 'Position yield value', type: Number, example: 10 })
  yieldValue: number;
}

export class PPosition {
  @ApiProperty({ type: PInstrument })
  instrument: PInstrument;

  @ApiProperty({ type: PPositionInfo })
  position: PPositionInfo;
}

export class PGetPortfolio {
  @ApiProperty({ description: 'User available cash to use', type: Number, example: 10000 })
  availableCash: number;

  @ApiProperty({ description: 'Positions list', isArray: true, type: PPosition })
  positions: PPosition[];
}
