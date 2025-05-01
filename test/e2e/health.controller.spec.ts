import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { HealthController } from 'src/rest/endpoints';

describe('HealthController', () => {
  let subject: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppModule],
    }).compile();

    subject = app.get<HealthController>(HealthController);
  });

  describe('root', () => {
    it('ping pong', () => {
      expect(subject.ping()).toBe('pong');
    });
  });
});
