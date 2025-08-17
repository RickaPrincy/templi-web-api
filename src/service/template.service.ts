import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Octokit } from '@octokit/rest';
import { Repository } from 'typeorm';

import { GithubService } from './github';
import { GenerateProject } from './model';
import { PaginationParams } from './../rest/decorator';
import { GithubInstallation, Template } from 'src/model';
import { GithubInstallationService } from './github-installation.service';

import { generateWorkflowFile } from 'src/service/utils/workflow-template';
import { cryptoUtil } from './utils/crypto';
import { createPagination } from './utils/create-pagination';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly repository: Repository<Template>,
    private readonly githubService: GithubService,
    private readonly githubInstallationService: GithubInstallationService,
  ) {}

  async findAll(
    pagination: PaginationParams,
    criteria: { name?: string; tags?: string[] },
  ) {
    const qb = this.repository
      .createQueryBuilder('template')
      .leftJoinAndSelect('template.tags', 'tag');

    if (criteria?.name !== undefined) {
      qb.andWhere('template.name ILIKE :name', { name: `%${criteria.name}%` });
    }

    if (criteria.tags && criteria.tags.length > 0) {
      criteria.tags.forEach((t, idx) => {
        if (idx === 0) {
          qb.andWhere('tag.name = :tag0', { tag0: t });
        } else {
          qb.orWhere(`tag.name = :tag${idx}`, { [`tag${idx}`]: t });
        }
      });
    }

    const paginationValue = createPagination(pagination);
    qb.skip(paginationValue.skip).take(paginationValue.take);
    return qb.getMany();
  }

  async findById(id: string) {
    return await this.repository.findOneBy({ id });
  }

  async save(templates: Template[]) {
    return await this.repository.save(templates);
  }

  async generate(
    encryptedGithubToken: string,
    generatePayload: GenerateProject,
  ) {
    const githubInstallation = await this.githubInstallationService.findById(
      generatePayload.installationId,
    );
    if (!githubInstallation) {
      throw new NotFoundException('githubInstallation');
    }

    const octokit = await this.createOctokit(
      encryptedGithubToken,
      githubInstallation,
    );

    const response = { url: '' };

    if (githubInstallation.isOrg) {
      const {
        data: { html_url },
      } = await octokit.repos.createInOrg({
        org: githubInstallation.orgName,
        name: generatePayload.repositoryName,
        private: generatePayload.isPrivateRepository,
      });
      response.url = html_url;
    } else {
      const {
        data: { html_url },
      } = await octokit.repos.createForAuthenticatedUser({
        name: generatePayload.repositoryName,
        private: generatePayload.isPrivateRepository,
      });
      response.url = html_url;
    }

    await this.createWorkflowToGenerateProject(
      octokit,
      githubInstallation,
      generatePayload,
    );

    return response;
  }

  private async createOctokit(
    encryptedGithubToken: string,
    githubInstallation: GithubInstallation,
  ) {
    if (githubInstallation.isOrg) {
      return await this.githubService.createInstallationOctokit(
        githubInstallation.githubInstallationId,
      );
    }

    const token = cryptoUtil.decrypt(encryptedGithubToken);
    return this.githubService.createOAuthUserOctokit(token);
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
