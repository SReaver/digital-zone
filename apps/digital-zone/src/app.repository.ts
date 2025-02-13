import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { ProvidersEnum } from '@app/shared/interfaces/providers.enum';
import { IGeneralProduct } from '@app/shared';
import { IAddPriceHistory } from './dto/add-price-history.interface';

@Injectable()
export class AppRepository {
	constructor(private prisma: PrismaService) { }

	async findAllProducts() {
		return this.prisma.product.findMany();
	}

	async findProductById(productId: number) {
		return this.prisma.product.findFirst({
			where: { productId },
		});
	}

	async findProductsByIds(ids: number[]) {
		return this.prisma.product.findMany({
			where: {
				productId: {
					in: ids,
				},
			},
		});
	}

	async upsertProduct(data: any) {
		const { id, ...restData } = data;
		return this.prisma.product.upsert({
			where: {
				productId_provider: { productId: id, provider: data.provider }
			},
			update: restData,
			create: { ...restData, productId: id }
		});
	}

	async findProductByIdAndProvider(productId: number, provider: ProvidersEnum): Promise<IGeneralProduct | null> {
		return await this.prisma.product.findUnique({
			where: {
				productId_provider: { productId, provider },
			},
		});
	}

	async addPriceHistory(data: IAddPriceHistory) {
		return await this.prisma.priceHistory.create({
			data
		});
	}

	async findProducts(filters: any) {
		return this.prisma.product.findMany({
			where: {
				...(filters.name && { name: { contains: filters.name } }),
				...(filters.minPrice && { price: { gte: filters.minPrice } }),
				...(filters.maxPrice && { price: { lte: filters.maxPrice } }),
				...(filters.availability !== undefined && { availability: filters.availability }),
				...(filters.provider && { provider: filters.provider }),
			},
		});
	}

	async findPriceHistoryByProductId(id: number) {
		const product = await this.findProductById(id);
		if (!product) return [];

		return this.prisma.priceHistory.findMany({
			where: {
				productId: product.productId,
				provider: product.provider,
			},
			orderBy: { timestamp: 'desc' },
		});
	}

	async findProductsWithChanges(startDate: Date, endDate: Date) {
		// First, get all products
		const products = await this.prisma.product.findMany();

		// Then fetch price histories for these products within date range
		const productsWithHistory = await Promise.all(
			products.map(async (product) => {
				const priceHistory = await this.prisma.priceHistory.findMany({
					where: {
						productId: product.productId,
						provider: product.provider,
						timestamp: {
							gte: startDate,
							lte: endDate,
						},
					},
					orderBy: {
						timestamp: 'desc'
					}
				});

				return {
					...product,
					priceHistory
				};
			})
		);

		// Filter out products with no price history in the date range
		return productsWithHistory.filter(product => product.priceHistory.length > 0);
	}
}
