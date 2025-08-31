import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateHeroDto } from './dto/create-hero.dto';
import type { UpdateHeroDto } from './dto/update-hero.dto';

@Injectable()
export class HeroesService {
  constructor(private readonly prisma: PrismaService) {}

  async testConnection() {
    try {
      // Простой тест подключения к базе
      const result = await this.prisma.client.$executeRaw`SELECT 1 as test`;
      const heroCount = await this.prisma.client.superhero.count();
      return {
        database: 'connected',
        testQuery: result,
        heroCount: heroCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[HeroesService] Database test failed:', error);
      throw error;
    }
  }

  async create(dto: CreateHeroDto) {
    try {
      console.log('[HeroesService] create called with:', JSON.stringify(dto, null, 2));

      // Check if Prisma client is available
      if (!this.prisma.client) {
        console.error('[HeroesService] Prisma client is not available');
        throw new Error('Database connection not available');
      }

      const imagesToCreate = (dto.images || [])
        .map((imageUrl) => (imageUrl || '').trim())
        .filter((imageUrl) => imageUrl.length > 0)
        .map((url) => ({ url })); // Prisma syntax for nested create

      console.log('[HeroesService] Creating hero with images:', imagesToCreate.length);

      const result = await this.prisma.client.superhero.create({
        data: {
          nickname: dto.nickname,
          realName: dto.realName,
          originDescription: dto.originDescription,
          superpowers: dto.superpowers,
          catchPhrase: dto.catchPhrase,
          images: {
            create: imagesToCreate,
          },
        },
        include: {
          images: true, // Include the created images in the response
        },
      });

      console.log('[HeroesService] hero created successfully with images:', result.id);
      return result;
    } catch (error) {
      console.error('[HeroesService] create error:', error);
      console.error('[HeroesService] error name:', error instanceof Error ? error.name : 'Unknown');
      console.error(
        '[HeroesService] error message:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      console.error(
        '[HeroesService] error stack:',
        error instanceof Error ? error.stack : 'No stack trace'
      );

      // Re-throw the error so the controller can handle it
      throw error;
    }
  }

  async findAll(page = 1, pageSize = 5, searchQuery?: string) {
    const skip = (page - 1) * pageSize;
    const where = searchQuery
      ? {
          nickname: { contains: searchQuery, mode: 'insensitive' as const },
        }
      : undefined;
    const [total, data] = await this.prisma.client.$transaction([
      this.prisma.client.superhero.count({ where }),
      this.prisma.client.superhero.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { images: true },
      }),
    ]);
    return {
      data,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const hero = await this.prisma.client.superhero.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!hero) throw new NotFoundException('Hero not found');
    return hero;
  }

  async update(id: string, dto: UpdateHeroDto) {
    await this.ensureExists(id);
    return this.prisma.client.$transaction(async (transaction) => {
      const hasImagesField = 'images' in dto;
      const images = (dto.images || [])
        .map((imageUrl) => (imageUrl || '').trim())
        .filter((imageUrl) => imageUrl.length > 0);
      if (hasImagesField) {
        await transaction.image.deleteMany({ where: { heroId: id } });
      }
      if (process.env.NODE_ENV !== 'test') {
        console.log(
          '[HeroesService] update images field present:',
          hasImagesField,
          'count:',
          images.length
        );
      }
      const updated = await transaction.superhero.update({
        where: { id },
        data: {
          nickname: dto.nickname,
          realName: dto.realName,
          originDescription: dto.originDescription,
          superpowers: dto.superpowers,
          catchPhrase: dto.catchPhrase,
          images:
            hasImagesField && images.length
              ? { create: images.map((url) => ({ url })) }
              : undefined,
        },
        include: { images: true },
      });
      return updated;
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.client.superhero.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.client.superhero.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Hero not found');
  }
}
