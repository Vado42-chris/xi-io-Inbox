# GMAIL-001B: Redaction And Fixture Policy

## Purpose

Define how real Gmail metadata may inform development **without** committing private data.

## Allowed in committed fixtures and docs

- synthetic label names (e.g. `label-work-ops-a`)
- synthetic account display name (e.g. `Account A`)
- synthetic thread and draft IDs
- redacted counts (ranges or rounded: `~14k inbox`, `140 drafts`)
- generalized categories (`system`, `user`, `nested`)
- manually owner-approved safe sample text (explicit sign-off)

## Forbidden in committed fixtures and docs

- real message bodies
- real sender/recipient addresses (unless explicitly approved for a named test artifact)
- real OAuth client secrets, refresh tokens, access tokens
- attachments or attachment paths
- legal/divorce-sensitive content
- private family content
- provider message IDs, thread IDs, draft IDs from live account
- unredacted label names when sensitive (work, legal, health, family)
- screenshots containing real inbox content

## Metadata → fixture pipeline

```text
Live metadata (local only)
  → classify (system/user/custom)
  → redact identifiers
  → generalize counts
  → owner review
  → synthetic fixture entry (if approved)
```

## Classification tags

| Tag | Meaning |
| --- | --- |
| `metadata_redacted` | Safe for receipts; no PII |
| `metadata_sensitive` | Local only; never commit |
| `body_blocked` | Body never fetched |
| `identity_provider` | From profile API; do not commit email unless approved |

## Wipe triggers

User or operator must run `provider.wipeLocalData` when:

- spike complete
- token compromise suspected
- switching test accounts
- before sharing machine or screenshot session
