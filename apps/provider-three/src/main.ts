import { NestFactory } from '@nestjs/core';
import { runMigrations } from './database/migration.helper';
import { ProductsModule } from './products/products.module';

async function bootstrap() {
  await runMigrations();
  const app = await NestFactory.create(ProductsModule);
  await app.listen(3003);
}
bootstrap();
