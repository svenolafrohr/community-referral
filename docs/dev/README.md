# Development

Engineering knowledge for building, operating, and changing the platform.

## Current documents

- [Architecture](architecture.md) — system boundary, data exposure, database workflow, and deferred technical decisions.
- [V0 decisions and assumptions](decisions.md) — accepted implementation constraints for the current build.
- [Frontend handoff](frontend-handoff.md) — stable contracts, replaceable UI surfaces, and expected frontend work.
- [Repository README](../../README.md) — setup, quality checks, and Supabase workflow.

## Future sections

Create these only when the first real document exists:

- `runbooks/` — deployment, incident, and maintenance procedures
- `api/` — API and integration contracts
- `data/` — schema concepts, retention, privacy, and migrations
- `adr/` — architecture decision records
- `testing.md` — quality strategy and required checks
- `environments.md` — local, preview, and production configuration

## Conventions

- Keep code behavior and its documentation in the same change.
- Record rationale and trade-offs for decisions that constrain future work.
- Mark proposals as proposals until implemented and accepted.
- Keep secrets and personal data out of documentation and fixtures.
