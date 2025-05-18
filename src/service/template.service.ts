import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Octokit } from '@octokit/rest';
import { Repository } from 'typeorm';

import { Criteria } from './utils/criteria';
import { GithubService } from './github';
import { GenerateProject } from './model';
import { PaginationParams } from './../rest/decorator';
import { GithubInstallation, Template, User } from 'src/model';
import { GithubTokenService } from './github-token.service';
import { GithubInstallationService } from './github-installation.service';

import { findByCriteria } from './utils/find-by-criteria';
import { generateWorkflowFile } from 'src/service/utils/workflow-template';
import { UPDATED_AT_CREATED_AT_ORDER_BY } from './utils/default-order-by';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly repository: Repository<Template>,
    private readonly githubService: GithubService,
    private readonly githubTokenService: GithubTokenService,
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

  async generate(user: User, generatePayload: GenerateProject) {
    const githubInstallation = await this.githubInstallationService.findById(
      generatePayload.installationId,
    );
    if (!githubInstallation) {
      throw new NotFoundException('githubInstallation');
    }

    const octokit = await this.createOctokit(user, githubInstallation);

    if (githubInstallation.isOrg) {
      await octokit.repos.createInOrg({
        org: githubInstallation.orgName,
        name: generatePayload.repositoryName,
        private: generatePayload.isPrivateRepository,
      });
    } else {
      await octokit.repos.createForAuthenticatedUser({
        name: generatePayload.repositoryName,
        private: generatePayload.isPrivateRepository,
      });
    }

    await this.createWorkflowToGenerateProject(
      octokit,
      githubInstallation,
      generatePayload,
    );

    return generatePayload;
  }

  private async createOctokit(
    user: User,
    githubInstallation: GithubInstallation,
  ) {
    if (githubInstallation.isOrg) {
      return await this.githubService.createInstallationOctokit(
        githubInstallation.githubInstallationId,
      );
    }

    const token = await this.githubTokenService.findByUserId(user.id);
    return this.githubService.createOAuthUserOctokit(token.value);
  }

  private async createWorkflowToGenerateProject(
    octokit: Octokit,
    githubInstallation: GithubInstallation,
    generateProject: GenerateProject,
  ) {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: githubInstallation.orgName,
      repo: generateProject.repositoryName,
      content: generateWorkflowFile(generateProject),
      path: `.github/workflows/templi-generate.yml`,
      message: 'Project Generation',
    });
  }
}
