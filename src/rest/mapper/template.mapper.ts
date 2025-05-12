import { Injectable } from '@nestjs/common';
import { Template } from '../model';
import { Template as DomainTemplate } from 'src/model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TemplateMapper {
  constructor(
    @InjectRepository(Template)
    private readonly repository: Repository<DomainTemplate>,
  ) {}

  async toRest(template: DomainTemplate): Promise<Template> {
    const { deletedAt: _deletedAt, ...restTemplate } = template;
    return restTemplate;
  }

  async toDomain(template: Template): Promise<DomainTemplate> {
    return this.repository.create(template);
  }
}
