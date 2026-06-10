# Gmail Provider Contract (Metadata Tier)

Aligns with `schemas/provider-manifest.schema.json`. Implementation: GMAIL-001C.

## Provider id

`gmail`

## Supported capabilities (GMAIL-001C target)

| Capability | State |
| --- | --- |
| ingress metadata | planned |
| egress send | blocked |
| egress draft write | blocked until GMAIL-001D |
| labels | planned |
| search metadata | planned |
| bodies | blocked default |

## Method registry

See `docs/providers/gmail/gmail-001b-local-oauth-adapter-plan.md` for full method list and output shape.

## Gate dependency

`GATE-GMAIL-METADATA-001` must pass before implementation.
