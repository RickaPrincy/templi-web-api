import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GithubInstallation, GithubToken, User } from 'src/model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy';
import { ApiKeyGuard } from './guard';
import { GithubService } from 'src/service/github';
import { GithubInstallationService, GithubTokenService } from 'src/service';

@Global()
@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, GithubInstallation, GithubToken]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            // 5m | 5h | 5d
            expiresIn: configService.get('JWT_EXPIRATION_TIME'),
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    ApiKeyGuard,
    JwtStrategy,
    GithubInstallationService,
    GithubTokenService,
    GithubService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
