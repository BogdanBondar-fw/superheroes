/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { HeroesService } from './heroes.service';
import { PrismaService } from '../prisma/prisma.service';

interface ImageRecord {
  id: string;
  heroId: string;
  url: string;
}
interface HeroRecord {
  id: string;
  nickname: string;
  realName?: string | null;
  originDescription?: string | null;
  superpowers?: string | null;
  catchPhrase?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function createPrismaMock() {
  const heroes: HeroRecord[] = [];
  const imageRows: ImageRecord[] = [];
  const heroWithImages = (h: HeroRecord) => ({
    ...h,
    images: imageRows.filter((img) => img.heroId === h.id),
  });
  const mock: any = {
    client: {
      superhero: {
        create: ({ data, include }: any) => {
          const hero: HeroRecord = {
            id: String(heroes.length + 1),
            nickname: data.nickname,
            realName: data.realName,
            originDescription: data.originDescription,
            superpowers: data.superpowers,
            catchPhrase: data.catchPhrase,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          heroes.push(hero);
          if (data.images?.create) {
            for (const { url } of data.images.create) {
              imageRows.push({ id: String(imageRows.length + 1), heroId: hero.id, url });
            }
          }
          return Promise.resolve(include?.images ? heroWithImages(hero) : hero);
  },
  count: ({ where }: { where?: { nickname: { contains: string } } }) => {
          if (!where) return Promise.resolve(heroes.length);
          const c = heroes.filter((h) =>
            h.nickname.toLowerCase().includes(where.nickname.contains.toLowerCase())
          ).length;
          return Promise.resolve(c);
        },
        findMany: ({
          where,
          skip,
          take,
          orderBy,
          include,
        }: {
          where?: { nickname: { contains: string } };
          skip: number;
          take: number;
          orderBy?: { createdAt: 'desc' | 'asc' };
          include?: { images?: boolean };
        }) => {
          let list = [...heroes];
          if (where)
            list = list.filter((h) =>
              h.nickname.toLowerCase().includes(where.nickname.contains.toLowerCase())
            );
          if (orderBy?.createdAt === 'desc')
            list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          const slice = list
            .slice(skip, skip + take)
            .map((h) => (include?.images ? heroWithImages(h) : h));
          return Promise.resolve(slice);
        },
        findUnique: ({
          where,
          include,
          select,
        }: {
          where: { id: string };
          include?: { images?: boolean };
          select?: { id?: boolean };
        }) => {
          const hero = heroes.find((h) => h.id === where.id);
          if (!hero) return Promise.resolve(null);
          if (select?.id) return Promise.resolve({ id: hero.id });
          return Promise.resolve(include?.images ? heroWithImages(hero) : hero);
        },
        update: ({
          where,
          data,
          include,
        }: {
          where: { id: string };
          data: Record<string, unknown> & { images?: { create: { url: string }[] } };
          include?: { images?: boolean };
        }) => {
          const hero = heroes.find((h) => h.id === where.id);
          if (!hero) throw new Error('Not found');
          Object.assign(hero, {
            nickname: data.nickname ?? hero.nickname,
            realName: data.realName ?? hero.realName,
            originDescription: data.originDescription ?? hero.originDescription,
            superpowers: data.superpowers ?? hero.superpowers,
            catchPhrase: data.catchPhrase ?? hero.catchPhrase,
            updatedAt: new Date(),
          });
          if (data.images?.create) {
            for (const { url } of data.images.create) {
              imageRows.push({ id: String(imageRows.length + 1), heroId: hero.id, url });
            }
          }
          return Promise.resolve(include?.images ? heroWithImages(hero) : hero);
  },
  delete: ({ where }: { where: { id: string } }) => {
          const idx = heroes.findIndex((h) => h.id === where.id);
          if (idx === -1) throw new Error('Not found');
          const removed = heroes.splice(idx, 1)[0];
          for (let i = imageRows.length - 1; i >= 0; i--)
            if (imageRows[i].heroId === removed.id) imageRows.splice(i, 1);
          return Promise.resolve(removed);
        },
      },
      image: {
        deleteMany: ({ where }: any) => {
          for (let i = imageRows.length - 1; i >= 0; i--)
            if (imageRows[i].heroId === where.heroId) imageRows.splice(i, 1);
          return Promise.resolve({ count: 0 });
        },
      },
      $transaction: (arg: any) => {
        if (Array.isArray(arg)) return Promise.all(arg);
        if (typeof arg === 'function') {
          return arg({ superhero: mock.client.superhero, image: mock.client.image });
        }
        return Promise.resolve(arg);
      },
    },
  };
  return mock;
}

describe('HeroesService', () => {
  let service: HeroesService;
  let prismaMock: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prismaMock = createPrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeroesService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    service = module.get(HeroesService);
  });

  it('creates a hero with images (filters empty)', async () => {
    const hero = await service.create({ nickname: 'Batman', images: ['http://x/a.png', ''] });
    expect(hero.nickname).toBe('Batman');
    expect(hero.images.length).toBe(1);
  });

  it('lists heroes with pagination of 5', async () => {
    for (let i = 0; i < 7; i++) await service.create({ nickname: 'Hero' + i });
    const page1 = await service.findAll(1, 5);
    const page2 = await service.findAll(2, 5);
    expect(page1.data).toHaveLength(5);
    expect(page2.data).toHaveLength(2);
    expect(page1.total).toBe(7);
  });

  it('filters by searchQuery substring (case-insensitive)', async () => {
    await service.create({ nickname: 'Alpha' });
    await service.create({ nickname: 'Beta' });
    const filtered = await service.findAll(1, 5, 'alp');
    expect(filtered.data).toHaveLength(1);
    expect(filtered.data[0].nickname).toBe('Alpha');
  });

  it('updates hero replacing images when images field present', async () => {
    const created = await service.create({ nickname: 'Flash', images: ['http://img/1.png'] });
    const updated = await service.update(created.id, {
      images: ['http://img/2.png', 'http://img/3.png'],
    });
    expect(updated.images).toHaveLength(2);
    expect(updated.images[0].url).toContain('2.png');
  });

  it('deletes hero', async () => {
    const created = await service.create({ nickname: 'Temp' });
    await service.remove(created.id);
    const list = await service.findAll(1, 5);
    expect(list.total).toBe(0);
  });
});
