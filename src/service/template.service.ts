import { PaginationParams } from './../rest/decorator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from 'src/model';
import { Repository } from 'typeorm';
import { Criteria } from './utils/criteria';
import { findByCriteria } from './utils/find-by-criteria';
import { UPDATED_AT_CREATED_AT_ORDER_BY } from './utils/default-order-by';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly repository: Repository<Template>,
  ) {}

  async findAll(pagination: PaginationParams, criteria: Criteria<Template>) {
    return findByCriteria<Template>({
      repository: this.repository,
      criteria,
      pagination,
      order: UPDATED_AT_CREATED_AT_ORDER_BY,
    });
  }

  async findById(id: string) {
    return await this.repository.findOneBy({ id });
  }

  async save(templates: Template[]) {
    return await this.repository.save(templates);
  }
}
