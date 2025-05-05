import { FindOptionsOrder } from 'typeorm';

export const UPDATED_AT_CREATED_AT_ORDER_BY: FindOptionsOrder<{
  createdAt: string;
  updatedAt: string;
}> = {
  updatedAt: 'DESC',
  createdAt: 'DESC',
};
