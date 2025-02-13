import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { AppRepository } from './app.repository';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppRepository],
})
export class AppModule { }
