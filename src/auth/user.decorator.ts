import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/domain/user';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): User => {
    return context.getArgByIndex(0).user;
  },
);
