import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserQuery } from '@user/repository';
import { IUserEntity, UserEntity } from '@user/entity';

export interface IUserRepository {
  create: (data: IUserEntity) => Promise<IUserEntity>;
  findOne: (query: { id: string }) => Promise<IUserEntity>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async create(data: IUserEntity): Promise<IUserEntity> {
    return this.repository.save(this.repository.create(data));
  }

  async findOne(queries: { id: string }): Promise<IUserEntity> {
    const query = new UserQuery(this.repository);

    query.byId(queries.id);

    return query.getOne();
  }
}
