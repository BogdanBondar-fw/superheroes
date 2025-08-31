import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client: PrismaClient;

  constructor() {
    console.log('[Prisma] Initializing PrismaService...');
    console.log(`[Prisma] DATABASE_URL is ${process.env.DATABASE_URL ? 'set' : 'not set'}`);

    if (!process.env.DATABASE_URL) {
      console.error(
        '[Prisma] DATABASE_URL is not set. Update backend/.env with your Neon connection string.'
      );
      throw new Error('Missing DATABASE_URL');
    }

    try {
      this.client = new PrismaClient();
      console.log('[Prisma] PrismaClient created successfully');
    } catch (error) {
      console.error('[Prisma] Error creating PrismaClient:', error);
      throw error;
    }
  }

  async onModuleInit(): Promise<void> {
    console.log('[Prisma] Attempting to connect to database...');
    try {
      await this.client.$connect();
      console.log('[Prisma] ✅ Connected to database successfully');
    } catch (e) {
      console.error('[Prisma] ❌ Connection failed:', (e as Error).message);
      console.error('[Prisma] Full error:', e);
      throw e;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}
