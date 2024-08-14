import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { IInstrumentEntity, InstrumentEntity } from '@financial-asset/entity';

export interface IMarketEntity {
  id: number;
  instrumentid: number;
  high: number;
  low: number;
  open: number;
  close: number;
  previousclose: number;
  date: Date;
}

@Entity('marketdata')
export class MarketEntity implements IMarketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InstrumentEntity)
  @JoinColumn({ name: 'instrumentid' })
  instrumentid: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  high: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  low: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  open: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  close: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  previousclose: number;

  @Column({ type: 'date' })
  date: Date;
}
