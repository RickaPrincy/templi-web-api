import { GithubService } from './../../service/github/github.service';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { GithubInstallationService, TemplateService } from 'src/service';
import { ApiPagination, ApiRequiredSpec } from '../swagger/decorator';
import { GenerateTemplate, Template } from '../model';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Pagination, PaginationParams } from '../decorator';
import { Authenticated } from 'src/auth/decorator';
import { TemplateMapper } from '../mapper';

@Controller()
@ApiTags('Resources')
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly templateMapper: TemplateMapper,
    private readonly githubService: GithubService,
    private readonly githubInstallationService: GithubInstallationService,
  ) {}

  @Get('/templates')
  @ApiPagination()
  @ApiRequiredSpec({ operationId: 'getTemplates', type: [Template] })
  @ApiPagination()
  async findTemplates(@Pagination() pagination: PaginationParams) {
    const templates = await this.templateService.findAll(pagination, {});
    return Promise.all(
      templates.map((template) => this.templateMapper.toRest(template)),
    );
  }

  @Put('/templates')
  @ApiRequiredSpec({ operationId: 'crupdateTemplates', type: [Template] })
  @ApiBody({
    type: [Template],
  })
  @Authenticated()
  async saveTemplates(@Body() templates: Template[]) {
    const domainTemplates = await Promise.all(
      templates.map((template) => this.templateMapper.toDomain(template)),
    );
    const savedTemplates = await this.templateService.save(domainTemplates);
    return Promise.all(
      savedTemplates.map((template) => this.templateMapper.toRest(template)),
    );
  }

  @Put('/templates/:id/generate')
  @ApiRequiredSpec({
    operationId: 'generateTemplate',
    type: [Template],
  })
  @ApiBody({
    type: [GenerateTemplate],
  })
  @Authenticated()
  async generateTemplates(
    @Param('id') id: string,
    @Body() generateTemplates: GenerateTemplate,
  ) {
    const template = await this.templateService.findById(id);
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
      return repositories;
    }

    const { data: repositories } =
      await octokit.rest.repos.createForAuthenticatedUser({
        name: generateTemplates.repositoryName,
        private: generateTemplates.isPrivate,
      });
    return repositories;
  }
}
