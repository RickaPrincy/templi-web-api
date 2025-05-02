import { Module } from '@nestjs/common';
import { GithubService } from 'src/service/github';

@Module({
  exports: [GithubService],
  providers: [GithubService],
})
export class GithubModule {}
