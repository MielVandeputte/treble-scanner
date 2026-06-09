# AGENTS.md

## What this project is
- Mobile-first QR ticket scanner PWA for Treble events (`React 19 + Vite + TypeScript + Tailwind v4`).
- Primary user flow: log in with event credentials -> scan ticket (camera or manual) -> review local scan history.

## Architecture and data flow
- App composition is centralized in `src/main.tsx`: providers wrap router in this order: `ScanCredentialsProvider` -> `ScanHistoryProvider` -> `PortraitGuard` -> routes.
- Auth/routing gate is context-driven, not token middleware: `src/guards/credentials-guard.tsx` redirects based on `scanCredentials` presence.
- Credentials are persisted in local storage via `store2` (`src/contexts/scan-credentials-provider.tsx`); logging out calls `store.clearAll()` and hard reloads via `location.reload()`.
- Scan history is also local storage backed (`src/contexts/scan-history-provider.tsx`), serialized with ISO timestamps and always sorted newest-first.
- Scanner page (`src/pages/scanner/scanner.tsx`) owns camera lifecycle (`qr-scanner`), throttles interactions with refs, and pauses scanning for 10s after each processed result.
- API calls live in services (`src/services/*.ts`) and return a strict union shape `{ data, error }` via `dataResponseFor` / `errorResponseFor` (`src/services/helper.ts`).

## External integrations and boundaries
- Backend base URL is environment-switched by `import.meta.env.VITE_ENV` (`src/services/helper.ts`): production -> `www.treble-events.be`, otherwise staging.
- `checkScanAuthorizationCode` verifies login credentials before entering scanner (`src/pages/login.tsx`, `src/services/check-scan-authorization-code.ts`).
- `scanTicket` posts `secretCode + scanAuthorizationCode` and maps backend DTO into `ScanAttempt` (`src/services/scan-ticket.ts`).
- Connectivity and orientation are treated as first-class runtime signals via `useSyncExternalStore` hooks (`src/hooks/use-online-status.tsx`, `src/hooks/use-screen-orientation.tsx`).

## Code patterns to follow here
- Keep TypeScript extension imports (`...from './file.ts'` / `'.tsx'`); this repo enables `allowImportingTsExtensions`.
- Reuse shared result vocabulary from `ScanAttemptResult` and `mapScanAttemptResultToString` (`src/types/scan-attempt.type.ts`) instead of ad-hoc status text.
- Preserve `data-testid` attributes on interactive UI; Playwright page objects depend on them (`tests/e2e/page-objects/*.ts`).
- UI text is Dutch across user-facing screens; match existing wording tone when adding UX copy.
- Navigation transitions use `viewTransition` links and `viewTransitionName: 'card'` in scanner/manual/history pages.

## Developer workflows
- Install deps: `npm install`
- Dev server: `npm run dev`
- Production build + preview: `npm run build` then `npm run start`
- Static checks: `npm run check` (Prettier + ESLint), autofix: `npm run fix`
- Unit tests (Vitest/jsdom): `npm run test:vitest`
- E2E tests (Playwright mobile projects): `npm run test:playwright`

## Testing specifics that are easy to miss
- Playwright config (`playwright.config.ts`) starts app with `npm run build && npm run start` at `http://localhost:4173`.
- QR-camera E2E test is Chromium-only because it uses fake media flags and fixture video `tests/test-data/ticket.y4m` (`tests/e2e/scan-ticket.playwright.ts`).
- Service tests stub `fetch` and `navigator.onLine`; copy that approach for new networked services (`src/services/*.vitest.ts`).
- Hook tests trigger browser events directly (`online`/`offline`, `screen.orientation.change`) and assert `useSyncExternalStore` updates.

## Repo conventions from existing docs
- Commit messages follow Conventional Commits (`README.md`).
- `staging -> main` merges are fast-forward only (`README.md`).

