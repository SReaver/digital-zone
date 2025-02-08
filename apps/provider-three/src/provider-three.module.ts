import { Module } from '@nestjs/common';
import { ProviderThreeController } from './provider-three.controller';
import { ProviderThreeService } from './provider-three.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [ProviderThreeController],
  providers: [ProviderThreeService],
})
export class ProviderThreeModule {}
