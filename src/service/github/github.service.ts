import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Octokit } from '@octokit/rest';
import { AuthInterface } from '@octokit/auth-app/dist-types/types';
import { createAppAuth } from '@octokit/auth-app';

@Injectable()
export class GithubService {
  private appAuth: AuthInterface;

  constructor(private readonly configService: ConfigService) {
    this.appAuth = createAppAuth({
      appId: +this.configService.get('GITHUB_APP_ID')!,
      clientId: this.configService.get('GITHUB_CLIENT_ID')!,
      clientSecret: this.configService.get('GITHUB_CLIENT_SECRET')!,
      privateKey: this.configService.get('GITHUB_PRIVATE_KEY')!,
    });
  }

  async createOAuthUserOctokit(token: string): Promise<Octokit> {
    return new Octokit({ auth: token });
  }

  async createInstallationOctokit(installationId: string): Promise<Octokit> {
    return new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: +this.configService.get('GITHUB_APP_ID')!,
        clientId: this.configService.get('GITHUB_CLIENT_ID')!,
        clientSecret: this.configService.get('GITHUB_CLIENT_SECRET')!,
        privateKey: this.configService.get('GITHUB_PRIVATE_KEY')!,
        installationId: +installationId,
      },
    });
  }

  async getOAuthToken(code: string) {
    const authentication = await this.appAuth(
      { type: 'oauth-user', code } as any /* ARGHHHHHHH */,
    );

    return authentication.token;
  }

  async getInstallation(installationId: string) {
    const octokit = await this.createInstallationOctokit(installationId);
    const { data: installation } = await octokit.apps.getInstallation({
      installation_id: +installationId,
    });
    return installation;
  }
}
