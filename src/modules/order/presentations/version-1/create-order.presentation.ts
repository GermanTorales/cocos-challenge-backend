import { ApiProperty } from '@nestjs/swagger';
import { EOrderSides, EOrderStatuses, EOrderTypes, IOrderEntity } from '@order/entity';

export class PCreateOrder
  implements Pick<IOrderEntity, 'id' | 'instrumentid' | 'userid' | 'price' | 'side' | 'size' | 'status' | 'type'>
{
  @ApiProperty({ description: 'Order ID', type: Number, example: 1 })
  id?: number;

  @ApiProperty({ description: 'Instrument ID', type: Number, example: 1 })
  instrumentid: number;

  @ApiProperty({ description: 'User ID', type: Number, example: 1 })
  userid: number;

  @ApiProperty({ description: 'Order price', type: Number, example: 1500 })
  price: number;

  @ApiProperty({ description: 'Order side', type: 'enum', enum: EOrderSides, example: EOrderSides.BUY })
  side: EOrderSides;

  @ApiProperty({ description: 'Order size', type: Number, example: 20 })
  size: number;

  @ApiProperty({ description: 'Order status', type: 'enum', enum: EOrderStatuses, example: EOrderStatuses.FILLED })
  status: EOrderStatuses;

  @ApiProperty({ description: 'Order type', type: 'enum', enum: EOrderTypes, example: EOrderTypes.MARKET })
  type: EOrderTypes;
}
