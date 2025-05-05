import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { GithubService } from 'src/service/github';
import { Whoami } from './model';
import { User } from 'src/model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { GithubInstallationService } from 'src/service';

@Injectable()
export class AuthService {
  private static readonly _UI_CALLBACK_PREFIX: string = 'auth/github/callback';

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly githubService: GithubService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly githubInstallationService: GithubInstallationService,
  ) {}

  async handleGithubAppCallback(
    res: Response,
    code: string,
    installationId: string,
  ) {
    try {
      const githubUser = await this.githubService.getUserInfo(code);
      const user = await this.handleUserSignup({
        id: uuid(),
        githubId: githubUser.id.toString(),
        name: githubUser.name ?? uuid(),
        email: githubUser.email!,
        avatar: githubUser.avatar_url,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (installationId) {
        await this.handleGithubInstallation(user, installationId);
      }

      const token = this.jwtService.sign({
        id: githubUser.id.toString(),
        name: githubUser.name ?? '',
      });
      return res.redirect(await this.getRedirectURL(token));
    } catch (_e) {
      throw new ForbiddenException('Bad Credentials');
    }
  }

  async whoami(token: string, user: User): Promise<Whoami> {
    return {
      ...user,
      token,
    };
  }

  async handleGithubInstallation(user: User, installationId: string) {
    try {
      const account = (await this.githubService.getInstallation(installationId))
        ?.account as any;
      const isOrg = account?.type === 'Organization';
      const orgName = account?.login;

      this.githubInstallationService.save({
        id: uuid(),
        isOrg,
        user,
        orgName,
        githubInstallationId: installationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (_e) {
      throw new ForbiddenException('Bad Credentials');
    }
  }

  private async getRedirectURL(token: string) {
    const uiURL = this.configService.get('UI_URL');
    return `${uiURL}/${AuthService._UI_CALLBACK_PREFIX}?token=${token}`;
  }

  private async handleUserSignup(user: User) {
    const persistedUser = await this.userRepository.findOneBy({
      githubId: user.githubId,
    });
    if (!persistedUser) {
      return await this.userRepository.save(user);
    }
    return persistedUser;
  }
}
