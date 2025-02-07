import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderOneService {
  getHello(): string {
    return 'Hello World!';
  }
}
