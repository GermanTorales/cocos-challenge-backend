import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

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

export class UserQuery {
  private queryBuilder: SelectQueryBuilder<UserEntity>;

  constructor(private readonly repository: Repository<UserEntity>) {
    this.queryBuilder = this.repository.createQueryBuilder('u');
  }

  byId(id: string): this {
    if (!id) return this;

    this.queryBuilder.orWhere('u.id = :id', { id });

    return this;
  }

  async getMany(): Promise<IUserEntity[]> {
    return await this.queryBuilder.getMany();
  }

  async getOne(): Promise<IUserEntity | undefined> {
    return await this.queryBuilder.getOne();
  }
}
