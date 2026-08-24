# Risks and open questions

**Status:** Open
**Last reviewed:** 2026-08-24
**Sources:** [MVP specification](../sources.md), [planning session](../sources.md)

## Product and trust risks

- Low-quality or indiscriminate referrals could erode community trust.
- Too few high-quality jobs could make the product feel empty.
- Referral bonuses may be too small or uncertain to change behavior.
- Companies and referrers may bypass the platform after the first contact.
- The paying customer and preferred revenue model are not yet proven.

## Privacy and operational risks

- Collecting candidate or source-contact data could introduce privacy and consent issues.
- Email parsing may be unreliable across unstructured formats.
- Stale or misleading listings could damage the credibility of the community channel.
- Authentication and tenant boundaries may become expensive if community scope is not planned early.

## Open product decisions

- Product name.
- Initial community: CDTM, WHU, or both.
- Controlled public link versus invite-only access.
- Whether a minimum referral bonus is required.
- Whether V0 needs person-specific referral tracking or only job-specific share links.
- The exact interest or conversion event V0 should track.
- Supabase Studio versus a minimal admin review screen.
- Immediate LLM parsing versus manual job entry first.

Business-model questions are tracked in [Business model](../business/business-model.md). Technical decisions are tracked in [Development decisions](../dev/decisions.md).
