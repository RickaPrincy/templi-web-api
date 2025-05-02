import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';

export type ApiCriteriaOptions = Partial<ApiQueryOptions>;

export function ApiCriteria(...keys: ApiCriteriaOptions[]) {
  const queries = keys.map((key) => {
    return ApiQuery({
      ...key,
      required: false,
    });
  });

  return applyDecorators(...queries);
}
