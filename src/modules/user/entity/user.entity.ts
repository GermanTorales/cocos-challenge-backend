import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface IUserEntity {
  id: number;
  email: string;
  accountnumber: string;
}

@Entity('users')
export class UserEntity implements IUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  accountnumber: string;
}
