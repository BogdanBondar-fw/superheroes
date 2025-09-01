# Superheroes Backend API

NestJS + Prisma + PostgreSQL backend service with CRUD operations, pagination, and search functionality.

## Tech Stack

- **NestJS 11** - Node.js framework with TypeScript
- **Prisma ORM** - Database toolkit and query builder
- **PostgreSQL** - Relational database (Neon hosted)
- **Express** - HTTP server with JSON parsing middleware
- **TypeScript** - Type safety and modern JavaScript features

## Quick Start

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run start:dev
```

Server runs at: http://localhost:3000

## Environment Setup

Create `.env` file:
```env
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

## API Endpoints

### Heroes CRUD
- `POST /api/heroes` - Create hero
- `GET /api/heroes` - List heroes with pagination & search
- `GET /api/heroes/:id` - Get hero by ID
- `PATCH /api/heroes/:id` - Update hero
- `DELETE /api/heroes/:id` - Delete hero

### Query Parameters
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 5, max: 50)
- `q` - Search term (nickname substring, case-insensitive)

### Request/Response Format

**Create/Update Hero:**
```json
{
  "nickname": "Superman",
  "realName": "Clark Kent",
  "originDescription": "Last son of Krypton",
  "superpowers": "Flight, super strength, x-ray vision",
  "catchPhrase": "Up, up and away!",
  "images": ["https://example.com/superman.jpg"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "nickname": "Superman",
  "real_name": "Clark Kent",
  "origin_description": "Last son of Krypton",
  "superpowers": "Flight, super strength, x-ray vision",
  "catch_phrase": "Up, up and away!",
  "images": ["https://example.com/superman.jpg"]
}
```

## Database Schema

```sql
model Superhero {
  id                  String   @id @default(uuid())
  nickname            String
  real_name           String
  origin_description  String
  superpowers         String
  catch_phrase        String
  images              String[]
}
```

## Testing

```bash
npm test           # Unit tests
npm run test:e2e   # End-to-end tests
npm run test:cov   # Coverage report
```

## Production Build

```bash
npm run build
npm run start:prod
```

## Deployment

Deployed on Render with automatic GitHub integration.
Database hosted on Neon PostgreSQL.

## License
UNLICENSED

