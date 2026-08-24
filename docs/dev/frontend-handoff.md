# Frontend handoff

**Status:** Accepted
**Last reviewed:** 2026-08-24

The frontend is intentionally a structural shell, not a finished UI.

## Stable contracts

- Routes are defined in `frontend/src/App.tsx`.
- Feature code lives under `frontend/src/features/`.
- Supabase queries stay in each feature's `api.ts` file.
- External data is validated and mapped in `schemas.ts` before components use it.
- Components consume camel-cased domain models from `model.ts`.
- Public environment variables are parsed in `frontend/src/lib/env.ts`.

## Safe to replace

- All markup and CSS in route components
- `AppShell` navigation and layout
- Global tokens and Tailwind usage
- Placeholder copy and empty/loading/error treatments
- Local UI primitives added under `frontend/src/components/ui/`

## Please preserve

- No direct Supabase queries inside presentational components
- Explicit loading, empty, error, and success states
- Runtime validation at the API boundary
- No service-role or webhook secrets in `VITE_*` variables
- Mobile-first route behavior and accessible semantic elements

## Expected next frontend tasks

1. Establish semantic design tokens and typography.
2. Build job cards, filter controls, and responsive list layout.
3. Implement `getJobBySlug` and compose the detail page.
4. Add copy-link, WhatsApp, and email share affordances.
5. Add component tests for the final states.
