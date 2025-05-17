import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

import { ApiKeyGuard } from '../guard';

export function AuthenticatedWithApiKey() {
  return applyDecorators(
    UseGuards(ApiKeyGuard),
    ApiHeader({ name: 'x-api-key' }),
  );
}
