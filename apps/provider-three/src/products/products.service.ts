import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { IExtendedProduct } from '@app/shared';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) { }

  findAll(): Promise<IExtendedProduct[]> {
    return this.productRepository.getProducts();
  }

  updateMany(products: ProductDto[]): Promise<IExtendedProduct[]> {
    if (!products || !products.length) throw new BadRequestException('No products to update');

    const updatedProducts = products.map(product => {
      const { id, ...rest } = product;
      return {
        id,
        data: {
          ...rest,
          lastUpdated: new Date(),
        }
      }
    });

    return this.productRepository.updateManyProducts(updatedProducts);
  }
}
