import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
  Put,
  Query,
} from '@nestjs/common';
import { TemplateService } from 'src/service';
import {
  ApiCriteria,
  ApiPagination,
  ApiRequiredSpec,
} from '../swagger/decorator';
import {
  GenerateProjectPayload,
  GenerateProjectResponse,
  GenerateWithPersistedTemplate,
  Template,
} from '../model';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Pagination, PaginationParams } from '../decorator';
import {
  Authenticated,
  AuthenticatedWithApiKey,
  AuthenticatedUserGithubToken,
} from 'src/auth/decorator';
import { GenerateProjectMapper, TemplateMapper } from '../mapper';

@Controller()
@ApiTags('Resources')
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly templateMapper: TemplateMapper,
    private readonly generateMapper: GenerateProjectMapper,
  ) {}

  @Get('/templates/:id')
  @ApiRequiredSpec({ operationId: 'getTemplateById', type: Template })
  async findTemplateById(@Param('id') id: string) {
    const template = await this.templateService.findById(id);

    if (!template) {
      throw new NotFoundException();
    }

    return this.templateMapper.toRest(template);
  }

  @Get('/templates')
  @ApiPagination()
  @ApiRequiredSpec({ operationId: 'getTemplates', type: [Template] })
  @ApiCriteria(
    { type: 'string', name: 'name' },
    { type: 'string', name: 'tags', isArray: true },
  )
  @ApiPagination()
  async findTemplates(
    @Pagination() pagination: PaginationParams,
    @Query('name') name: string,
    @Query('tags', new ParseArrayPipe({ items: String, separator: ',' }))
    tags: string[],
  ) {
    const templates = await this.templateService.findAll(pagination, {
      name,
      tags,
    });

    return Promise.all(
      templates.map((template) => this.templateMapper.toRest(template)),
    );
  }

  @Put('/templates')
  @ApiRequiredSpec({ operationId: 'crupdateTemplates', type: [Template] })
  @ApiBody({ type: [Template] })
  @AuthenticatedWithApiKey()
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
  @Authenticated()
  @ApiRequiredSpec({
    operationId: 'generateProjectWithTemplate',
    type: GenerateProjectResponse,
  })
  @ApiBody({ type: GenerateWithPersistedTemplate })
  async generateTemplatesWithTemplate(
    @Param('id') id: string,
    @Body() generateProject: GenerateWithPersistedTemplate,
    @AuthenticatedUserGithubToken() encryptedGithubToken: string,
  ) {
    const domainPayload = await this.generateMapper.withTemplateToDomain(
      id,
      generateProject,
    );
    const repositories = await this.templateService.generate(
      encryptedGithubToken,
      domainPayload,
    );
    return repositories;
  }

  @Put('/generate')
  @Authenticated()
  @ApiRequiredSpec({
    operationId: 'generateProject',
    type: GenerateProjectResponse,
  })
  @ApiBody({ type: GenerateProjectPayload })
  async generateTemplates(
    @AuthenticatedUserGithubToken() encryptedGithubToken: string,
    @Body() generateProject: GenerateProjectPayload,
  ) {
    const domainPayload = await this.generateMapper.toDomain(generateProject);
    const repositories = await this.templateService.generate(
      encryptedGithubToken,
      domainPayload,
    );
    return repositories;
  }
}
