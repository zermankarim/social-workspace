import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('TODO-List fullstack')
    .setDescription(
      'This is a pet fullstack project using Next,Nest, PostgreSQL and Prisma',
    )
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, swaggerDocument);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
