# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                 # Vite dev server
npm run build               # tsc (typecheck, noEmit) + vite build
npm run start               # vite preview on :4173

npm run check               # prettier --check + eslint (what CI runs)
npm run fix                 # prettier --write + eslint --fix

npm run test:vitest         # unit tests (jsdom)
npm run test:playwright     # e2e tests
npm run test                # both
```

Single tests:

```bash
npx vitest run src/services/scan-ticket.vitest.ts
npx vitest run -t 'should return error response when fetch errors'
npx playwright test tests/e2e/scan-ticket.playwright.ts --project='Mobile Chrome'
```

Note the file-suffix conventions that drive test discovery: Vitest only picks up `**/*.vitest.{ts,tsx}` (colocated next to source in `src/`), Playwright only `tests/**/*.playwright.{ts,tsx}`.

## Architecture

Mobile-first QR ticket-scanner PWA for Treble events. React 19 + Vite + TypeScript + Tailwind v4, no backend of its own — it talks to the Treble events API.

**Composition** — everything is wired in `src/main.tsx`: `ScanCredentialsProvider` → `ScanHistoryProvider` → `PortraitGuard` → `RouterProvider`. Route paths are exported constants from that same file (`LOGIN_PATH`, `SCANNER_PATH`, …); import them rather than hardcoding strings. Unknown paths redirect to the scanner.

**Auth is context + local storage, not tokens.** `ScanCredentials` (`eventId` + `scanAuthorizationCode`) is validated once at login via `checkScanAuthorizationCode`, then held in context and persisted with `store2`. `CredentialsGuard` (`assertPresent` / `assertNotPresent`) is what gates every route — there is no interceptor or middleware layer. Logging out means `store.clearAll()` + `location.reload()`, so any new persisted state is wiped by logout for free.

**Service layer** (`src/services/`) — every call returns the union `{ data: T; error: null } | { data: null; error: string }`, built with `dataResponseFor` / `errorResponseFor` from `helper.ts`. Services never throw: they check `navigator.onLine` first, then map both HTTP failure and `json.error` onto `FALLBACK_ERROR_RESPONSE` / the server's message. Callers branch on `error === null`. Backend base URL switches on `import.meta.env.VITE_ENV === 'production'` (staging otherwise) in `helper.ts` — unset means staging, which is what tests assert against.

**Scanner** (`src/pages/scanner/scanner.tsx`) owns the whole `qr-scanner` camera lifecycle in one effect keyed on `handleScan`. Concurrency is guarded with refs, not state (`scanningActiveRef`, `togglingFlashRef`, `switchingCameraRef`) so re-renders don't reopen the camera; after a processed scan, scanning is disabled and re-enabled by a 10s timeout (or the card's restart button). Any change here must keep the cleanup path symmetric — it destroys the scanner and clears the timeout.

**Runtime signals as hooks** — `use-online-status.tsx` and `use-screen-orientation.tsx` are `useSyncExternalStore` subscriptions over browser events. `PortraitGuard` uses the latter to replace the entire app with a "rotate your device" screen in landscape.

**Scan history** is local-storage backed (`scan-history-provider.tsx`), always sorted newest-first, and serialized with the `timestamp` as an ISO string — hence the explicit `serialize`/`deserialize` pair. `ScanAttempt.id` is client-generated (`crypto.randomUUID()`), not from the server.

## Conventions

- **Keep `.ts` / `.tsx` extensions in relative imports** — `allowImportingTsExtensions` is on and existing code does this everywhere.
- User-facing copy is **Dutch**. Result text comes from `mapScanAttemptResultToString` and the `ScanAttemptResult` union (`src/types/scan-attempt.type.ts`) — don't invent ad-hoc status strings.
- **Don't remove or rename `data-testid` attributes**; the Playwright page objects in `tests/e2e/page-objects/` select on them.
- ESLint enforces `import/order` (alphabetized, newline-separated groups) and `explicit-function-return-type`; `unicorn` recommended is on. Run `npm run fix` before finishing.
- Navigation uses `viewTransition` links with `viewTransitionName: 'card'` on the scanner/manual/history cards.
- React Compiler (`babel-plugin-react-compiler`) is enabled in `vite.config.ts`.

## Security headers

`vercel.json` holds the production response headers (CSP, `X-Frame-Options`) — the app is deployed on Vercel as a static build. The dev and preview servers do **not** serve these headers, so the Playwright suite does not cover the policy; changes to it have to be checked against a deployment (or a local https server replaying the header). Three directives are load-bearing and easy to break:

- `worker-src blob:` — `qr-scanner` builds its decode worker with `new Worker(URL.createObjectURL(new Blob(...)))`. Drop this and QR scanning fails silently while the camera still shows a picture.
- `style-src 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='` — that is the hash of the *empty* string. `AnimatePresence mode="popLayout"` appends an empty `<style>` and then fills it via `sheet.insertRule()` (CSSOM, not CSP-checked), so allowing the empty element is enough and `'unsafe-inline'` is not needed.
- `connect-src` lists both the production and staging API hosts, because one `vercel.json` serves every deployment of this repo.

Note when testing locally over http: WebKit applies `upgrade-insecure-requests` to `http://localhost` and upgrades same-origin assets to a port that speaks no TLS, so a plain-http server sending this header renders blank in Safari/WebKit. That is an http-only artifact — over https the directive is inert and verified working in both engines.

## Testing notes

- Playwright's `webServer` runs `npm run build && npm run start` against `http://localhost:4173`, so e2e runs typecheck and build first, and hits the **real staging backend** with the credentials hardcoded in the spec.
- `scan-ticket.playwright.ts` is Chromium-only — it feeds `tests/test-data/ticket.y4m` through `--use-file-for-fake-video-capture`. That fixture ticket is already scanned, so the expected result is `ALREADY_SCANNED`.
- Service tests stub `fetch` via `vi.stubGlobal` and redefine `navigator.onLine`; follow that pattern for new networked services.

## Repo workflow

- Conventional Commits (see `README.md` for the type list).
- `staging` is the working branch; merge into `main` fast-forward only (`git merge --ff-only origin/staging`).
- CI (`.github/workflows/validation.yml`) runs format, lint, Vitest, and Playwright on pushes/PRs to `main` and `staging`.

`AGENTS.md` covers much of the same ground for other agents; keep the two in sync when conventions change.
