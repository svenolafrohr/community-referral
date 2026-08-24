# Architecture

## System boundary

The browser reads active jobs and company summaries through the Supabase Data API. All writes use Edge Functions with the service-role key held only in Supabase secrets.

```text
Browser -> Supabase Data API -> companies/jobs (anonymous read + RLS)
Email provider -> email-ingest Edge Function -> ingestion_events
Browser -> create-referral Edge Function -> referrals/referral_events
Referral URL -> referral-redirect Edge Function -> event + job page
Supabase Studio -> review/import/admin operations
```

## Data exposure

| Data | Browser access | Write path |
| --- | --- | --- |
| Active jobs | Anonymous read | Studio / service role |
| Companies with active jobs | Anonymous read | Studio / service role |
| Source contacts | None | Studio / service role |
| Raw emails and parser results | None | Email Edge Function |
| Referrers, referrals, events | None | Referral Edge Functions |

Every table has RLS enabled. Grants make the intended Data API surface explicit because current Supabase projects no longer expose new tables automatically.

## Database workflow

`supabase/schemas/` is declarative source of truth. Generated migrations go in `supabase/migrations/` and must be reviewed before committing. Foreign keys are indexed, active-list queries use partial indexes, timestamps are timezone-aware, and monetary values use fixed-precision numeric columns.

## Deferred decisions

- Community login and tenant scoping
- Email provider and payload adapter
- LLM provider and structured parsing contract
- Referral ownership and candidate consent flow
- Payment trigger and settlement system
- Rate limiting and abuse controls for a public launch
