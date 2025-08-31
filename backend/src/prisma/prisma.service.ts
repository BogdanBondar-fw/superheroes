import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public readonly client: PrismaClient;

  constructor() {
    if (!process.env.DATABASE_URL) {
      console.error(
        '[Prisma] DATABASE_URL is not set. Update backend/.env with your Neon connection string.'
      );
      throw new Error('Missing DATABASE_URL');
    }
    this.client = new PrismaClient();
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.$connect();
      console.log('[Prisma] Connected to database');
    } catch (e) {
      console.error('[Prisma] Connection failed:', (e as Error).message);
      throw e;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}
