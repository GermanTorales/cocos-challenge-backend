import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, ValidateIf } from 'class-validator';

import { EOrderSides, EOrderTypes } from '@order/entity';

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  userid: number;

  @IsString()
  @IsNotEmpty()
  ticker: string;

  @IsEnum(EOrderTypes)
  type: EOrderTypes;

  @IsEnum(EOrderSides)
  side: EOrderSides;

  @IsOptional()
  @IsPositive()
  totalInvestment?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity?: number;

  @ValidateIf((params) => params.type === EOrderTypes.LIMIT)
  @IsPositive()
  price: number;
}
