import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/model';
import { TagController } from 'src/rest/controller';
import { TagMapper } from 'src/rest/mapper';
import { TagService } from 'src/service';

@Module({
  providers: [TagMapper, TagService],
  imports: [TypeOrmModule.forFeature([Tag])],
  exports: [TagMapper],
  controllers: [TagController],
})
export class TagModule {}
