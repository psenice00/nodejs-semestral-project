import { UserStatusEnum } from './enum/userStatus.enum';
import { UserTypeEnum } from './enum/userType.enum';

export class User {
  id: string;
  createdAt: Date;
  lastLoginAt: Date;
  deletedAt?: Date;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  status: UserStatusEnum;
  type: UserTypeEnum;
}
