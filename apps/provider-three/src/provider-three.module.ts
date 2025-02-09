import { Module } from '@nestjs/common';
import { ProviderThreeController } from './provider-three.controller';
import { ProviderThreeService } from './provider-three.service';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [ProductsModule],
  controllers: [ProviderThreeController],
  providers: [ProviderThreeService, PrismaService],
})
export class ProviderThreeModule { }
