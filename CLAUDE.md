# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

`AGENTS.md` is generated and kept up to date by `next dev`; commit it rather than editing or deleting it.

## Overview

A volunteer work-plan app (German UI): admins create **events → shifts → tasks**, and users sign up for tasks (alone or as a named group with a size) via `taskParticipants`. Next.js 16 App Router, React 19, Drizzle ORM on Postgres (Neon serverless driver), Better Auth, shadcn/ui on Base UI (`@base-ui/react`) + Tailwind v4.

## Commands

Use pnpm (`packageManager: pnpm@10`).

```bash
pnpm dev                 # next dev --turbopack
pnpm build               # production build (also the main type check)
pnpm lint                # eslint . (flat config in eslint.config.mjs)
pnpm format              # Prettier (+ Tailwind class sorting); pnpm format:check in CI
docker compose up -d     # Postgres (54320) + Neon wsproxy (54330) + Mailpit (SMTP 1025, inbox http://localhost:8025)
pnpm make-admin <email>  # give an address the admin role locally (creates the account if missing)
pnpm db:seed             # load a demo season (dates relative to today); rerun to reset it, real accounts stay
pnpm drizzle-kit generate   # generate a migration from src/db/schema into src/db/migrations
pnpm drizzle-kit migrate    # apply migrations (needs POSTGRES_URL or DATABASE_URL); production builds run this via `vercel-build`
pnpm test                # Vitest unit tests in tests/ (pnpm test:watch while working)
```

`pnpm test` runs Vitest (`vitest.config.mts`) on `tests/**/*.test.ts`, which mirrors `src/` (`tests/lib`, `tests/domains`) and imports through `@/`. Tests run with `TZ=America/New_York` so date code can't rely on the machine's zone. Add a small test there for any new rule (capacity, spots, CSV, dates).

### Local setup

