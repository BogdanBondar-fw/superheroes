# Superheroes Frontend

React + Vite client for the Superheroes API.

Features
- List heroes with pagination (default 5 per page)
- Search by nickname substring (client sends q param)
- View hero details in modal
- Create / edit hero (optimistic create on first page)
- Add, replace or clear images (array of URLs)

Run
```bash
npm install
npm run dev
```
App at http://localhost:5173 (expects backend at http://localhost:3000)

Build
```bash
npm run build
```

Tech
- React 19, React Query, React Hook Form + Zod, Tailwind

API Base
Requests use relative paths. If you host backend elsewhere, configure a proxy in `vite.config.ts` or adapt a fetch base URL helper.

License UNLICENSED

