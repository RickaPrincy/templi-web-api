import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GithubInstallation, User } from 'src/model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GithubModule } from 'src/module';
import { JwtStrategy } from './strategy';
import { GithubInstallationService } from 'src/service';

@Global()
@Module({
  imports: [
    GithubModule,
    PassportModule,
    TypeOrmModule.forFeature([User, GithubInstallation]),
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
  providers: [AuthService, JwtStrategy, GithubInstallationService],
  controllers: [AuthController],
})
export class AuthModule {}
