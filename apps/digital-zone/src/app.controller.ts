import { Controller, Get, Param, Query, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { GetProductsQueryDto } from './dto/get-products.dto';
import { GetProductChangesDto } from './dto/get-product-changes.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

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

  @Get('products/:id')
  async getProductById(@Param('id', new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number) {
    return this.appService.getProductById(id);
  }
}
