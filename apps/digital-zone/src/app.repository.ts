import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppRepository {
	constructor(private prisma: PrismaService) { }

	async findAllProducts() {
		return this.prisma.product.findMany();
	}

	async findProductById(id: number) {
		return this.prisma.product.findUnique({
			where: { id },
		});
	}

	async findProductsByIds(ids: number[]) {
		return this.prisma.product.findMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
	}

	async createProduct(data: any) {
		return this.prisma.product.create({
			data,
		});
	}

	async updateProduct(id: number, data: any) {
		return this.prisma.product.update({
			where: { id },
			data,
		});
	}

	async deleteProduct(id: number) {
		return this.prisma.product.delete({
			where: { id },
		});
	}
}
