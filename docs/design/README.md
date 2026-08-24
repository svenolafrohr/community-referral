# Design

Experience and interface guidance for the Community Referral platform.

## Experience objective

Help a community member understand and share a relevant job in under one minute. Trust, clarity, and mobile usability matter more than feature density.

## Required V0 surfaces

- Job listing with scannable cards.
- Job detail with role, company, location or remote policy, description, bonus, and referral explanation.
- Share actions for copy link, WhatsApp, and email.
- Explicit loading, empty, error, and success states.
- A lightweight submission or ingestion explanation.
- Optional operator review UI; Supabase Studio is acceptable for V0.

## Experience principles

- Make the bonus and its uncertainty clear; do not imply that payment is guaranteed by the platform.
- Preserve the trusted-community context throughout the journey.
- Keep the primary sharing action obvious and reachable on mobile.
- Ask for the minimum personal data needed for the next action.
- Prefer plain language over marketplace or recruiting jargon.
- Design for a small set of high-quality jobs rather than an infinite feed.

The [product vision](../product/vision-and-principles.md), [users](../product/users-and-jobs-to-be-done.md), and [core journeys](../product/core-journeys.md) define the user context. The [frontend handoff](../dev/frontend-handoff.md) describes technical constraints and replaceable UI surfaces.

## Future sections

- `foundations.md` — typography, color, spacing, and semantic tokens
- `content-style.md` — terminology, tone, labels, and system messages
- `flows/` — annotated journeys and edge cases
- `patterns/` — reusable interaction patterns and component behavior
- `research/` — usability findings and design implications
- `decision-log.md` — dated design decisions and rationale

When adding a design artifact, include its status, date, and the product question it answers.
