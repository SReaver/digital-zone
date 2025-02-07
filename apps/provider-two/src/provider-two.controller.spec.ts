import { Test, TestingModule } from '@nestjs/testing';
import { ProviderTwoController } from './provider-two.controller';
import { ProviderTwoService } from './provider-two.service';

describe('ProviderTwoController', () => {
  let providerTwoController: ProviderTwoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProviderTwoController],
      providers: [ProviderTwoService],
    }).compile();

    providerTwoController = app.get<ProviderTwoController>(ProviderTwoController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(providerTwoController.getHello()).toBe('Hello World!');
    });
  });
});
