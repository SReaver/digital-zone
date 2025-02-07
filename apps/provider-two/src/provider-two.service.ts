import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderTwoService {
  getHello(): string {
    return 'Hello World!';
  }
}
