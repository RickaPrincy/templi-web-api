import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Dummy } from 'src/models';
import { PaginationParams } from 'src/rest/decorators';
import { createPagination } from './utils/create-pagination';

const DUMMIES: Dummy[] = [
  {
    id: '1',
    name: 'dummy1',
  },
  {
    id: '2',
    name: 'dummy2',
  },
  {
    id: '3',
    name: 'dummy3',
  },
];

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(Dummy) private readonly repository: Repository<Dummy>,
  ) {}

  async getDummies(pagination: PaginationParams) {
    await this.repository.save(
      DUMMIES.map((dummy) => this.repository.create(dummy)),
    );
    return this.repository.find(createPagination(pagination));
  }
}
