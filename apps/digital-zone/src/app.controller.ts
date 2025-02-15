import { Controller, Get, Param, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Sse, MessageEvent } from '@nestjs/common';
import { Observable, from, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetProductsQueryDto } from './dto/get-products.dto';
import { GetProductChangesDto } from './dto/get-product-changes.dto';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ProductUpdatesService } from './events/product-updates.service';

@ApiTags('Products')
@Controller()
@UseGuards(ApiKeyGuard)
@ApiHeader({ name: 'x-api-key', required: true, description: 'API key for authentication' })
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly productUpdatesService: ProductUpdatesService,
  ) { }

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('products')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProducts(@Query() query: GetProductsQueryDto) {
    return this.appService.getProducts(query);
  }

  @Get('products/changes')
  @ApiOperation({
    summary: 'Get product changes between dates',
    description: 'Retrieve all product changes that occurred between the specified date range'
  })
  @ApiResponse({
    status: 200,
    description: 'List of product changes within the date range'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date format'
  })
  async getProductsChanges(@Query() query: GetProductChangesDto) {
    return this.appService.getProductsChanges(query.startDate, query.endDate);
  }

  @Sse('products/stream')
  @ApiOperation({
    summary: 'Get products stream',
    description: 'Stream products updates using Server-Sent Events'
  })
  @ApiResponse({
    status: 200,
    description: 'Stream of product updates'
  })
  async getProductsStream(): Promise<Observable<MessageEvent>> {
    const initialProducts = await this.appService.findAllProducts();

    const initial = from([initialProducts]).pipe(
      map((products): MessageEvent => ({
        data: products,
        type: 'products',
        id: 'initial',
      }))
    );

    const updates = this.productUpdatesService.getProductUpdates().pipe(
      map((products): MessageEvent => ({
        data: products,
        type: 'products',
        id: new Date().getTime().toString(),
      }))
    );

    return merge(initial, updates);
  }

  @Get('products/:id')
  @ApiParam({ name: 'id', type: 'number', description: 'Product ID' })
  async getProductById(@Param('id', new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number) {
    return this.appService.getProductById(id);
  }
}
