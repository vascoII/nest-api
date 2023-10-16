import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Activez la transformation via class-transformer
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
