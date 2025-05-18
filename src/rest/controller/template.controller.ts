import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { ILike } from 'typeorm';
import { TemplateService } from 'src/service';
import {
  ApiCriteria,
  ApiPagination,
  ApiRequiredSpec,
} from '../swagger/decorator';
import {
  GenerateProjectPayload,
  GenerateWithPersistedTemplate,
  Template,
} from '../model';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Pagination, PaginationParams } from '../decorator';
import {
  Authenticated,
  AuthenticatedUser,
  AuthenticatedWithApiKey,
} from 'src/auth/decorator';
import { GenerateProjectMapper, TemplateMapper } from '../mapper';
import { User } from 'src/model';

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
  @ApiCriteria({ type: 'string', name: 'name' })
  @ApiPagination()
  async findTemplates(
    @Pagination() pagination: PaginationParams,
    @Query('name') name: string,
  ) {
    const templates = await this.templateService.findAll(pagination, {
      name: name ? ILike(`%${name}%`) : undefined,
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
    type: GenerateWithPersistedTemplate,
  })
  @ApiBody({ type: GenerateWithPersistedTemplate })
  async generateTemplatesWithTemplate(
    @Param('id') id: string,
    @Body() generateProject: GenerateWithPersistedTemplate,
    @AuthenticatedUser() user: User,
  ) {
    const domainPayload = await this.generateMapper.withTemplatetoDomain(
      id,
      generateProject,
    );
    const repositories = await this.templateService.generate(
      user,
      domainPayload,
    );
    return repositories;
  }

  @Put('/generate')
  @Authenticated()
  @ApiRequiredSpec({
    operationId: 'generateProject',
    type: GenerateProjectPayload,
  })
  @ApiBody({ type: GenerateProjectPayload })
  async generateTemplates(
    @AuthenticatedUser() user: User,
    @Body() generateProject: GenerateProjectPayload,
  ) {
    const domainPayload = await this.generateMapper.toDomain(generateProject);
    const repositories = await this.templateService.generate(
      user,
      domainPayload,
    );
    return repositories;
  }
}
