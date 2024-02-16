import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //adding cors
  app.enableCors();

  //helmet for security
  app.use(helmet());

  // global pipe validator
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(new Logger());

  await app.listen(3000);
}
bootstrap();
