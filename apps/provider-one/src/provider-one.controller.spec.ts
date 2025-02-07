import { Test, TestingModule } from '@nestjs/testing';
import { ProviderOneController } from './provider-one.controller';
import { ProviderOneService } from './provider-one.service';

describe('ProviderOneController', () => {
  let providerOneController: ProviderOneController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProviderOneController],
      providers: [ProviderOneService],
    }).compile();

    providerOneController = app.get<ProviderOneController>(ProviderOneController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(providerOneController.getHello()).toBe('Hello World!');
    });
  });
});
