# Core journeys

**Status:** Accepted for V0
**Last reviewed:** 2026-08-24
**Source:** [MVP specification](../sources.md)

## Discover and share a job

1. A referrer opens the controlled community link.
2. They scan active jobs and identify a relevant opportunity.
3. They open the job, understand the role and bonus, and choose a share channel.
4. The product creates or uses a unique referral URL.
5. The referrer sends the link to a candidate.
6. The system records a privacy-conscious event such as link creation or visit.

## Receive a referred opportunity

1. A candidate receives a link from a trusted contact.
2. They see the role, company, location, bonus context, and next step.
3. They express interest or continue to the external application flow.
4. The product captures only the minimum signal required to evaluate the journey.

## Ingest and publish a job

1. A user forwards or copies a job email to the platform.
2. The backend stores the incoming message envelope.
3. A parser extracts structured job fields.
4. The job is saved as a draft or reviewable record.
5. An operator corrects the result and activates the listing.

## Operate the V0 marketplace

1. An operator reviews drafts and ingestion failures in Supabase Studio.
2. They correct incomplete fields and confirm the referral terms.
3. They activate current, credible jobs and archive stale ones.
4. They inspect referral events when validating usage or investigating a problem.
