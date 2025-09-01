# Superheroes Management Application

A full-stack superhero catalog application with CRUD operations, image management, search, and pagination.

## Tech Stack

### Backend
- **NestJS 11** - Node.js framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Database (hosted on Neon)
- **TypeScript** - Type safety
- **Express middleware** - JSON parsing and CORS

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **TanStack Query (React Query)** - Server state management
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Tailwind CSS** - Styling and animations
- **React Paginate** - Pagination component

### Deployment
- **Backend**: Render (auto-deploy from GitHub)
- **Frontend**: Netlify (auto-deploy from GitHub)
- **Database**: Neon PostgreSQL (serverless)

## Features

- ✅ Create, read, update, delete superheroes
- ✅ Multiple image URLs per hero with preview
- ✅ Search by nickname (substring matching)
- ✅ Pagination (5 heroes per page)
- ✅ Optimistic updates for better UX
- ✅ Responsive design with smooth animations
- ✅ Form validation with error messages
- ✅ Image error handling with fallbacks

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL database (Neon recommended)

### Backend Setup
```bash
cd backend
npm install
npm run prisma:generate
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Configuration
Create `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/heroes` | List heroes with pagination & search |
| GET | `/api/heroes/:id` | Get hero details |
| POST | `/api/heroes` | Create new hero |
| PATCH | `/api/heroes/:id` | Update hero |
| DELETE | `/api/heroes/:id` | Delete hero |

### Query Parameters
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 5)
- `q` - Search query (nickname substring)

## Data Model

```typescript
interface Superhero {
  id: string;
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string;
  catch_phrase: string;
  images: string[];
}
```

## Development

### Running Tests
```bash
cd backend
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Deployment URLs

- **Frontend**: https://superheroes-app.netlify.app
- **Backend**: https://superheroes-api.onrender.com
- **API Docs**: https://superheroes-api.onrender.com/api

## Assumptions & Design Decisions

1. **Image Storage**: Images are stored as URLs (not uploaded files) for simplicity
2. **Pagination**: Fixed page size of 5 for optimal mobile experience
3. **Search**: Case-insensitive substring matching on nickname only
4. **Validation**: Client-side validation with Zod, server-side with NestJS pipes
5. **State Management**: TanStack Query for server state, React state for UI
6. **Error Handling**: Graceful degradation with fallback images and error messages
7. **Performance**: Optimistic updates and image lazy loading
8. **Security**: CORS enabled, SQL injection prevention via Prisma
9. **Database**: UUID primary keys for better distribution
10. **Manual DTO Mapping**: Workaround for NestJS ValidationPipe issues with request parsing

## License

UNLICENSED

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
