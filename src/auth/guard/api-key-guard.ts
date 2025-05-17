import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const candidateApiKey = request.headers['x-api-key'];

    if (!candidateApiKey) {
      return false;
    }

    const expectedApiKey = this.configService.get('API_KEY');

    if (!expectedApiKey) {
      return false;
    }

    return expectedApiKey === candidateApiKey;
  }
}
