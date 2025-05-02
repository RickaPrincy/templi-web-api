import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthenticatedUserToken = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.token;
  },
);
