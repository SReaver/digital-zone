import { Controller, Get } from '@nestjs/common';
import { ProviderThreeService } from './provider-three.service';

@Controller()
export class ProviderThreeController {
  constructor(private readonly providerThreeService: ProviderThreeService) {}

  @Get()
  getHello(): string {
    return this.providerThreeService.getHello();
  }
}
