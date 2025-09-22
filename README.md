# volksskatt (Frontend Only)

A React + Vite + Tailwind CSS frontend for HR/ATS features (login, clock in/out, attendance, jobs, candidates, interviews, documents, offers). No backend included.

## Prerequisites

- Node.js 18+ and npm (for development)
- Python 3 (optional, to serve the production build without Node)

## Getting Started (Development)

```bash
npm install
npm run dev
```

Open the URL shown (typically http://localhost:5173).

## Build for Production

```bash
npm run build
```

This creates the static site in `dist/`.

## Serve Production Build via Python

```bash
npm run build
npm run serve:python
```

This serves `dist/` on http://localhost:5174 with SPA fallback handling.

## Structure

- `src/components/Layout.jsx` – Top navigation and layout shell
- `src/pages/*` – Feature pages
- `src/services/auth.js` – Mock auth (localStorage)
- `tailwind.config.js`, `postcss.config.js`, `src/index.css` – Tailwind setup
- `serve.py` – Simple Python server for static build

## Notes

- This is a mock UI using in-memory data. Replace services with real API calls when you add a backend.
- Routing is protected by a simple mock `isAuthenticated()` check.
# volksskatt
