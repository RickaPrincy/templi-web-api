import { GenerateTemplate } from './../rest/model/generate-template';
import { PaginationParams } from './../rest/decorator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GithubInstallation, Template } from 'src/model';
import { Repository } from 'typeorm';
import { Criteria } from './utils/criteria';
import { findByCriteria } from './utils/find-by-criteria';
import { UPDATED_AT_CREATED_AT_ORDER_BY } from './utils/default-order-by';
import { GithubService } from './github';
import { GithubInstallationService } from '.';
import { encodedContent } from 'src/service/utils/workflow-template';
import { Octokit } from '@octokit/rest';

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
    if (!template) return 'Template not found';

    const githubInstallation = await this.githubInstallationService.findById(
      generateTemplates.installationId,
    );

    if (!githubInstallation) return 'GitHub installation not found';
    const octokit = await this.githubService.createInstallationOctokit(
      githubInstallation.githubInstallationId,
    );

    if (githubInstallation.isOrg) {
      const { data: repositories } = await octokit.rest.repos.createInOrg({
        org: githubInstallation.orgName,
        name: generateTemplates.repositoryName,
        private: generateTemplates.isPrivate,
      });
      await this.createWorkflow(
        octokit,
        template,
        githubInstallation,
        generateTemplates,
      );
      return repositories;
    }

    const { data: repositories } =
      await octokit.rest.repos.createForAuthenticatedUser({
        name: generateTemplates.repositoryName,
        private: generateTemplates.isPrivate,
        auto_init: true,
      });
    await this.createWorkflow(
      octokit,
      template,
      githubInstallation,
      generateTemplates,
    );
    return repositories;
  }

  private async createWorkflow(
    octokit: Octokit,
    template: Template,
    githubInstallation: GithubInstallation,
    generateTemplates: GenerateTemplate,
  ) {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: githubInstallation.orgName,
      repo: generateTemplates.repositoryName,
      path: '.github/workflows/templi.yml',
      message: 'Add GitHub Actions workflow',
      content: encodedContent(
        template.url,
        generateTemplates.values.find((v) => v.name === 'projectName')?.value ||
          'ProjectName',
        generateTemplates.values.find((v) => v.name === 'license')?.value ||
          'MIT',
      ),
    });
  }
}
