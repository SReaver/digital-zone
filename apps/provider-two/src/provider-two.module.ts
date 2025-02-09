import { Module } from '@nestjs/common';
import { ProviderTwoController } from './provider-two.controller';
import { ProviderTwoService } from './provider-two.service';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [],
  controllers: [ProviderTwoController],
  providers: [ProviderTwoService, PrismaService],
})
export class ProviderTwoModule { }
