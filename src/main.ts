import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

import { AppModule } from './app.module';

config();

function setupSwagger<T>(app: INestApplication<T>) {
  const openapiConfig = new DocumentBuilder()
    .setTitle('Templi')
    .setDescription(
      'Templi is a tool that simplifies boilerplate creation and usage, available as both a library and a CLI.',
    )
    .setVersion('0.0.1')
    .addServer('https://templi.vercel.app')
    .addTag('Health')
    .addTag('Security')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, openapiConfig);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose', 'fatal'],
  });

  setupSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableCors();

  await app.listen(+(process.env.PORT || 3000));
}

bootstrap();
