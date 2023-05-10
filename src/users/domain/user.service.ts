import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterRequestDto } from 'src/auth/controller/dto/registerRequest.dto';
import { HashService } from 'src/users/domain/hash.service';
import {
  EMAIL_ALREADY_TAKEN,
  INCORRECT_CREDENTIALS,
  INCORRECT_PASSWORD,
  USER_NOT_FOUND,
} from 'src/common/exceptions/exception';

import { UserRepository } from '../../../user.repository';
import { UserStatusEnum } from './enum/userStatus.enum';
import { UserTypeEnum } from './enum/userType.enum';
import { User } from './user';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async updateLastLoginAt(user: User): Promise<User> {
    return await this.usersRepository.update(user.id, {
      lastLoginAt: new Date(),
    });
  }

  async verifyPassword(id: string, password: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException(USER_NOT_FOUND);
    if (!(await this.hashService.compare(password, user.password)))
      throw new NotAcceptableException(INCORRECT_CREDENTIALS);
  }

  async create(dto: RegisterRequestDto) {
    const existingUser = await this.usersRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new NotAcceptableException(EMAIL_ALREADY_TAKEN);
    }
    const hashedPassword = await this.hashService.hash(dto.password);

    return this.usersRepository.create({
      ...dto,
      type: UserTypeEnum.user,
      status: UserStatusEnum.enabled,
      password: hashedPassword,
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    return this.usersRepository.softDelete(id);
  }

  async findByEmail(id: string): Promise<User | null> {
    return this.usersRepository.findByEmail(id);
  }

  //   async update(id: number, dto: UpdateUserDto): Promise<User> {
  //     // Check if there is a user with the same email
  //     if (typeof dto.email != 'undefined') {
  //       const existingUser = await this.usersRepository.findOne({
  //         where: { email: dto.email },
  //       });
  //       if (existingUser) {
  //         throw new UnauthorizedException(E_USER_EMAIL_TAKEN);
  //       }
  //     }

  //     // Check if user exists
  //     const user = await this.findOneByField(id);
  //     if (!user) throw new NotFoundException(E_USER_NOT_FOUND);

  //     // Update and return user
  //     Object.assign(user, { ...dto });
  //     await this.usersRepository.save(user);
  //     return user;
  //   }

  async updatePassword(
    currentPassword: string,
    newPassword: string,
    currentUser: User,
  ): Promise<void> {
    if (
      !(await this.hashService.compare(currentPassword, currentUser.password))
    )
      throw new BadRequestException(INCORRECT_PASSWORD);

    const hashedPassword = await this.hashService.hash(newPassword);

    await this.usersRepository.update(currentUser.id, {
      password: hashedPassword,
    });
  }

  async remove(id: string): Promise<boolean> {
    return this.usersRepository.softDelete(id);
  }
}
