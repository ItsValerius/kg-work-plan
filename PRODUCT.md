# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Helpers (primary):** club members of all ages — including older, less tech-savvy members — plus friends and family of members who may only help at a single event. They reach the app both on phones (typically through a shared link) and on desktop. Their job: find where help is needed at an upcoming carnival event and commit to a task, alone or as a named group.
- **Organizers (admins):** club volunteers who plan events, split them into shifts and tasks, set how many helpers each task needs, and track who is coming.

## Product Purpose

"KG Knallköpp Golkrath Arbeitsplan" organizes the voluntary helpers for the carnival events of KG Knallköpp Golkrath e.V. Organizers publish a work plan (event → shifts → tasks with required headcount); helpers sign up for tasks. Success means every task is staffed, helpers can see at a glance where they're needed, signing up takes little effort for anyone, and organizers spend less time on admin.

## Operating Context

- Helpers open the app from a link on a phone or sit down at a computer; many visit rarely, so nothing can rely on remembered UI.
- Sign-in is passwordless (magic link by email) or with Google.
- Helpers can sign up as a group with a group name and size; they see their commitments under "Meine Aufgaben".
- Organizers use the admin dashboard to manage events, shifts and tasks, see statistics, filter and remove registrations, and export participant lists as CSV.

## Capabilities and Constraints

- German-language UI throughout (routes too: `/meine-aufgaben`, `/datenschutz`, `/nutzungsbedingungen`).
- Next.js App Router, shadcn/ui on Radix + Tailwind v4, Drizzle/Postgres, Better Auth; deployed on Vercel.
- Event listings are public; signing up, "Meine Aufgaben", profile and the dashboard require sign-in; management requires the admin role.
- Known pain points (confirmed by the owner): the app looks generic rather than like the club; organizer admin work is tedious; sign-in and sign-up feel clunky; helpers can't quickly see where help is still needed.

## Brand Commitments

- Club name: KG Knallköpp Golkrath e.V.; app name "KG Knallköpp Golkrath Arbeitsplan".
- Keep the club logo (`public/logo.png`, green enamel-pin clown emblem; also `src/app/icon.png`).
- Colors follow the sibling project **kg-eventplan** (`~/projects/kg-eventplan/DESIGN.md`): club green and white, as on the club website https://www.knallkoepp-golkrath.de/.

## Evidence on Hand

- Logo assets: `public/logo.png`, `src/app/icon.png`.
- Legal pages: `src/app/(mdx)/datenschutz`, `src/app/(mdx)/nutzungsbedingungen`.
- No testimonials, statistics or photos are provided; do not fabricate them.

## Product Principles

1. **Where am I needed?** Open and understaffed tasks must be obvious before anything else.
2. **Signing up must work for everyone** — the least tech-savvy member on a phone sets the bar.
3. **Respect organizers' time** — common admin work takes as few steps as possible.
4. **Unmistakably our club** — it should feel like KG Knallköpp, not a template.

## Accessibility & Inclusion

Helpers include older members: legible type sizes, high contrast, large touch targets and plain German wording are product requirements, not polish.
