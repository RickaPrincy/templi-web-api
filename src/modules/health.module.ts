import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dummy } from 'src/models';
import { HealthController } from 'src/rest/endpoints';
import { HealthService } from 'src/services';

@Module({
  providers: [HealthService],
  controllers: [HealthController],
  imports: [TypeOrmModule.forFeature([Dummy])],
})
export class HealthModule {}
