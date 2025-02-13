import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { runMigrations } from './database/migration.helper';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  await runMigrations();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Product Price Aggregator')
    .setDescription('Product Price Aggregator API description')
    .setVersion('1.0')
    .addTag('Products')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
