import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard, SelfMatcherGuard } from '../guard';

export function Authenticated({
  selfMatcher = '',
}: {
  selfMatcher?: string;
} = {}) {
  return applyDecorators(
    SetMetadata('self-matcher', selfMatcher),
    UseGuards(JwtAuthGuard, SelfMatcherGuard),
    ApiBearerAuth(),
  );
}
