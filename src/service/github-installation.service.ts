import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GithubInstallation } from 'src/model';
import { PaginationParams } from 'src/rest/decorator';
import { Repository } from 'typeorm';
import { Criteria } from './utils/criteria';
import { findByCriteria } from './utils/find-by-criteria';
import { UPDATED_AT_CREATED_AT_ORDER_BY } from './utils/default-order-by';

@Injectable()
export class GithubInstallationService {
  constructor(
    @InjectRepository(GithubInstallation)
    private readonly repository: Repository<GithubInstallation>,
  ) {}

  async update(githubInstallation: GithubInstallation) {
    await this.repository.delete({
      githubInstallationId: githubInstallation.githubInstallationId,
      isOrg: githubInstallation.isOrg,
      orgName: githubInstallation.orgName,
      user: {
        id: githubInstallation.user.id,
      },
    });
    return this.repository.save(githubInstallation);
  }

  async findAll(
    pagination: PaginationParams,
    criteria: Criteria<GithubInstallation>,
  ) {
    return findByCriteria<GithubInstallation>({
      repository: this.repository,
      criteria,
      pagination,
      order: UPDATED_AT_CREATED_AT_ORDER_BY,
    });
  }

  async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async deleteByInstallationId(installationId: string) {
    return this.repository.delete({
      githubInstallationId: installationId,
    });
  }
}
