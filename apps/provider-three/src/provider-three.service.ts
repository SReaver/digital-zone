import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderThreeService {
  getHello(): string {
    return 'Hello World!';
  }
}
