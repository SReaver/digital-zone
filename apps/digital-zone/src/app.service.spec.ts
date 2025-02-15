import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AppService } from './app.service';
import { AppRepository } from './app.repository';
import { ProvidersEnum } from '@app/shared/interfaces/providers.enum';
import { IPersistedProduct } from './factories/product-class.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductUpdatesService } from './events/product-updates.service';

describe('AppService', () => {
	let service: AppService;
	let httpService: HttpService;
	let appRepository: AppRepository;

	const mockHttpService = {
		get: jest.fn()
	};

	const mockAppRepository = {
		findProductByIdAndProvider: jest.fn(),
		addPriceHistory: jest.fn(),
		upsertProduct: jest.fn(),
		findProducts: jest.fn(),
		findProductById: jest.fn(),
		findPriceHistoryByProductId: jest.fn(),
		findProductsWithChanges: jest.fn(),
		findStaleProducts: jest.fn(),
		markStaleProducts: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [ConfigModule.forRoot()], // Add ConfigModule to imports
			providers: [
				AppService,
				{ provide: HttpService, useValue: mockHttpService },
				{ provide: AppRepository, useValue: mockAppRepository },
				ConfigService,
				ProductUpdatesService, 
			],
		}).compile();

		service = module.get<AppService>(AppService);
		service.setTestingMode(true);
		httpService = module.get<HttpService>(HttpService);
		appRepository = module.get<AppRepository>(AppRepository);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('fetchData', () => {
		const mockProviders = [
			{ name: ProvidersEnum.providerOne, url: 'http://provider-one:3001/products' }
		];

		it('should throw BadRequestException when no providers are provided', async () => {
			await expect(service.fetchData([])).rejects.toThrow(BadRequestException);
		});

		it('should throw BadRequestException for invalid URLs', async () => {
			await expect(service.fetchData([
				{ name: ProvidersEnum.providerOne, url: 'invalid-url' }
			])).rejects.toThrow(BadRequestException);
		});

		it('should fetch and transform data successfully', async () => {
			const mockResponse = { data: [{ id: 1, name: 'Product 1' }] };
			mockHttpService.get.mockReturnValue(of({ data: mockResponse.data }));

			const result = await service.fetchData(mockProviders);

			expect(result).toEqual([
				{ id: 1, name: 'Product 1', provider: ProvidersEnum.providerOne }
			]);
		});

		it('should handle HTTP errors gracefully', async () => {
			mockHttpService.get.mockReturnValue(throwError(() => new Error('Network error')));

			const result = await service.fetchData(mockProviders);

			expect(result).toEqual([]);
		});
	});

	describe('compareAndUpdateProduct', () => {
		const mockProduct: IPersistedProduct = {
			id: 1,
			name: 'Test Product',
			price: 100,
			currency: 'USD',
			availability: true,
			provider: ProvidersEnum.providerOne,
			lastUpdated: new Date()
		};

		it('should create new product if it does not exist', async () => {
			mockAppRepository.findProductByIdAndProvider.mockResolvedValue(null);

			await service.compareAndUpdateProduct(mockProduct);

			expect(mockAppRepository.upsertProduct).toHaveBeenCalledWith(
				expect.objectContaining({
					...mockProduct,
					productId: mockProduct.id,
					lastUpdated: expect.any(Date)
				})
			);
		});

		it('should update product and create price history if price changed', async () => {
			const existingProduct: IPersistedProduct = {
				...mockProduct,
				price: 90
			};
			mockAppRepository.findProductByIdAndProvider.mockResolvedValue(existingProduct);

			await service.compareAndUpdateProduct(mockProduct);

			expect(mockAppRepository.addPriceHistory).toHaveBeenCalled();
			expect(mockAppRepository.upsertProduct).toHaveBeenCalled();
		});
	});

	describe('getProductById', () => {
		it('should throw BadRequestException if product not found', async () => {
			mockAppRepository.findProductById.mockResolvedValue(null);

			await expect(service.getProductById(1)).rejects.toThrow(BadRequestException);
		});

		it('should return product with price history', async () => {
			const mockProduct = { id: 1, name: 'Product 1' };
			const mockPriceHistory = [{ id: 1, price: 100 }];

			mockAppRepository.findProductById.mockResolvedValue(mockProduct);
			mockAppRepository.findPriceHistoryByProductId.mockResolvedValue(mockPriceHistory);

			const result = await service.getProductById(1);

			expect(result).toEqual({
				...mockProduct,
				priceHistory: mockPriceHistory
			});
		});
	});

	describe('getStaleProducts', () => {
		it('should find stale products using correct threshold', async () => {
			const mockStaleProducts = [{ id: 1 }];
			mockAppRepository.findStaleProducts.mockResolvedValue(mockStaleProducts);

			const result = await service.getStaleProducts();

			expect(mockAppRepository.findStaleProducts).toHaveBeenCalledWith(
				expect.any(Date)
			);
			expect(result).toEqual(mockStaleProducts);
		});
	});
});
