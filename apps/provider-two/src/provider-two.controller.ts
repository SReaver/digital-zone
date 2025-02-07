import { Controller, Get } from '@nestjs/common';
import { ProviderTwoService } from './provider-two.service';

@Controller()
export class ProviderTwoController {
  constructor(private readonly providerTwoService: ProviderTwoService) {}

  @Get()
  getHello(): string {
    return this.providerTwoService.getHello();
  }
}
