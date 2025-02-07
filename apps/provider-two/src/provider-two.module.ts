import { Module } from '@nestjs/common';
import { ProviderTwoController } from './provider-two.controller';
import { ProviderTwoService } from './provider-two.service';

@Module({
  imports: [],
  controllers: [ProviderTwoController],
  providers: [ProviderTwoService],
})
export class ProviderTwoModule {}
