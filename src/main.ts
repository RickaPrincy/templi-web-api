import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

import { AppModule } from './app.module';

config();

const isDev = process.env.NODE_ENV !== 'production';

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
    .addTag('Resources')
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

  app.enableCors({
    origin: isDev
      ? ['https://templi.vercel.app', 'http://localhost:5173']
      : ['https://templi.vercel.app'],
    credentials: true,
  });
  await app.listen(+(process.env.PORT || 3000));
}

bootstrap();
