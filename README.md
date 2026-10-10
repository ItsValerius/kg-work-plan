# KG Knallköpp Golkrath – Arbeitsplan

Sign-up app for the volunteer helpers at the carnival events of KG Knallköpp Golkrath e.V.
Organizers plan each event as shifts and tasks with the number of helpers needed; helpers
sign in with an email link (or Google) and claim a spot, alone or as a group.

Live: https://kg-work-plan.vercel.app

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · Drizzle ORM on Postgres (Neon) ·
Better Auth · shadcn/ui on Base UI · Tailwind CSS v4 · deployed on Vercel.

## Local development

Needs Node 24, pnpm 10 and Docker.

```bash
pnpm install
cp .env.example .env.local      # then set BETTER_AUTH_SECRET (openssl rand -base64 32)
docker compose up -d            # Postgres, Neon wsproxy, Mailpit
pnpm drizzle-kit migrate        # create the tables
pnpm db:seed                    # optional: a demo season relative to today
pnpm dev                        # http://localhost:3000
```

Sign in at `/signin` with any address; the email arrives in Mailpit at
http://localhost:8025. Make yourself an organizer with `pnpm make-admin you@example.com`.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server with Turbopack |
| `pnpm build` | Production build (also the full type check) |
| `pnpm lint` / `pnpm format` | ESLint / Prettier with Tailwind class sorting |
| `pnpm test` | Unit tests with Vitest (`tests/`); `pnpm test:watch` while working |
| `pnpm drizzle-kit generate` | New migration from `src/db/schema` |
| `pnpm drizzle-kit migrate` | Apply migrations to `POSTGRES_URL` |
| `pnpm db:seed` | Reset the local demo data (refuses non-local databases) |
| `pnpm make-admin <email>` | Give an account the organizer role |

## Deploying

Pushing to the production branch deploys on Vercel. Production builds run
`drizzle-kit migrate` before `next build` (`vercel-build` in `package.json`); preview
builds skip migrations. Preview and production currently share one database, so test
on previews with care.

## Notes

- Dates are stored in UTC and always shown and entered in Berlin time (`src/lib/datetime.ts`).
- The UI is German; design rules live in `DESIGN.md` and `PRODUCT.md`.
- `CLAUDE.md` describes the architecture for AI-assisted work.
