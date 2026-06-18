# Gmail Provider Contract (Metadata Tier)

Aligns with `schemas/provider-manifest.schema.json`. Implementation: GMAIL-002B +
GMAIL-HARDEN-001 local adapter hardening.

## Provider id

`gmail`

## Supported capabilities

| Capability | State |
| --- | --- |
| ingress metadata | local CLI pass |
| egress send | blocked |
| egress draft write | blocked until GMAIL-001D |
| labels | local CLI pass |
| search metadata | local CLI pass through metadata-safe label mapping |
| bodies | blocked default; redacted readonly snapshot only after `GMAIL_ACCESS_MODE=readonly` reconnect |

## Method registry

See `docs/providers/gmail/gmail-001b-local-oauth-adapter-plan.md` for the original method
list. Current export commands write snapshots to gitignored files and print summary payloads
by default; full stdout payload requires explicit `--include-payload`.

## Metadata snippet policy

Gmail `snippet` is provider metadata but may contain body fragments. It is permitted only in
gitignored local snapshots and sanitized sample fixtures. It must not be committed as live
proof, pasted into receipts, or printed by default export commands.

## Gate dependency

`GATE-GMAIL-METADATA-001` now passes for the local metadata/read-only adapter. Draft write,
send, mutation, browser OAuth, and broad provider integration remain blocked by separate
gates.
