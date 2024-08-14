import { PORTS } from '@common/enums';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@user/entity';
import { UserRepository } from '@user/repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [],
  providers: [{ provide: PORTS.User, useClass: UserRepository }],
  exports: [TypeOrmModule, PORTS.User],
})
export class UserModule {}
