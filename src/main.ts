import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  app.use(helmet());
  // app.use(csurf());
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:3001',
      'http://localhost:3001/',
      'http://localhost:3000',
      'http://localhost:3000/',
      'https://app-flights-frontend2022.netlify.app/',
      'https://app-flights-frontend2022.netlify.app',
    ],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
