import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, ValidateIf } from 'class-validator';

import { EOrderSides, EOrderTypes } from '@order/entity';

export class CreateOrderDto {
  @ApiProperty({ description: 'User id', type: Number, example: 1 })
  @IsInt()
  @IsPositive()
  userid: number;

  @ApiProperty({ description: 'Instrument ticker', type: String, example: 'GGAL' })
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @ApiProperty({ description: 'Order type', type: 'enum', enum: EOrderTypes, example: EOrderTypes.MARKET })
  @IsEnum(EOrderTypes)
  type: EOrderTypes;

  @ApiProperty({ description: 'Order side', type: 'enum', enum: EOrderSides, example: EOrderSides.BUY })
  @IsEnum(EOrderSides)
  side: EOrderSides;

  @ApiProperty({ description: 'Total investment', type: Number, example: 1500, required: false })
  @ValidateIf((params) => params.type === EOrderTypes.MARKET && !params?.quantity)
  @IsPositive()
  totalInvestment?: number;

  @ApiProperty({ description: 'Order quantity', type: Number, example: 10, required: false })
  @ValidateIf((params) => params.type === EOrderTypes.MARKET && !params?.totalInvestment)
  @IsInt()
  @IsPositive()
  quantity?: number;

  @ApiProperty({ description: 'Order price', type: Number, example: 15.5, required: false })
  @ValidateIf((params) => params.type === EOrderTypes.LIMIT)
  @IsPositive()
  price: number;
}
