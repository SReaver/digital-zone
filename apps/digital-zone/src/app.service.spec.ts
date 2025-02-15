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

	const fixedDate = new Date('2023-01-01T00:00:00Z');
	const OriginalDate = Date;

	beforeAll(() => {
		global.Date = jest.fn(() => fixedDate) as unknown as DateConstructor;
		global.Date.now = OriginalDate.now;
	});

	afterAll(() => {
		global.Date = OriginalDate;
	});

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
		httpService = module.get<HttpService>(HttpService);
		appRepository = module.get<AppRepository>(AppRepository);
	});

	const mockProduct: IPersistedProduct = {
		id: 1,
		name: 'Test Product',
		price: 100,
		currency: 'USD',
		availability: true,
		provider: ProvidersEnum.providerOne,
		lastUpdated: fixedDate,
		productId: 1,
		isStale: false
	};

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
			const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
			mockHttpService.get.mockReturnValue(throwError(() => new Error('Network error')));

			const result = await service.fetchData(mockProviders);

			expect(result).toEqual([]);
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Error fetching data from http://provider-one:3001/products:',
				'Network error'
			);
			consoleErrorSpy.mockRestore();
		});
	});


	describe('compareAndUpdateProduct', () => {

		it('should create new product if it does not exist', async () => {
			mockAppRepository.findProductByIdAndProvider.mockResolvedValue(null);

			await service.compareAndUpdateProduct(mockProduct);

			expect(mockAppRepository.upsertProduct).toHaveBeenCalledWith(
				mockProduct
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
			const mockStaleProducts = [mockProduct];
			mockAppRepository.findStaleProducts.mockResolvedValue(mockStaleProducts);

			const result = await service.getStaleProducts();

			expect(mockAppRepository.findStaleProducts).toHaveBeenCalledWith(
				fixedDate
			);
			expect(result).toEqual(mockStaleProducts);
		});
	});

	describe('onModuleInit', () => {
		it('should set interval for data fetching', () => {
			const setIntervalSpy = jest.spyOn(global, 'setInterval');
			service.onModuleInit();
			expect(setIntervalSpy).toHaveBeenCalled();
		});
	});

	describe('onModuleDestroy', () => {
		it('should clear interval', () => {
			const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
			service.onModuleInit(); // Ensure the interval is set
			service.onModuleDestroy();
			expect(clearIntervalSpy).toHaveBeenCalled();
		});
	});

	describe('getDataFromProviders', () => {
		it('should fetch data from providers and emit updates', async () => {
			const mockGeneralProduct: IPersistedProduct = {
				id: 20,
				name: 'Test product',
				price: 34.99,
				currency: 'USD',
				availability: false,
				lastUpdated: fixedDate,
				provider: ProvidersEnum.providerOne,
				productId: 20,
				isStale: false
			};
			const fetchDataSpy = jest.spyOn(service, 'fetchData').mockResolvedValue([mockGeneralProduct]);
			const compareAndUpdateProductSpy = jest.spyOn(service, 'compareAndUpdateProduct').mockResolvedValue({} as any);
			const emitProductUpdatesSpy = jest.spyOn(service['productUpdatesService'], 'emitProductUpdates');

			await service.getDataFromProviders();

			expect(fetchDataSpy).toHaveBeenCalled();
			expect(compareAndUpdateProductSpy).toHaveBeenCalled();
			expect(emitProductUpdatesSpy).toHaveBeenCalled();
		});
	});

	describe('getProducts', () => {
		it('should get products with filters', async () => {
			const mockFilters = { name: 'Product 1' };
			await service.getProducts(mockFilters);
			expect(mockAppRepository.findProducts).toHaveBeenCalledWith(mockFilters);
		});
	});

	describe('findAllProducts', () => {
		it('should find all products', async () => {
			await service.getProducts({});
			expect(mockAppRepository.findProducts).toHaveBeenCalledWith({});
		});
	});

	describe('getProductsChanges', () => {
		it('should get product changes between dates', async () => {
			const startDate = new Date();
			const endDate = new Date();
			await service.getProductsChanges(startDate, endDate);
			expect(mockAppRepository.findProductsWithChanges).toHaveBeenCalledWith(startDate, endDate);
		});
	});

	describe('handleStaleProducts', () => {
		it('should handle stale products', async () => {
			await service.handleStaleProducts();
			expect(mockAppRepository.markStaleProducts).toHaveBeenCalled();
		});
	});
});
