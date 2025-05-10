import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Octokit } from '@octokit/rest';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { GithubService } from './github';
import { Criteria } from './utils/criteria';
import { GithubInstallationService } from '.';
import { PaginationParams } from './../rest/decorator';
import { GithubInstallation, Template } from 'src/model';
import { GenerateTemplate } from './../rest/model';

import { findByCriteria } from './utils/find-by-criteria';
import { generateWorkFlows } from 'src/service/utils/workflow-template';
import { UPDATED_AT_CREATED_AT_ORDER_BY } from './utils/default-order-by';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly repository: Repository<Template>,
    private readonly githubService: GithubService,
    private readonly githubInstallationService: GithubInstallationService,
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

  async generate(id: string, generateTemplates: GenerateTemplate) {
    const template = await this.findById(id);
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const githubInstallation = await this.githubInstallationService.findById(
      generateTemplates.installationId,
    );
    if (!githubInstallation) {
      throw new NotFoundException('githubInstallation');
    }

    const octokit = await this.githubService.createInstallationOctokit(
      githubInstallation.githubInstallationId,
    );

    //TODO: refactor
    if (githubInstallation.isOrg) {
      await octokit.repos.createInOrg({
        org: githubInstallation.orgName,
        name: generateTemplates.repositoryName,
        private: generateTemplates.isPrivate,
      });
    } else {
      await octokit.repos.createForAuthenticatedUser({
        name: generateTemplates.repositoryName,
        private: generateTemplates.isPrivate,
        auto_init: true,
      });
    }

    await this.createWorkflow(
      octokit,
      template,
      githubInstallation,
      generateTemplates,
    );

    return generateTemplates;
  }

  private async createWorkflow(
    octokit: Octokit,
    template: Template,
    githubInstallation: GithubInstallation,
    generateTemplate: GenerateTemplate,
  ) {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: githubInstallation.orgName,
      repo: generateTemplate.repositoryName,
      content: generateWorkFlows(template, generateTemplate),
      path: `.github/workflows/templi-generate-${uuid()}`,
      message: 'Add GitHub Actions workflow',
    });
  }
}
