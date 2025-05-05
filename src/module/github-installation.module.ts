import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubInstallation } from 'src/model';
import { GithubInstallationController } from 'src/rest/controller/github-installation.controller';
import { GithubInstallationMapper } from 'src/rest/mapper';
import { GithubInstallationService } from 'src/service';

@Module({
  exports: [GithubInstallationService],
  imports: [TypeOrmModule.forFeature([GithubInstallation])],
  controllers: [GithubInstallationController],
  providers: [GithubInstallationMapper, GithubInstallationService],
})
export class GithubInstallationModule {}
