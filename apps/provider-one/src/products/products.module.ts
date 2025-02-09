import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepository } from './products.repository';
import { PrismaService } from '../database/prisma.service';
import { ProductUpdaterService } from './product-updater.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [ProductsController],
  providers: [ProductsService, ProductRepository, PrismaService, ProductUpdaterService],
})
export class ProductsModule { }
