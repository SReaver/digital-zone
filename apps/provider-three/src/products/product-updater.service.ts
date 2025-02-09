import { Injectable } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Interval } from '@nestjs/schedule';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductUpdaterService {
    constructor(private readonly productsService: ProductsService) { }

    @Interval(4000)
    async handleUpdate() {
        const products = await this.productsService.findAll();
        const updatedProducts = products.map<ProductDto>(product => ({
            ...product,
            price: this.getRandomPrice(),
            availability: this.getRandomAvailability(),
        })
        );
        await this.productsService.updateMany(updatedProducts);
    }

    private getRandomPrice(): number {
        return Math.floor(Math.random() * 10000) / 100;
    }

    private getRandomAvailability(): boolean {
        return Math.random() > 0.5;
    }
}
