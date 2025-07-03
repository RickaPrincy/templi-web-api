import { Injectable, NotFoundException } from '@nestjs/common';
import { GenerateProject } from 'src/service/model';
import {
  GenerateProjectPayload,
  GenerateWithPersistedTemplate,
} from '../model';
import { TemplateService } from 'src/service';

@Injectable()
export class GenerateProjectMapper {
  constructor(private readonly templateService: TemplateService) {}

  async withTemplateToDomain(
    templateId: string,
    rest: GenerateWithPersistedTemplate,
  ): Promise<GenerateProject> {
    const template = await this.templateService.findById(templateId);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return {
      scope: template.scope,
      templateUrl: template.url,
      isPrivateRepository: rest.isPrivate,
      repositoryName: rest.repositoryName,
      values: rest.values,
      installationId: rest.installationId,
    };
  }

  async toDomain(rest: GenerateProjectPayload): Promise<GenerateProject> {
    return {
      scope: rest.scope,
      templateUrl: rest.templateUrl,
      isPrivateRepository: rest.isPrivate,
      repositoryName: rest.repositoryName,
      values: rest.values,
      installationId: rest.installationId,
    };
  }
}
