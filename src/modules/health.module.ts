import { Module } from '@nestjs/common';
import { HealthController } from 'src/rest/endpoints';

@Module({
  controllers: [HealthController],
  imports: [],
})
export class HealthModule { }
