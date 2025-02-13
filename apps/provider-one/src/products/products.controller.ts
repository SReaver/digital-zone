import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { IGeneralProduct } from '@app/shared';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @ApiResponse({ status: 200, description: 'Get all products', type: [ProductDto] })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll(): Promise<IGeneralProduct[]> {
    return this.productsService.findAll();
  }
}
