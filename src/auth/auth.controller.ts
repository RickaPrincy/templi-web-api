import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query, Res } from '@nestjs/common';

import { Void } from 'src/rest/model';
import { ApiRequiredSpec } from 'src/rest/swagger/decorator';
import { AuthService } from './auth.service';
import { GITHUB_AUTH_URL } from 'src/service/github';

@Controller()
@ApiTags('Security')
export class AuthController {
  constructor(private readonly securityService: AuthService) {}

  @Post('/login')
  @ApiRequiredSpec({ operationId: 'login', type: Void })
  async login(@Res() res: Response) {
    return res.redirect(GITHUB_AUTH_URL);
  }

  @Get('/auth/github/callback')
  async handleGithubAppCallback(
    @Res() res: Response,
    @Query('code') code: string,
  ) {
    return this.securityService.handleGithubAppCallback(res, code);
  }
}
