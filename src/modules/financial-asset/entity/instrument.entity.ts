import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface IInstrumentEntity {
  id: number;
  ticker: string;
  name: string;
  type: string;
}

@Entity('instruments')
export class InstrumentEntity implements IInstrumentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ticker: string;

  @Column()
  name: string;

  @Column()
  type: string;
}
