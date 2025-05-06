import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from 'src/model';
import { TemplateController } from 'src/rest/controller/template.controller';
import { TemplateMapper } from 'src/rest/mapper';
import { TemplateService } from 'src/service';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService, TemplateMapper],
  imports: [TypeOrmModule.forFeature([Template])],
})
export class TemplateModule {}
