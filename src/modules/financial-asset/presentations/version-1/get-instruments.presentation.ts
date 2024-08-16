import { IInstrumentEntity } from '@financial-asset/entity';
import { ApiProperty } from '@nestjs/swagger';

export class PGetInstrument implements Pick<IInstrumentEntity, 'id' | 'name' | 'ticker' | 'type'> {
  @ApiProperty({ description: 'Instrument id', type: Number, example: 1 })
  id: number;

  @ApiProperty({ description: 'Instrument name', type: String, example: 'Y.P.F SA.' })
  name: string;

  @ApiProperty({ description: 'Instrument ticker', type: String, example: 'YPFD' })
  ticker: string;

  @ApiProperty({ description: 'Instrument type', type: String, example: 'ACCIONES' })
  type: string;
}
