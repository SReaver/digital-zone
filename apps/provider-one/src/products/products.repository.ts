import { GeneralProduct } from "@app/shared";
import { PrismaService } from "../database/prisma.service";
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepository {
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
}