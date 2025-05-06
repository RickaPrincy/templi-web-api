import { Injectable } from '@nestjs/common';
import { Template } from '../model';
import { Template as DomainTemplate } from 'src/model';

@Injectable()
export class TemplateMapper {
  async toRest(template: DomainTemplate): Promise<Template> {
    const { deletedAt: _deletedAt, ...restTemplate } = template;
    return restTemplate;
  }

  async toDomain(template: Template): Promise<DomainTemplate> {
    return template;
  }
}
