# Community Referral

Backend-first MVP scaffold for a community referral platform. The repository follows the [MVP specification](https://app.notion.com/p/04fde2169d9848c7b19406c787604233) and deliberately keeps the visual frontend minimal so a frontend contributor can establish the product design without reworking the data layer.

## What is included

- React 19, TypeScript, Vite, Tailwind CSS, and React Router frontend shell
- Feature-first routes and typed Supabase API boundaries
- Declarative Supabase schema for companies, jobs, referrals, and email ingestion
- Explicit Data API grants and row-level security policies
- Seed data for five representative jobs
- Provider-neutral Edge Function scaffolds for email ingestion and referral links
- CI for linting, type checking, tests, and production builds
- Architecture and frontend handoff documentation

## Product and project context

Start with the [documentation knowledge base](documentation/README.md). It separates growing product, development, and design context. The consolidated [product context](documentation/product/product-context.md) captures the intent and open questions from the original MVP specification.

## Prerequisites

- Node.js 22+
- Docker Desktop (for the local Supabase stack)
- A Supabase account and project
- Supabase CLI access through the pinned npm dependency

## Quick start

```bash
npm install
cp .env.example .env.local
npm run db:start
npm run dev
```

The frontend runs at `http://localhost:5173`. Local Supabase credentials are printed by `npm run db:status`; copy the API URL and publishable key into `.env.local`.

## Quality checks

```bash
npm run check
```

This runs linting, TypeScript checks, unit tests, and the production build.

## Supabase workflow

The files in `supabase/schemas/` are the database source of truth. Make schema changes there, then generate and review a migration:

```bash
npm run db:migration -- descriptive_change_name
npm run db:reset
```

Never put `SUPABASE_SERVICE_ROLE_KEY`, email webhook secrets, or LLM secrets in frontend environment variables. See [docs/architecture.md](docs/architecture.md) for the security boundary and [docs/frontend-handoff.md](docs/frontend-handoff.md) for the coworker handoff.

## Current V0 assumptions

- Access is controlled by a shared/private link; end-user authentication is deferred.
- Supabase Studio is the initial admin interface.
- Only active jobs and their companies are anonymously readable.
- Email ingestion stores incoming mail for review; parsing is a replaceable adapter.
- Referral links can be anonymous in V0 and are ready for user association later.
- Payments and legally binding bonus settlement are out of scope.
