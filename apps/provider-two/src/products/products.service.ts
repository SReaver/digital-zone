import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { IGeneralProduct } from '@app/shared';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) { }

  findAll(): Promise<IGeneralProduct[]> {
    return this.productRepository.getProducts();
  }

  update(id: number, updateProductDto: Omit<ProductDto, 'id'>) {
    return this.productRepository.updateProduct(id, updateProductDto);
  }

  updateMany(products: ProductDto[]) {
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
