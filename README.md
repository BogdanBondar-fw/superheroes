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

## Data Model
Superhero
- id (UUID)
- nickname (string, required)
- realName (string?)
- originDescription (string?)
- superpowers (string?)
- catchPhrase (string?)
- images: one‑to‑many Image (url:string)

Assumption: Images are stored as externally reachable URLs; no binary upload.

API uses camelCase in JSON responses. The test specification used snake_case; a mapper in frontend converts UI form snake_case to backend camelCase.

## API Endpoints
GET /heroes?page=1&pageSize=5&q=Batman  - list (pagination + optional search)
POST /heroes  - create { nickname, realName?, originDescription?, superpowers?, catchPhrase?, images?: string[] }
GET /heroes/:id  - detail (includes images[])
PATCH /heroes/:id  - partial update; if images field present old images are replaced
DELETE /heroes/:id  - remove

Health: GET / (basic hello) or add /health if extended.

## Running Backend
Prereqs: Node 18+, PostgreSQL (Neon). Create backend/.env:
```
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```
Install & migrate:
```
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate   # or prisma:push for dev
npm run start:dev
```
Backend on http://localhost:3000

## Running Frontend
```
cd frontend
npm install
npm run dev
```
App on http://localhost:5173 (proxy configure fetch base to backend origin if needed).

## Frontend Tech
- React + Vite + TypeScript
- React Query (@tanstack) for data + cache keys with page + search
- Controlled modal & page controller hook consolidating state
- Form with image URL uploader (auto flush of pending URL on submit)

## Testing
Current: Basic Nest sample e2e test. TODO (planned): unit tests for HeroesService (create/update pagination delete) and mapper tests.

## Assumptions & Decisions
- Pagination default fixed to 5 (spec requirement). Client can request different pageSize but UI uses 5.
- No authentication (not in scope).
- Image validation minimal (URL format + non-empty).
- Search only on nickname (simple ILIKE contains).
- No soft deletes.

## Next Improvements
- Add class-validator DTO validation layer
- Unit tests for business logic
- Seed script
- Rate limiting / logging middleware

## License
Internal test project.
