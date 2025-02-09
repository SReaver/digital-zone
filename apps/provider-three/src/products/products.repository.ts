import { ExtendedProduct } from "@app/shared";
import { PrismaService } from "../database/prisma.service";
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getProducts(): Promise<ExtendedProduct[]> {
        return await this.prisma.product.findMany();
    }

    async updateProduct(id: number, product) {
        return await this.prisma.product.update({
            where: { id },
            data: product,
        });
    }

    async updateManyProducts(products: { id: number, data: Omit<ExtendedProduct, 'id'> }[]): Promise<ExtendedProduct[]> {
        const updatePromises = products.map(product =>
            this.prisma.product.update({
                where: { id: product.id },
                data: product.data,
            })
        );
        return await Promise.all(updatePromises);
    }
}