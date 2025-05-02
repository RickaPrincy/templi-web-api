import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthApp } from '@octokit/oauth-app';
import { Octokit } from '@octokit/rest';

@Injectable()
export class GithubService {
  private _oauthApp: OAuthApp;

  constructor(private readonly configService: ConfigService) {
    this._oauthApp = new OAuthApp({
      clientType: 'oauth-app',
      clientId: this.configService.get('GITHUB_CLIENT_ID')!,
      clientSecret: this.configService.get('GITHUB_CLIENT_SECRET')!,
    });
  }

  async createToken(code: string) {
    const { authentication } = await this._oauthApp.createToken({
      code,
    });

    return authentication.token;
  }

  async getUserInfo(token: string) {
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.users.getAuthenticated();
    return user;
  }
}
