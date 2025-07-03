import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from 'src/model';
import { JwtPayload } from '../model';

export const AuthenticatedUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();
    return (request.user as { user: User; payload: JwtPayload }).user;
  },
);
