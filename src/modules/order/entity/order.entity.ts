import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '@user/entity';
import { InstrumentEntity } from '@financial-asset/entity';

export enum EOrderTypes {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}

export enum EOrderSides {
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum EOrderStatuses {
  NEW = 'NEW',
  FILLED = 'FILLED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface IOrderEntity {
  id?: number;
  instrumentid: number;
  userid: number;
  size: number;
  price: number;
  type: EOrderTypes;
  side: EOrderSides;
  status: EOrderStatuses;
  datetime: string;
}

@Entity('orders')
export class OrderEntity implements IOrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InstrumentEntity)
  @JoinColumn({ name: 'instrumentid' })
  instrumentid: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userid' })
  userid: number;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 10 })
  type: EOrderTypes;

  @Column({ type: 'varchar', length: 10 })
  side: EOrderSides;

  @Column({ type: 'varchar', length: 10 })
  status: EOrderStatuses;

  @CreateDateColumn({ type: 'timestamp' })
  datetime: string;
}
