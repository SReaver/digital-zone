import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './products.repository';
import { GeneralProduct } from '@app/shared';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) { }

  findAll(): Promise<GeneralProduct[]> {
    return this.productRepository.getProducts();
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.updateProduct(id, updateProductDto);
  }
}
