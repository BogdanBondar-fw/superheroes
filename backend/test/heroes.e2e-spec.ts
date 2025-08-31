/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';

const conditionalDescribe = process.env.DATABASE_URL ? describe : describe.skip;

conditionalDescribe('Heroes CRUD (e2e)', () => {
  let app: INestApplication;
  let server: any;
  const prisma = new PrismaClient();

  async function resetDb() {
    await prisma.image.deleteMany();
    await prisma.superhero.deleteMany();
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  async function createHero(payload: any) {
    const res = await request(server).post('/heroes').send(payload).expect(201);
    return res.body;
  }

  it('creates and retrieves a hero', async () => {
    const created = await createHero({ nickname: 'Batman', images: ['http://img/a.png'] });
    const got = await request(server).get(`/heroes/${created.id}`).expect(200);
    expect(got.body.nickname).toBe('Batman');
    expect(got.body.images.length).toBe(1);
  });

  it('paginates heroes pageSize 5', async () => {
    for (let i = 0; i < 6; i++) await createHero({ nickname: 'Hero' + i });
    const page1 = await request(server).get('/heroes?page=1&pageSize=5').expect(200);
    const page2 = await request(server).get('/heroes?page=2&pageSize=5').expect(200);
    expect(page1.body.data.length).toBe(5);
    expect(page2.body.data.length).toBe(1);
    expect(page1.body.total).toBe(6);
  });

  it('searches by substring case insensitive', async () => {
    await createHero({ nickname: 'AlphaX' });
    await createHero({ nickname: 'BetaY' });
    const res = await request(server).get('/heroes?q=alph').expect(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].nickname).toBe('AlphaX');
  });

  it('updates hero preserving images when images not provided', async () => {
    const created = await createHero({ nickname: 'Flash', images: ['http://img/1.png'] });
    const updated = await request(server)
      .patch(`/heroes/${created.id}`)
      .send({ nickname: 'Flash2' })
      .expect(200);
    expect(updated.body.nickname).toBe('Flash2');
    expect(updated.body.images.length).toBe(1);
  });

  it('replaces images when images array provided', async () => {
    const created = await createHero({ nickname: 'IronMan', images: ['http://img/old.png'] });
    const updated = await request(server)
      .patch(`/heroes/${created.id}`)
      .send({ images: ['http://img/new1.png', 'http://img/new2.png'] })
      .expect(200);
    expect(updated.body.images.length).toBe(2);
    expect(updated.body.images[0].url).toContain('new');
  });

  it('clears images when empty images array provided', async () => {
    const created = await createHero({ nickname: 'Thor', images: ['http://img/a.png'] });
    const updated = await request(server)
      .patch(`/heroes/${created.id}`)
      .send({ images: [] })
      .expect(200);
    expect(updated.body.images.length).toBe(0);
  });

  it('deletes hero', async () => {
    const created = await createHero({ nickname: 'Temp' });
    await request(server).delete(`/heroes/${created.id}`).expect(200);
    await request(server).get(`/heroes/${created.id}`).expect(404);
  });
});
