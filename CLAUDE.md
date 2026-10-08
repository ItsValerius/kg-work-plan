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
pnpm drizzle-kit migrate    # apply migrations (needs POSTGRES_URL or DATABASE_URL)
```

There is no test framework configured.

### Local setup

`cp .env.example .env.local` and set `BETTER_AUTH_SECRET`; the defaults point at the docker-compose services. Sign in at `/signin` with any address: the magic-link email lands in Mailpit (http://localhost:8025). `pnpm make-admin` connects with plain `pg` to `POSTGRES_URL`, not through the app's driver.

`src/db/index.ts` uses a `@neondatabase/serverless` `Pool` (WebSockets) with `drizzle-orm/neon-serverless`, connecting via `POSTGRES_URL` (fallback `DATABASE_URL`). When `VERCEL_ENV=development` it routes through the `pg_proxy` wsproxy container on port 54330, so the local stack needs both docker-compose services running. `drizzle.config.ts` reads the same env vars via dotenv.

Better Auth throws in production builds/runtime without `BETTER_AUTH_SECRET`.

All env vars are listed in `.env.example` (Google sign-in is optional locally).

## Architecture

### Layering

- **`src/db/schema/`** — Drizzle tables. Always define tables with the `pgTable` from `src/db/util.ts`, which prefixes names with `kg-work-plan_`; `drizzle.config.ts` filters on that prefix (`tablesFilter`), so tables created with the plain `pgTable` are invisible to drizzle-kit. Better Auth tables (user/session/account/verification) live in `users.ts`.
- **`src/domains/<domain>/`** — framework-agnostic data layer, split into `queries.ts` (reads), `functions.ts` (writes; take an explicit `userId`, log via `@/lib/logger`, rethrow generic errors) and `types.ts` (zod schemas / input types, often via `drizzle-zod`). No auth checks here.
- **`src/server/actions/`** — `"use server"` wrappers: authenticate (`getAuthenticatedUserId` / `getAuthenticatedAdminUserId`), **parse every argument with a Zod schema** (`parseOrThrow` / `firstIssueMessage` from `src/lib/validation.ts`; schemas live in each domain's `types.ts`), call the domain function, then `updateTag(WORKPLAN_TAG)`. Server actions are public endpoints: never trust their arguments.
- **`src/app/api/`** — Route handlers that mirror the nested resource structure (`events/[eventId]/shifts/[shiftId]/tasks/[taskId]/users`). They validate with the domain zod schema, call domain functions, and return errors via `ApiErrorResponse` (`src/lib/api-errors.ts`). Some client forms (e.g. `EventForm`, `ShiftForm`, `UserDataFrom`) `fetch` these routes; others call server actions directly.
- **`src/components/`** — `ui/` is shadcn (configured by `components.json`; add with the shadcn CLI), `features/<domain>/` holds domain components, `shared/` holds reusable buttons/dialogs/navigation, `layout/` holds page shells.

### Rendering & caching (Cache Components)

`cacheComponents` and `partialPrefetching` are on in `next.config.ts`: every route is a static shell plus streamed content, and links prefetch one shared shell per route.

- **Request data must sit inside `<Suspense>`.** Each route has a `loading.tsx` (skeletons in `src/components/layout/Skeletons.tsx`), and the header's session part streams via `SessionNav`. Don't add `export const dynamic`/`revalidate`; a build fails on request data read outside a boundary.
- **Render-time reads are cached** with `"use cache"` + `cacheLife("workplan")` + `cacheTag(WORKPLAN_TAG)` (`src/lib/cache-tags.ts`): event lists, `getEventWorkPlan`, open-spot counts, `getUserTasks`, `getParticipantsData`. Anything on a write path (capacity checks in domain `functions.ts`) must read uncached.
- **Every write invalidates `WORKPLAN_TAG`:** `updateTag` in Server Actions, `revalidateTag(WORKPLAN_TAG, { expire: 0 })` in route handlers (`updateTag` isn't allowed there).
- `getSession` is wrapped in React `cache()`, so repeated calls in one request hit the database once. Pages that need sign-in call `getAuthenticatedUser(callbackUrl)`, which redirects.
- Time-dependent splits (upcoming vs. past) happen outside the cache, after `connection()`.

### Auth

- Better Auth (`src/lib/auth/auth.ts`) with magic-link email (nodemailer) and Google; mounted at `src/app/api/auth/[...all]/route.ts`. Client side uses `src/lib/auth/client.ts`.
- A `customSession` plugin re-reads `role` from the DB on every session fetch and normalizes `undefined` → `null`. Admin = `role === "admin"` (`src/lib/auth/roles.ts`); regular users have `null`.
- `proxy.ts` (Next 16's replacement for `middleware.ts`) only does optimistic redirects to `/signin`; `/`, `/signin`, `/verify-request` and everything under `/events` are public. **Every protected page, layout, server action and API route must do its own check** using helpers in `src/lib/auth/utils.ts`. Those helpers throw `Error("Unauthorized")`, which API routes map to 401.

### Conventions

- User-facing text is German (route names too: `/meine-aufgaben`, MDX legal pages `/datenschutz`, `/nutzungsbedingungen` under the `(mdx)` route group).
- Dates are stored in UTC; use `src/lib/datetime.ts` (`UTCDate`, formatting in `de-DE` / `Europe/Berlin`) rather than ad-hoc formatting.
- Path alias `@/*` → `src/*`.
- Organizer creation (events, shifts, tasks, duplicates) lives only under `/dashboard` (tab "Planen", forms at `/dashboard/events/...`); helper pages keep just edit/delete menus. Old `/events/.../new` URLs redirect there (`next.config.ts`).
- The sign-in email is `src/lib/auth/magic-link-email.ts` (tables + inline styles only; links valid 15 min).
- UI follows `DESIGN.md` (the Knallköpp "Vereinskalender" family shared with the sibling kg-eventplan app) and `PRODUCT.md`; per-surface direction lives in `.impeccable/surfaces/`.
- Server actions called from forms that must show a reason on failure return `{ ok: false, error }` instead of throwing (e.g. `signUpForTask`, `quickAddTask`), because production builds hide thrown server-action messages.
