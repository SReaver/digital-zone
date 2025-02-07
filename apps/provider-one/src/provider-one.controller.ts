import { Controller, Get } from '@nestjs/common';
import { ProviderOneService } from './provider-one.service';

@Controller()
export class ProviderOneController {
  constructor(private readonly providerOneService: ProviderOneService) {}

  @Get()
  getHello(): string {
    return this.providerOneService.getHello();
  }
}
