import { Injectable } from '@nestjs/common';
import { Template } from '../model';
import { Template as DomainTemplate } from 'src/model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TagMapper } from './tag.mapper';

@Injectable()
export class TemplateMapper {
  constructor(
    @InjectRepository(Template)
    private readonly repository: Repository<DomainTemplate>,
    private tagMapper: TagMapper,
  ) {}

  async toRest(template: DomainTemplate): Promise<Template> {
    const { tags = [], deletedAt: _deletedAt, ...restTemplate } = template;

    const restTags = await Promise.all(
      tags.map((tag) => this.tagMapper.toRest(tag)),
    );
    return { ...restTemplate, tags: restTags };
  }

  async toDomain(template: Template): Promise<DomainTemplate> {
    const domainTags = await Promise.all(
      template.tags.map((tag) => this.tagMapper.toDomain(tag)),
    );
    return this.repository.create({ ...template, tags: domainTags });
  }
}
