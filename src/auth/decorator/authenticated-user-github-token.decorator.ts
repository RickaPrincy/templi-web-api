import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../model';
import { User } from 'src/model';

export const AuthenticatedUserGithubToken = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return (request.user as { user: User; payload: JwtPayload }).payload
      .encryptedGithubToken;
  },
);
