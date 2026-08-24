# Agent instructions

## Repository purpose

This repository contains the V0 foundation for a trusted-community job referral platform. Read these files before changing the product:

- `README.md` for setup and commands
- `docs/dev/frontend-handoff.md` for frontend ownership boundaries
- `docs/dev/architecture.md` for data and security boundaries
- `docs/dev/decisions.md` for current V0 assumptions
- The linked Notion MVP specification in `README.md` for product scope

## Frontend contributor mandate

The frontend in `frontend/` is intentionally a structural placeholder. You own the visual design, responsive composition, interaction details, content treatment, and component system.

You may freely replace:

- route markup and page composition in `frontend/src/routes/`
- `frontend/src/components/AppShell.tsx`
- all CSS and Tailwind usage
- loading, empty, error, and success-state presentation
- navigation, icons, typography, and local source-owned UI primitives

Preserve or deliberately evolve these contracts:

- routes remain centralized in `frontend/src/App.tsx`
- Supabase calls stay inside feature `api.ts` modules, never in presentational components
- external data is validated with Zod in feature `schemas.ts` modules
- components consume camel-cased domain types from feature `model.ts` modules
- the Supabase browser client comes from `frontend/src/lib/supabase.ts`
- every data-driven screen handles loading, empty, error, and success states
- mobile behavior and accessible semantic HTML are required

If a backend contract must change, update the schema, mapper, types, tests, and documentation together. Do not work around a contract by scattering ad-hoc transforms through UI components.

## Environment and secrets

- Use Node.js 22 or newer.
- Run commands from the repository root.
- Copy `.env.example` to `.env.local` for local development.
- Only publishable Supabase values may use the `VITE_` prefix.
- Never expose or commit service-role keys, secret keys, webhook secrets, access tokens, or real candidate data.
- Do not add secret values to frontend code, fixtures, screenshots, logs, or documentation.

## Supabase rules

- `supabase/schemas/` is the declarative database source of truth.
- Never edit the remote database manually in Studio when the change belongs in migrations.
- Generate migrations with `npm run db:migration -- <descriptive_name>`.
- Keep RLS enabled on every exposed table and use explicit grants.
- Anonymous clients may read only active jobs and their public company information.
- Raw email, contact, candidate, referral, and ingestion data must remain server-only unless a reviewed access model is introduced.
- Service-role access is allowed only in Supabase Edge Functions or other trusted server runtimes.

## Product constraints for V0

- No end-user authentication is required yet.
- Supabase Studio is the admin interface.
- Payments and legally binding bonus settlement are out of scope.
- Avoid collecting candidate personal data unless the user flow and consent basis are explicitly defined.
- Optimize for a small trusted community and a sub-one-minute share flow, not a public infinite marketplace.

## Required checks

Before handing work back, run:

```bash
npm run check
```

This must pass linting, strict TypeScript checks, tests, and the production build. Add or update tests when changing schemas, data mappers, routing behavior, or meaningful interactions.

## Git hygiene

- Keep changes scoped to the requested work.
- Do not commit unrelated untracked files.
- Commit the lockfile whenever dependencies change.
- Prefer a focused feature branch and a reviewed pull request for frontend work unless the repository owner explicitly requests a direct push.
