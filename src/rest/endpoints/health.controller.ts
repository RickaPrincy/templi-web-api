import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPagination, ApiRequiredSpec } from '../openapi/decorators';
import { Dummy } from 'src/models';
import {
  Pagination,
  PaginationParams,
} from '../decorators/pagination.decorator';
import { HealthService } from 'src/services';

@Controller()
@ApiTags('Health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/ping')
  @ApiOperation({
    operationId: 'ping',
  })
  @ApiOkResponse({
    content: {
      'text/plain': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async ping() {
    return 'pong';
  }

  @Get('/dummies')
  @ApiPagination()
  @ApiRequiredSpec({ operationId: 'getDummies', type: [Dummy] })
  async getDummies(
    @Pagination() pagination: PaginationParams,
  ): Promise<Dummy[]> {
    return this.healthService.getDummies(pagination);
  }
}
