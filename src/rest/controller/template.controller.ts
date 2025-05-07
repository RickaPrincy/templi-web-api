import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { TemplateService } from 'src/service';
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
    const repositories = await this.templateService.generate(
      id,
      generateTemplates,
    );
    return repositories;
  }
}
