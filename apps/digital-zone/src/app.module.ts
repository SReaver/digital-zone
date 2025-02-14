import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { AppRepository } from './app.repository';
import { PrismaService } from './database/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot(), HttpModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppRepository],
})
export class AppModule { }
