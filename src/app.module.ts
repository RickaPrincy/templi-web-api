import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth';
import {
  GithubInstallationModule,
  HealthModule,
  GithubModule,
  TemplateModule,
  TagModule,
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
    TagModule,
    TemplateModule,
  ],
})
export class AppModule {}
