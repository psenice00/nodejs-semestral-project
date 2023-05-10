import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { UserEntity } from './database/user.entity';
import { UserRepository } from '../../user.repository';
import { HashService } from './domain/hash.service';
import { UsersService } from './domain/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UsersService, HashService, UserRepository],
  exports: [UsersService, HashService, UserRepository],
})
export class UserModule {}
