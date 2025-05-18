import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubToken } from 'src/model';
import { GithubTokenService } from 'src/service';

@Module({
  imports: [TypeOrmModule.forFeature([GithubToken])],
  exports: [GithubTokenService],
  providers: [GithubTokenService],
})
export class GithubTokenModule {}
