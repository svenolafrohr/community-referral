# Community Referral knowledge base

This directory is the single source of durable product and project knowledge for the repository.

## Chapters

| Chapter | Covers | Start here |
| --- | --- | --- |
| Product | Vision, users, scope, journeys, validation, risks, and roadmap context | [Product](product/README.md) |
| Business | Business-model hypotheses, pricing questions, and go-to-market | [Business](business/README.md) |
| Design | Experience principles, required surfaces, content, and interaction guidance | [Design](design/README.md) |
| Development | Architecture, engineering decisions, contracts, and runbooks | [Development](dev/README.md) |

See [Sources](sources.md) for the external material from which the initial knowledge base was synthesized.

## How this structure scales

- Each chapter owns an index named `README.md`.
- Add one Markdown file per durable topic instead of growing a single catch-all document.
- Add subdirectories only after a topic has multiple documents, for example `product/research/`, `design/patterns/`, or `dev/runbooks/`.
- Link every new document from its chapter index.
- Keep implementation-specific facts in `dev/`; keep the user need and expected behavior in `product/` or `design/`.

## Document states

Use a short metadata block when status matters:

```markdown
**Status:** Proposed | Accepted | Superseded
**Last reviewed:** YYYY-MM-DD
**Sources:** Links to evidence
```

- **Proposed** means the content is a hypothesis or recommendation.
- **Accepted** means it currently guides the product or implementation.
- **Superseded** means it is retained for history and links to its replacement.

## Writing conventions

- Use Markdown for every document.
- Distinguish facts, decisions, hypotheses, and open questions.
- Link to primary sources and record when time-sensitive information was reviewed.
- Update documentation in the same change as the behavior it describes.
- Never include secrets or real candidate data.
