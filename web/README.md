# Frontend — Knaq IoT Alert Triage

Next.js 16 (App Router) frontend for the Knaq IoT Alert Triage system.

For complete setup instructions, see the [root README](../README.md).

---

## Quick Start

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The backend must be running on port 8000 first.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API base URL |
| `NEXT_PUBLIC_AUTH_TOKEN` | `token-alice-brookfield` | Bearer token for the active user session |

To switch company perspective, change `NEXT_PUBLIC_AUTH_TOKEN` to any seeded token (see root README) and restart the dev server.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Start production server (requires build first) |
| `npm test` | Run all Jest tests in watch mode |
| `npm test -- --watchAll=false` | Run tests once and exit |
| `npm run lint` | ESLint check |

---

## Source Structure

```
src/
  app/                    Next.js App Router pages
    alerts/page.tsx       Alert Queue
    alerts/[id]/page.tsx  Alert Detail
    analytics/page.tsx    Analytics Dashboard
    layout.tsx            Root layout with AppBar and providers
    providers.tsx         MUI ThemeProvider + Redux Provider + Toast
    error.tsx             Next.js error boundary
    not-found.tsx         Custom 404 page

  features/alerts/        All alert-related code in one feature module
    api/alertsApi.ts      RTK Query endpoints and cache tag strategy
    components/           AlertTable, AlertDetail, ResolveDialog,
                          AssignDialog, AlertTimeline, AddNoteForm,
                          SummaryBar (one folder per component)
    slices/filtersSlice   Client-side filter, sort, and search state
    hooks/useAlertActions Dialog open and close state
    types/index.ts        TypeScript interfaces for all domain types

  components/             Shared atomic UI components
    ui/                   SeverityChip, StatusBadge, LoadingSkeleton,
                          EmptyState, ErrorState, AppToast
    layout/               AppBar with theme toggle

  constants/              Severity color maps, status labels, route constants
  utils/                  Relative time formatters, API error extractors
  lib/
    store/                Redux store with RTK Query middleware
    theme/                MUI createTheme with Knaq brand colors
    auth/                 Bearer token injection for all RTK Query requests
```

---

## Tests

Unit tests are co-located with each component in a `ComponentName.test.tsx` file inside the component folder. Page-level integration tests using MSW live in `src/__tests__/`.

```bash
npm test -- --watchAll=false
```

Expected: **103 tests pass**.

---

## Key Design Decisions

**State split:** Server data (alerts, devices, users) lives in RTK Query's normalized cache. Client UI state (filters, sort, search) lives in Redux slices. Dialog state and bulk selection live in local `useState`.

**No mock data in production:** MSW is a dev dependency used only in Jest. The production bundle never includes it.

**Optimistic UI on acknowledge:** The acknowledge mutation immediately updates the detail cache and rolls back on server rejection.

**Keyboard shortcut:** Press `a` (or `A`) on the Alert Queue while new alerts are selected to trigger bulk acknowledge.
