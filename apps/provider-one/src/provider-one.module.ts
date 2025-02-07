import { Module } from '@nestjs/common';
import { ProviderOneController } from './provider-one.controller';
import { ProviderOneService } from './provider-one.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [ProviderOneController],
  providers: [ProviderOneService],
})
export class ProviderOneModule {}
