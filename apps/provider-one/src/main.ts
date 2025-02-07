import { NestFactory } from '@nestjs/core';
import { ProviderOneModule } from './provider-one.module';
import { runMigrations } from './database/migration.helper';

async function bootstrap() {
  await runMigrations();
  const app = await NestFactory.create(ProviderOneModule);
  await app.listen(3001);
}
bootstrap();
