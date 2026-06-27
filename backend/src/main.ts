import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from './infrastructure/config/services/config.service';
import { CorsCallback, CorsOrigin } from './shared/validation/types/cors.types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TODO-List fullstack')
    .setDescription(
      'This is a pet fullstack project using Next,Nest, PostgreSQL and Prisma',
    )
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, swaggerDocument);

  const appConfig = app.get(AppConfigService);

  const allowedOrigins = (appConfig.app.cors ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin: CorsOrigin, callback: CorsCallback): void => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalized = origin.trim();

      if (allowedOrigins.includes(normalized)) {
        callback(null, normalized);
        return;
      }

      callback(new Error('Not allowed by CORS'), false);
    },
    credentials: Boolean(appConfig.app.credentials),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
  app.use(cookieParser());

  await app.listen(appConfig.app.port ?? 3000);
}
void bootstrap();
