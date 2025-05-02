import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SelfMatcherGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    const paramKey = this.reflector.get<string>(
      'self-matcher',
      context.getHandler(),
    );
    if (!paramKey) {
      return true;
    }

    const paramValue = request.params[paramKey];
    if (!paramValue || user.id !== paramValue) {
      return false;
    }

    return true;
  }
}
