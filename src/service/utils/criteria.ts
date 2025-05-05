import { FindOneOptions } from 'typeorm';

export type Criteria<T> = FindOneOptions<T>['where'];
