import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserTypeEnum } from 'src/users/domain/enum/userType.enum';
import { User } from 'src/users/domain/user';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    if (!user && !user.type) {
      throw new ForbiddenException(
        'You have no rights to access the resource!',
      );
    }
    return user.type === UserTypeEnum.admin;
  }
}
