import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from 'src/model';
import { TemplateController } from 'src/rest/controller/template.controller';
import { TemplateMapper } from 'src/rest/mapper';
import { TemplateService } from 'src/service';
import { GithubModule } from './github.module';
import { GithubInstallationModule } from './github-installation.module';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService, TemplateMapper],
  imports: [
    TypeOrmModule.forFeature([Template]),
    GithubModule,
    GithubInstallationModule,
  ],
})
export class TemplateModule {}
