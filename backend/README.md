# Backend

NestJS + Prisma + PostgreSQL. CRUD + pagination + search for superheroes with image URL list.

## Setup
```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run start:dev
```
Service: http://localhost:3000

`backend/.env` must provide `DATABASE_URL`.

## API
POST /heroes
GET /heroes?page=1&pageSize=5&q=term
GET /heroes/:id
PATCH /heroes/:id
DELETE /heroes/:id

Images replaced when images array provided; send [] to clear.

## Tests
```bash
npm test
npm run test:e2e
```

## License
UNLICENSED

