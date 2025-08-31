# Superheroes Backend API

NestJS 11 + Prisma + PostgreSQL service providing CRUD for superheroes with images, pagination and search.

## Project setup

```bash
$ npm install
```

## Run

```bash
npm run start:dev
```

Service listens on http://localhost:3000

## Tests

```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Neon / Prisma configuration

1. In Neon UI open "Connect" → select `Prisma`, keep Connection pooling ON. Copy the pooled `postgresql://...` string (it must include `sslmode=require`).
2. Edit `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@YOUR_NEON_HOST/neondb?sslmode=require"
# Optional if you ever need an unpooled connection (rare with modern Prisma):
# DIRECT_URL="postgresql://user:password@YOUR_NEON_HOST/neondb?sslmode=require"
```
3. Install deps & generate client:
```bash
npm install
npm run prisma:generate
```
4. Apply schema (first time use db push OR create a migration):
```bash
# Fast sync (dev only):
npm run prisma:push
# OR create a named migration (recommended):
npm run prisma:migrate
# For deployment environments:
npm run prisma:deploy
```
5. Start backend:
```bash
npm run start:dev
```
You should see `[Prisma] Connected to database`. If you get `P1001`, check credentials / project awake. For TLS errors ensure `sslmode=require` is present.


## API

Base URL: http://localhost:3000

### Create hero
POST /heroes
Body JSON fields: nickname (required), realName, originDescription, superpowers, catchPhrase, images (string[])

### List heroes
GET /heroes?page=1&pageSize=5&q=searchTerm
Returns paginated { data, page, pageSize, total, totalPages }

### Get hero
GET /heroes/:id

### Update hero
PATCH /heroes/:id
Provide any subset of fields. To replace images include images array. To clear images send images: []

### Delete hero
DELETE /heroes/:id

### Example
```bash
curl -X POST http://localhost:3000/heroes -H "Content-Type: application/json" -d '{"nickname":"Batman","images":["http://x/a.png"]}'
```

## Conventions

Database columns use snake_case via Prisma @map. API uses camelCase. Frontend maps to snake_case UI fields when needed.

## License
UNLICENSED

