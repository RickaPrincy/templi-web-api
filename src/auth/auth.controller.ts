import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, Res } from '@nestjs/common';

import { AuthService } from './auth.service';
import {
  Authenticated,
  AuthenticatedUser,
  AuthenticatedUserToken,
} from './decorator';
import { User } from 'src/model';
import { ApiRequiredSpec } from 'src/rest/swagger/decorator';
import { Whoami } from './model';

@Controller()
@ApiTags('Security')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/auth/github/callback')
  async handleGithubAppCallback(
    @Res() res: Response,
    @Query('code') code: string,
  ) {
    return this.authService.handleGithubAppCallback(res, code);
  }

  @Get('/whoami')
  @Authenticated()
  @ApiRequiredSpec({ operationId: 'whoami', type: Whoami })
  async whomai(
    @AuthenticatedUserToken() token: string,
    @AuthenticatedUser() user: User,
  ) {
    return this.authService.whoami(token, user);
  }
}
