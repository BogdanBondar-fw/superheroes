# Superheroes Monorepo

Full stack application managing a catalog of superheroes with images.

Stack
- Backend: NestJS 11, Prisma, PostgreSQL (Neon) with CRUD, pagination (pageSize 5 default), search by nickname substring, image replacement or clearing via update.
- Frontend: React + Vite + React Query + React Hook Form + Zod with optimistic creation for first page, modal detail and edit, pagination and search UI.

Run
Backend
```bash
cd backend
npm install
npm run prisma:generate
npm run start:dev
```
Frontend
```bash
cd frontend
npm install
npm run dev
```
Backend at http://localhost:3000 Frontend at http://localhost:5173

Environment
Create backend/.env with DATABASE_URL for Neon (pooled) including sslmode=require.

API Summary
POST /heroes create
GET /heroes list with page pageSize q
GET /heroes/:id detail
PATCH /heroes/:id partial update (images array replaces existing, empty array clears, omit images keeps)
DELETE /heroes/:id delete

Tests
Unit and e2e in backend. Run inside backend folder: npm run test and npm run test:e2e

License UNLICENSED
# Superhero Database

Full‑stack test implementation: NestJS + Prisma (PostgreSQL) backend and React (Vite + React Query) frontend.

## Features
- Create, edit, delete superheroes
- Attach / replace image URL list (stored as related Image rows)
- List with pagination (5 per page) and search by nickname
- Detail modal with all fields & gallery
- Optimistic create on frontend
# Superheroes

Simple CRUD application for superheroes with image URL lists.

Backend: NestJS + Prisma + PostgreSQL. Frontend: React + Vite + React Query.

## Quick Start
Backend:
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run start:dev
```
Frontend:
```bash
cd frontend
npm install
npm run dev
```

## API
List: GET /heroes?page=1&pageSize=5&q=term
Create: POST /heroes
Detail: GET /heroes/:id
Update: PATCH /heroes/:id
Delete: DELETE /heroes/:id

Images are replaced when an images array is provided on update; send [] to clear.

## Env
`backend/.env` needs `DATABASE_URL` (PostgreSQL, sslmode=require if Neon).

## Assumptions
- Images are provided as externally hosted URLs (no file upload pipeline implemented).
- API internally uses camelCase (realName, originDescription, catchPhrase); frontend maps to snake_case fields required by the test spec (real_name, origin_description, catch_phrase) via a mapper.
- Pagination page size is fixed to 5 per spec; backend allows a pageSize param but UI uses 5.
- Updating with an empty images array clears images; omitting images leaves existing images unchanged.

## Tests
Run inside backend:
```bash
npm test
npm run test:e2e
```

## License
UNLICENSED
npm run dev
