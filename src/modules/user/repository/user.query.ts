import { Repository, SelectQueryBuilder } from 'typeorm';

import { IUserEntity, UserEntity } from '@user/entity';

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
