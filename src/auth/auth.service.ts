import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { GithubService } from 'src/service/github';
import { JwtPayload, Whoami } from './model';
import { User } from 'src/model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  private static readonly _UI_CALLBACK_PREFIX: string = 'auth/github/callback';

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly githubService: GithubService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async handleGithubAppCallback(res: Response, code: string) {
    try {
      const githubToken = await this.githubService.createToken(code);
      const githubUser = await this.githubService.getUserInfo(githubToken);
      await this.handleUserSignup({
        id: uuid(),
        githubId: githubUser.id.toString(),
        name: githubUser.name ?? uuid(),
        email: githubUser.email!,
        avatar: githubUser.avatar_url,
      });

      const jwtPayload: JwtPayload = {
        id: githubUser.id.toString(),
        name: githubUser.name ?? '',
      };
      const token = this.jwtService.sign(jwtPayload);
      return res.redirect(await this.getRedirectURL(token));
    } catch (e) {
      console.log('e', e);
      throw new ForbiddenException('Bad Credentials');
    }
  }

  async whoami(token: string, user: User): Promise<Whoami> {
    return {
      ...user,
      token,
    };
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
      await this.userRepository.save(user);
    }
  }
}
