import { NestFactory } from '@nestjs/core';
import { ProviderThreeModule } from './provider-three.module';
import { runMigrations } from './database/migration.helper';

async function bootstrap() {
  await runMigrations();
  const app = await NestFactory.create(ProviderThreeModule);
  await app.listen(3003);
}
bootstrap();
