import { Injectable } from '@nestjs/common';
import { GithubInstallation } from '../model';
import { GithubInstallation as DomainGithubInstallation } from 'src/model';

@Injectable()
export class GithubInstallationMapper {
  async toRest(
    githubInstallation: DomainGithubInstallation,
  ): Promise<GithubInstallation> {
    const {
      deletedAt: _deletedAt,
      user: _user,
      ...restGithubInstallation
    } = githubInstallation;
    return restGithubInstallation;
  }
}
