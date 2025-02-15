import { Controller, Get, Query, UsePipes, ValidationPipe, UseGuards, Sse, MessageEvent, ParseIntPipe, Param, Header, Res } from '@nestjs/common';
import { from, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetProductsQueryDto } from './dto/get-products.dto';
import { GetProductChangesDto } from './dto/get-product-changes.dto';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ProductUpdatesService } from './events/product-updates.service';
import { randomUUID } from 'node:crypto';

@ApiTags('Products')
@Controller('products')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly productUpdatesService: ProductUpdatesService,
  ) { }

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiHeader({ name: 'x-api-key', required: true, description: 'API key for authentication' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProducts(@Query() query: GetProductsQueryDto) {
    return this.appService.getProducts(query);
  }

  @Get('changes')
  @UseGuards(ApiKeyGuard)
  @ApiHeader({ name: 'x-api-key', required: true, description: 'API key for authentication' })
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

  @Sse('events')
  getProductsStream() {
    const initial = from(this.appService.findAllProducts()).pipe(
      map((products) => ({
        id: randomUUID(),
        event: 'products',
        data: JSON.stringify(products)
      })),
    );

    const updates = this.productUpdatesService.getProductUpdates().pipe(
      map((products) => ({
        id: randomUUID(),
        event: 'products',
        data: JSON.stringify(products)
      })),
    );

    return merge(initial, updates);
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  @ApiHeader({ name: 'x-api-key', required: true, description: 'API key for authentication' })
  @ApiParam({ name: 'id', type: 'number', description: 'Product ID' })
  async getProductById(@Param('id', new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number) {
    return this.appService.getProductById(id);
  }
}
