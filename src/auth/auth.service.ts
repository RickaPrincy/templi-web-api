import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { Whoami } from './model';
import { GithubInstallation, User } from 'src/model';
import { GithubService } from 'src/service/github';
import { GithubInstallationService } from 'src/service';
import { cryptoUtil } from 'src/service/utils/crypto';

@Injectable()
export class AuthService {
  private static readonly _UI_CALLBACK_PREFIX: string = 'auth/github/callback';

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly githubService: GithubService,
    private readonly configService: ConfigService,
    private readonly githubInstallationService: GithubInstallationService,
  ) {}

  async handleGithubAppCallback(
    res: Response,
    code: string,
    installationId: string,
  ) {
    try {
      const { user, token } = await this.initAuth(code);

      if (installationId) {
        await this.handleGithubInstallation(user, installationId);
      }

      // Just to make sure the token will never be leaked
      // or used somewhere else than inside Templi
      const encryptedToken = cryptoUtil.encrypt(token);
      const jwtToken = this.jwtService.sign({
        id: user.id,
        name: user.name,
        encryptedGithubToken: encryptedToken,
      });

      return res.redirect(await this.getRedirectURL(jwtToken));
    } catch (e) {
      if (e instanceof InternalServerErrorException) {
        throw e;
      }

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
    const account = (await this.githubService.getInstallation(installationId))
      ?.account as any;
    const isOrg = account?.type === 'Organization';
    const orgName = account?.login;

    const installation: GithubInstallation = {
      id: uuid(),
      isOrg,
      user,
      orgName,
      githubInstallationId: installationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return await this.githubInstallationService.update(installation);
  }

  private async getRedirectURL(jwtToken: string) {
    const uiURL = this.configService.get('UI_URL');
    return `${uiURL}/${AuthService._UI_CALLBACK_PREFIX}?token=${jwtToken}`;
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

  private async initAuth(code: string) {
    const token = await this.githubService.getOAuthToken(code);
    const octokit = await this.githubService.createOAuthUserOctokit(token);
    const { data: githubUser } = await octokit.users.getAuthenticated();

    const user = await this.handleUserSignup({
      id: uuid(),
      githubId: githubUser.id.toString(),
      name: githubUser.name ?? uuid(),
      email: githubUser.email!,
      avatar: githubUser.avatar_url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { user, token };
  }
}
