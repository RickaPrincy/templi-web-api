import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth';
import {
  GithubInstallationModule,
  HealthModule,
  GithubModule,
  TemplateModule,
} from './module';
import { DatabaseModule } from './module/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    HealthModule,
    GithubModule,
    GithubInstallationModule,
    TemplateModule,
  ],
})
export class AppModule {}
