import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const MAX_ITEM_PER_PAGE = 500;

export function ApiPagination() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      type: 'number',
      required: false,
      schema: {
        type: 'number',
        minimum: 1,
        default: 1,
      },
    }),
    ApiQuery({
      name: 'pageSize',
      type: 'number',
      required: false,
      schema: {
        type: 'number',
        default: 10,
        minimum: 1,
        maximum: MAX_ITEM_PER_PAGE,
      },
    }),
  );
}
