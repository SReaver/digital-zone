import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { AppRepository } from './app.repository';
import { PrismaService } from './database/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ProductUpdatesService } from './events/product-updates.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'client'),
      renderPath: '/',
      exclude: ['/products'],
    }),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppRepository, ProductUpdatesService],
})
export class AppModule { }
