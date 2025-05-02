import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { GithubService } from 'src/service/github';
import { JwtPayload } from './model';

@Injectable()
export class AuthService {
  private static readonly _UI_CALLBACK_PREFIX: string = 'auth/github/callback';

  constructor(
    private readonly githubService: GithubService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async handleGithubAppCallback(res: Response, code: string) {
    const githubToken = await this.githubService.createToken(code);
    const user = await this.githubService.getUserInfo(githubToken);

    const jwtPayload: JwtPayload = {
      id: user.id.toString(),
      name: user.name ?? '',
    };
    const token = this.jwtService.sign(jwtPayload);
    return res.redirect(await this._getRedirectURL(token));
  }

  private async _getRedirectURL(token: string) {
    const uiURL = this.configService.get('UI_URL');
    return `${uiURL}/${AuthService._UI_CALLBACK_PREFIX}?token=${token}`;
  }
}
