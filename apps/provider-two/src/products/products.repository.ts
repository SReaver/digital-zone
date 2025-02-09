import { GeneralProduct } from "@app/shared";
import { PrismaService } from "../database/prisma.service";
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class ProductRepository {
    private readonly logger = new Logger(ProductRepository.name);
    constructor(private readonly prisma: PrismaService) { }

    async getProducts(): Promise<GeneralProduct[]> {
        return await this.prisma.product.findMany();
    }

    async updateProduct(id: number, product) {
        return await this.prisma.product.update({
            where: { id },
            data: product,
        });
    }

    async updateManyProducts(products: { id: number, data: Partial<GeneralProduct> }[]) {
        const updatePromises = products.map(product =>
            this.prisma.product.update({
                where: { id: product.id },
                data: product.data,
            })
        );
        return await Promise.allSettled(updatePromises)
            .catch(err => {
                this.logger.error(err.message);
            });
    }
}