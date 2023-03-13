import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fmp = require('fastify-multipart');

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.register(fmp);
  app.enableCors();
  const appPort = parseInt(process.env.PORT) || 3000;
  await app.listen(appPort, '0.0.0.0');
  Logger.log(
    '🚀 App is listening at: http://localhost:' + appPort
  );
}
bootstrap();