`cp .env.example .env.local` and set `BETTER_AUTH_SECRET`; the defaults point at the docker-compose services. Sign in at `/anmelden` with any address: the magic-link email lands in Mailpit (http://localhost:8025). `pnpm make-admin` connects with plain `pg` to `POSTGRES_URL`, not through the app's driver.

`src/db/index.ts` uses a `@neondatabase/serverless` `Pool` (WebSockets) with `drizzle-orm/neon-serverless`, connecting via `POSTGRES_URL` (fallback `DATABASE_URL`). When `VERCEL_ENV=development` it routes through the `pg_proxy` wsproxy container on port 54330, so the local stack needs both docker-compose services running. `drizzle.config.ts` reads the same env vars via dotenv.

Better Auth throws in production builds/runtime without `BETTER_AUTH_SECRET`.

All env vars are listed in `.env.example` (Google sign-in is optional locally).

## Architecture

### Layering

- **`src/db/schema/`** — Drizzle tables. Always define tables with the `pgTable` from `src/db/util.ts`, which prefixes names with `kg-work-plan_`; `drizzle.config.ts` filters on that prefix (`tablesFilter`), so tables created with the plain `pgTable` are invisible to drizzle-kit. Better Auth tables (user/session/account/verification) live in `users.ts`.
- **`src/domains/<domain>/`** — framework-agnostic data layer, split into `queries.ts` (reads), `functions.ts` (writes; take an explicit `userId`, log via `@/lib/logger`, rethrow generic errors) and `types.ts` (zod schemas / input types, often via `drizzle-zod`). No auth checks here.
- **`src/server/actions/`** — `"use server"` wrappers: authenticate (`getAuthenticatedUserId` / `getAuthenticatedAdminUserId`), **parse every argument with a Zod schema** (`parseOrThrow` / `firstIssueMessage` from `src/lib/validation.ts`; schemas live in each domain's `types.ts`), call the domain function, then `updateTag(WORKPLAN_TAG)`. Server actions are public endpoints: never trust their arguments.
- **`src/app/api/`** — only Better Auth's handler. All app writes, including the full forms (`EventForm`, `ShiftForm`, `TaskForm`, `UserDataFrom`), go through server actions.
- **`src/components/`** — `ui/` is shadcn (configured by `components.json`; add with the shadcn CLI), `features/<domain>/` holds domain components, `shared/` holds reusable buttons/dialogs/navigation, `layout/` holds page shells.

### Rendering & caching (Cache Components)

`cacheComponents` and `partialPrefetching` are on in `next.config.ts`: every route is a static shell plus streamed content, and links prefetch one shared shell per route.

- **Request data must sit inside `<Suspense>`, and only request data.** Keep fixed text (headings, intros, labels) outside the boundary so it lands in the static shell, and stream just the part that needs the session or data (e.g. `/meine-aufgaben`, `/profil`, `/veranstaltungen`, `/anmelden`, `/email-pruefen`). Pages that need data before anything can render keep a `loading.tsx`. Skeletons live in `src/components/layout/Skeletons.tsx` and are sized to the real line boxes (`Line`), so nothing jumps when content arrives; re-measure them when you change a page's layout. The header's session part streams via `SessionNav`. Don't add `export const dynamic`/`revalidate`; a build fails on request data read outside a boundary.
- **Render-time reads are cached** with `"use cache"` + `cacheLife("workplan")` + `cacheTag(WORKPLAN_TAG)` (`src/lib/cache-tags.ts`): event lists, `getEventWorkPlan`, open-spot counts, `getUserTasks`, `getParticipantsData`. Anything on a write path (capacity checks in domain `functions.ts`) must read uncached.
- **Every write invalidates `WORKPLAN_TAG`** with `updateTag` in its server action. (A route handler would need `revalidateTag(WORKPLAN_TAG, { expire: 0 })`, since `updateTag` isn't allowed there.)
- `getSession` is wrapped in React `cache()`, so repeated calls in one request hit the database once. Pages that need sign-in call `getAuthenticatedUser(callbackUrl)`, which redirects.
- Time-dependent splits (upcoming vs. past) happen outside the cache, after `connection()`.

### Auth

- Better Auth (`src/lib/auth/auth.ts`) with magic-link email (nodemailer) and Google; mounted at `src/app/api/auth/[...all]/route.ts`. Client side uses `src/lib/auth/client.ts`.
- `role` is a Better Auth `user.additionalFields` entry (`input: false`, so sign-up can't set it) and comes with every session; `getAuthenticatedUser` normalizes missing values to `null`. Admin = `role === "admin"` (`src/lib/auth/roles.ts`); regular users have `null`.
- Rate limits are stored in the database (`rate_limit` table) so all instances share them; the magic-link endpoint allows 20 requests per minute per IP.
- Sessions use Better Auth's cookie cache (5 min): pages (`getSession`) read the session from a signed cookie instead of the database, so a revoked session or changed role reaches pages only within 5 minutes. The throwing helpers that guard writes (`getAuthenticatedUserId` / `getAuthenticatedAdminUserId`) read with `disableCookieCache`, so they see changes at once.
- **MCP for admins' AI assistants:** `/api/mcp` (`src/app/api/mcp/route.ts`, tools in `src/server/mcp/`) is an OAuth-protected MCP server. Better Auth's `jwt` + `mcp` (+ `cimd`) plugins make the app the OAuth provider: discovery under `/.well-known/*`, sign-in via `/anmelden` (the magic link only lands on `/angemeldet`; the assistant's own window waits on `/email-pruefen?weiter=…` and resumes the authorize request once the session exists, because ChatGPT keeps its OAuth state in that window), consent at `/zugriff-erlauben`. Each call re-checks role and consent (`getMcpAccess`): only admins get through, and an assistant disconnected at `/organisation/ki-assistenten` gets 401 at once. Tools read and create/edit only (no deletes), show helpers as counts only, and take Berlin day/time strings. Writes call `revalidateTag(WORKPLAN_TAG, { expire: 0 })`. Disconnecting an assistant (`disconnectAssistant`) only touches OAuth tables, which nothing caches, so it skips `updateTag`. `MCP_RESOURCE` is built from `BETTER_AUTH_URL` (localhost if unset); it must be the public https URL wherever assistants connect, or tokens are bound to the wrong address. `@better-auth/utils` is pinned to the version `better-auth` pins, so the plugins share one `@better-auth/core`.
- `src/proxy.ts` only refreshes that cache cookie (Server Components can't set cookies); it is not an auth check. `/`, `/anmelden`, `/email-pruefen` and everything under `/veranstaltungen` are public, and **every protected page, layout, server action and API route must do its own check** using helpers in `src/lib/auth/utils.ts` (`getAuthenticatedUser` / `requireAdminUserId` redirect on pages; the throwing helpers raise `Error("Unauthorized")`, which API routes map to 401).

### Conventions

- User-facing text is German (route names too: `/veranstaltungen`, `/organisation`, `/meine-aufgaben`, `/profil`, `/anmelden`, MDX legal pages `/datenschutz`, `/nutzungsbedingungen` under the `(mdx)` route group; only `/api` stays English).
- **Dates:** stored as UTC instants, shown and entered as Berlin wall-clock time, always through `src/lib/datetime.ts` (Intl only, no date library): `fromBerlin(day, time)` for input, `berlinTimeFrom` for times that may fall after midnight (night shifts), `moveByBerlinDays` for date moves, `berlinToday()`/`toBerlinInputParts` for day comparisons, and the `format*` helpers for output. Pickers: `DatePicker` (Berlin days) and native `<input type="time">`. Never use `toLocale*String`, `setHours` or `new Date("…T…")` elsewhere.
- Helpers can change their own sign-ups only until the shift ends (`assertShiftNotOver`); admins correct records in the dashboard.
- Editing an event's start date moves its shifts and tasks by the same number of Berlin days (duplicating does the same).
- Path alias `@/*` → `src/*`.
- Organizer creation (events, shifts, tasks, duplicates) lives only under `/organisation` (tab "Planen", forms at `/organisation/veranstaltungen/...`); edit and delete also live there (inline buttons in "Planen", plus the event actions). Old English URLs (`/events/...`, `/dashboard/...`, `/profile`, `/signin`) redirect to the German ones (`next.config.ts`).
- The sign-in email is `src/lib/auth/magic-link-email.ts` (tables + inline styles only; links valid 15 min).
- UI follows `DESIGN.md` (the Knallköpp "Vereinskalender" family shared with the sibling kg-eventplan app) and `PRODUCT.md`; per-surface direction lives in `.impeccable/surfaces/`.
- Server actions called from forms that must show a reason on failure return `{ ok: false, error }` instead of throwing (e.g. `signUpForTask`, `quickAddTask`), because production builds hide thrown server-action messages.
