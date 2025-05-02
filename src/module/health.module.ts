import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dummy } from 'src/model';
import { HealthController } from 'src/rest/controller';
import { HealthService } from 'src/service';

@Module({
  providers: [HealthService],
  controllers: [HealthController],
  imports: [TypeOrmModule.forFeature([Dummy])],
})
export class HealthModule {}
