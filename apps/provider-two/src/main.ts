import { NestFactory } from '@nestjs/core';
import { ProviderTwoModule } from './provider-two.module';
import { runMigrations } from './database/migration.helper';

async function bootstrap() {
  await runMigrations();
  const app = await NestFactory.create(ProviderTwoModule);
  await app.listen(3002);
}
bootstrap();
