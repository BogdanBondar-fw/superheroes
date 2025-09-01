# Superheroes Frontend

Modern React application with TypeScript, featuring superhero management with smooth animations and responsive design.

## Tech Stack

- **React 18** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety and IntelliSense
- **TanStack Query** - Server state management with caching
- **React Hook Form** - Performant form handling
- **Zod** - Runtime type validation
- **Tailwind CSS** - Utility-first styling with animations
- **React Paginate** - Pagination component

## Features

- ✅ Responsive superhero cards with hover animations
- ✅ Modal-based create/edit forms with validation
- ✅ Image gallery with URL upload and preview
- ✅ Real-time search with debouncing
- ✅ Optimistic updates for better UX
- ✅ Smooth page transitions and loading states
- ✅ Error handling with retry mechanisms
- ✅ Mobile-first responsive design

## Quick Start

```bash
npm install
npm run dev
```

Development server: http://localhost:5173
Backend API: http://localhost:3000

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # ESLint checking
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── HeroCard.tsx       # Hero display card
│   ├── HeroDetail.tsx     # Hero detail modal
│   ├── HeroEditForm.tsx   # Create/edit form
│   ├── ImgUploader.tsx    # Image URL manager
│   └── Modal.tsx          # Modal wrapper
├── hooks/          # Custom React hooks
│   ├── useHeroQueries.ts  # API query hooks
│   └── useHeroesPageController.ts # Page state management
├── pages/          # Page components
│   └── MainPage.tsx       # Main application page
├── types/          # TypeScript interfaces
├── api/            # API client functions
└── utils/          # Utility functions
```

## API Integration

Connects to NestJS backend with full CRUD operations:
- Fetches heroes with pagination and search
- Optimistic updates for create operations
- Real-time validation and error handling
- Image URL validation and fallback handling

## Styling

Uses Tailwind CSS with custom animations:
- Hover effects on interactive elements
- Smooth modal transitions
- Sequential form field animations
- Responsive grid layouts

## Deployment

Deployed on Netlify with automatic GitHub integration.
Environment variables configured for production API endpoints.

