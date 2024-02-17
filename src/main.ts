import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  //adding cors
  app.enableCors();

  //helmet for security
  app.use(helmet());

  // global pipe validator
  app.useGlobalPipes(
    new ValidationPipe({
      //nested key parse
      transform: true,
      //stripe dto keys
      whitelist: true,
      // give error
      forbidNonWhitelisted: true,
      //
      validationError: { target: false },
      // exceptionFactory: (errors) => {
      //   return new BadRequestException(errors, 'Invalid request');
      // },
    }),
  );
  app.useLogger(new Logger());

  await app.listen(3000);
}
bootstrap();
