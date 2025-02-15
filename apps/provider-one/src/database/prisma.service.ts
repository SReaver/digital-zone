import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        let retries = 5;
        while (retries > 0) {
            try {
                await this.$connect();
                console.log('✅ Database connected successfully');
                return;
            } catch (error) {
                console.error(`❌ Database connection failed. Retrying in 5s... (${retries} retries left)`);
                retries--;
                await new Promise(res => setTimeout(res, 5000));
            }
        }
        throw new Error('Database connection failed after multiple retries.');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
