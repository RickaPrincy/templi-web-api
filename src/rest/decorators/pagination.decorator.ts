import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Max, IsInt, Min, validate } from 'class-validator';
import { MAX_ITEM_PER_PAGE } from '../openapi/decorators';

export class PaginationParams {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  @Max(MAX_ITEM_PER_PAGE)
  pageSize: number;
}

export const Pagination = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext): Promise<PaginationParams> => {
    const request = ctx.switchToHttp().getRequest();
    const { page = 1, pageSize = 10 } = request.query;

    const paginationParams = plainToClass(PaginationParams, {
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),
    });

    const errors = await validate(paginationParams);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    return paginationParams;
  },
);
