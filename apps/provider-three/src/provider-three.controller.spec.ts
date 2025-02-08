import { Test, TestingModule } from '@nestjs/testing';
import { ProviderThreeController } from './provider-three.controller';
import { ProviderThreeService } from './provider-three.service';

describe('ProviderThreeController', () => {
  let providerThreeController: ProviderThreeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProviderThreeController],
      providers: [ProviderThreeService],
    }).compile();

    providerThreeController = app.get<ProviderThreeController>(ProviderThreeController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(providerThreeController.getHello()).toBe('Hello World!');
    });
  });
});
