import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProvidersEnum } from '@app/shared/interfaces/providers.enum';
import { GetProductsQueryDto } from './dto/get-products.dto';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    getHello: jest.fn(),
    getProducts: jest.fn(),
    getProductById: jest.fn()
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService
        }
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHello', () => {
    it('should return hello message', () => {
      const result = 'Hello World!';
      mockAppService.getHello.mockReturnValue(result);

      expect(appController.getHello()).toBe(result);
      expect(mockAppService.getHello).toHaveBeenCalled();
    });
  });

  describe('getProducts', () => {
    it('should return products with filters', async () => {
      const mockProducts = [{ id: 1, name: 'Test Product' }];
      const mockFilters: GetProductsQueryDto = {
        provider: ProvidersEnum.providerOne
      };
      mockAppService.getProducts.mockResolvedValue(mockProducts);

      const result = await appController.getProducts(mockFilters);

      expect(result).toEqual(mockProducts);
      expect(mockAppService.getProducts).toHaveBeenCalledWith(mockFilters);
    });
  });

  describe('getProductById', () => {
    it('should return product by id', async () => {
      const mockProduct = { id: 1, name: 'Test Product' };
      mockAppService.getProductById.mockResolvedValue(mockProduct);

      const result = await appController.getProductById(1);

      expect(result).toEqual(mockProduct);
      expect(mockAppService.getProductById).toHaveBeenCalledWith(1);
    });

    it('should handle invalid id', async () => {
      mockAppService.getProductById.mockRejectedValue(new BadRequestException());

      await expect(appController.getProductById(999)).rejects.toThrow(BadRequestException);
    });
  });
});
