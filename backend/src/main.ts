import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from './infrastructure/config/services/config.service';
import { CorsCallback, CorsOrigin } from './shared/validation/types/cors.types';
import { AppExceptionFilter } from './infrastructure/transport/filters/app-exception.filter';
import { buildAllowedOrigins } from './shared/cors/allowed-origins';
import { SocketIoAdapter } from './conversations/gateway/socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TODO-List fullstack')
    .setDescription(
      'Pet fullstack project using Next.js, NestJS, PostgreSQL and Prisma. Authenticated endpoints require the `access_token` cookie set by POST /auth/signin.',
    )
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();

  const appConfig = app.get(AppConfigService);
  const apiPrefix = `${appConfig.api.prefix}/${appConfig.api.version}`;
  app.setGlobalPrefix(apiPrefix);

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, swaggerDocument);

  const port = appConfig.app.port ?? 3000;

  const allowedOrigins = buildAllowedOrigins(
    appConfig.app.cors,
    appConfig.app.nodeEnv,
    port,
  );

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

      callback(null, false);
    },
    credentials: Boolean(appConfig.app.credentials),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.useWebSocketAdapter(
    new SocketIoAdapter(
      app,
      allowedOrigins,
      Boolean(appConfig.app.credentials),
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
  app.useGlobalFilters(new AppExceptionFilter());
  app.use(cookieParser());

  await app.listen(port);
}
void bootstrap();
