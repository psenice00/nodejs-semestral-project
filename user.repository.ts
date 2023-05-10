import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './src/users/domain/user';
import { UserEntity } from './src/users/database/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  toDomain(entity: UserEntity): User {
    return { ...entity };
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.repository.findOne({
      where: { id },
    });

    return result ? this.toDomain(result) : null;
  }

  async findAll(): Promise<User[]> {
    const res = await this.repository.find();
    return res.map(this.toDomain);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.repository.findOne({
      where: { email },
    });

    return result ? this.toDomain(result) : null;
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    return this.repository.save({ ...user, id });
  }

  async create(user: Partial<User>): Promise<User> {
    return this.repository.save(user);
  }

  // using soft delete for keeping user data after delete
  async softDelete(id: string): Promise<boolean> {
    const res = await this.repository.softDelete(id);
    return res.affected ? true : false;
  }
}
