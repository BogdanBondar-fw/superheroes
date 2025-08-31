import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client: PrismaClient;

  constructor() {
    console.log('[Prisma] Initializing PrismaService...');
    console.log(`[Prisma] DATABASE_URL is ${process.env.DATABASE_URL ? 'set' : 'not set'}`);

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set');
    }

    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set('connect_timeout', '30');
    url.searchParams.set('pool_timeout', '30');

    this.client = new PrismaClient({
      log: ['info', 'warn', 'error'],
      datasources: {
        db: {
          url: url.toString(),
        },
      },
    });
    console.log('[Prisma] PrismaClient created with extended timeouts');
  }

  async onModuleInit(): Promise<void> {
    console.log('[Prisma] Attempting to connect to database...');
    try {
      await this.client.$connect();
      console.log('[Prisma] ✅ Connected to database successfully');
    } catch (e) {
      console.error('[Prisma] ❌ Connection failed:', (e as Error).message);
      console.error('[Prisma] App will continue without database');
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}
