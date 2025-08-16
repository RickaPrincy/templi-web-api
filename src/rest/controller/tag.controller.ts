import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagService } from 'src/service';
import { TagMapper } from '../mapper';
import {
  ApiCriteria,
  ApiPagination,
  ApiRequiredSpec,
} from '../swagger/decorator';
import { Tag } from '../model';
import { Pagination, PaginationParams } from '../decorator';
import { ILike } from 'typeorm';

@Controller()
@ApiTags('Resources')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly tagMapper: TagMapper,
  ) {}

  @Get('/tags')
  @ApiPagination()
  @ApiCriteria({ name: 'name', type: 'string' })
  @ApiRequiredSpec({
    operationId: 'getTags',
    type: [Tag],
  })
  async getTags(
    @Pagination() pagination: PaginationParams,
    @Query('name') name: string,
  ) {
    const tags = await this.tagService.findAll(pagination, {
      name: name !== undefined ? ILike(`%${name}%`) : undefined,
    });

    return await Promise.all(tags.map((tag) => this.tagMapper.toRest(tag)));
  }
}
