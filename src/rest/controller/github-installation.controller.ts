import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GithubInstallationService } from 'src/service';
import { GithubInstallationMapper } from '../mapper';
import { ApiPagination, ApiRequiredSpec } from '../swagger/decorator';
import { GithubInstallation } from '../model';
import { Authenticated } from 'src/auth/decorator';
import { Pagination, PaginationParams } from '../decorator';

@Controller()
@ApiTags('Resources')
export class GithubInstallationController {
  constructor(
    private readonly githubInstallationService: GithubInstallationService,
    private readonly githubInstallationMapper: GithubInstallationMapper,
  ) {}

  @Get('users/:id/installations')
  @Authenticated({ selfMatcher: 'id' })
  @ApiPagination()
  @ApiRequiredSpec({
    operationId: 'getInstallationsByUserId',
    type: [GithubInstallation],
  })
  async getInstallationsByUserId(
    @Pagination() pagination: PaginationParams,
    @Param('id') userId: string,
  ) {
    const installations = await this.githubInstallationService.findAll(
      pagination,
      {
        user: {
          id: userId,
        },
      },
    );

    return Promise.all(
      installations.map((installation) =>
        this.githubInstallationMapper.toRest(installation),
      ),
    );
  }
}
