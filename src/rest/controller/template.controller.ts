import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { TemplateService } from 'src/service';
import {
  ApiCriteria,
  ApiPagination,
  ApiRequiredSpec,
} from '../swagger/decorator';
import { GenerateTemplate, Template } from '../model';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Pagination, PaginationParams } from '../decorator';
import { Authenticated } from 'src/auth/decorator';
import { TemplateMapper } from '../mapper';
import { ILike } from 'typeorm';

@Controller()
@ApiTags('Resources')
export class TemplateController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly templateMapper: TemplateMapper,
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
  @ApiRequiredSpec({ operationId: 'generateTemplate', type: GenerateTemplate })
  @ApiBody({ type: GenerateTemplate })
  async generateTemplates(
    @Param('id') id: string,
    @Body() generateTemplate: GenerateTemplate,
  ) {
    const repositories = await this.templateService.generate(
      id,
      generateTemplate,
    );
    return repositories;
  }
}
