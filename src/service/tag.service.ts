import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Tag } from 'src/model';
import { PaginationParams } from 'src/rest/decorator';
import { Repository } from 'typeorm';
import { Criteria } from './utils/criteria';
import { findByCriteria } from './utils/find-by-criteria';
import { UPDATED_AT_CREATED_AT_ORDER_BY } from './utils/default-order-by';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly repository: Repository<Tag>,
  ) {}

  async findAll(pagination: PaginationParams, criteria: Criteria<Tag>) {
    return findByCriteria<Tag>({
      repository: this.repository,
      criteria,
      pagination,
      order: { name: 'ASC', ...UPDATED_AT_CREATED_AT_ORDER_BY },
    });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }
}
