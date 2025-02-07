import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { Logger } from '@nestjs/common';

const prisma = new PrismaClient();
const logger = new Logger('DatabaseMigrations');

export async function runMigrations() {
  try {
    logger.log('Running database migrations...');
    execSync('npx prisma migrate deploy --schema=./apps/digital-zone/prisma/schema.prisma', { stdio: 'inherit' });
    logger.log('Migrations completed successfully');
  } catch (error) {
    logger.error('Error running migrations:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
