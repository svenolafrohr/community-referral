# V0 scope

**Status:** Accepted
**Last reviewed:** 2026-08-24
**Source:** [MVP specification](../sources.md)

## In scope

- A mobile-usable list of active jobs.
- Job cards with role, company, location or remote policy, short description, bonus, status, and sharing action.
- A job detail view with the full description, company context, referral terms, and sharing action.
- Sorting or filtering by useful attributes such as recency, function, location, remote policy, community, or bonus, as time permits.
- Job submission through a lightweight email-ingestion path or another minimal import path.
- Structured extraction of title, company, location, remote policy, description, source, contact, bonus, seniority, and function where available.
- Draft or review status before a listing becomes active.
- A unique job share link and, optionally, a referrer-specific code.
- Copy-link, WhatsApp, and email sharing; LinkedIn is optional.
- Lightweight tracking of a share-link visit or interest signal.
- Manual administration through Supabase Studio.
- A controlled test with approximately five people.

## Out of scope

- Production payment and bonus settlement.
- A legally complete payout process.
- Complex authentication or community provisioning.
- A company self-service portal.
- Candidate profiles or talent-pool management.
- Automated matching, ranking, or recommendation.
- A broad public marketplace.
- A complete anti-fraud system.

## Scope rule

A V0 feature should either enable the real discover-and-share journey, make the result observable, or remove a blocker to testing it. Other features require explicit justification.
