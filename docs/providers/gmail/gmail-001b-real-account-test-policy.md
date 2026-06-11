# GMAIL-001B: Real Account Test Policy

## Owner decisions (2026-06-10)

1. Real Gmail account testing is **required** to find real product failure points.
2. First stage is **read-only metadata inventory** — not write/send.
3. Fake fixture account UX must stop; honest connect flow comes with adapter.

## Allowed stages

| Stage | Real primary account? | Allowed | Blocked |
| --- | --- | --- | --- |
| GMAIL-001B | N/A (plan only) | docs, adapter contract | OAuth, API calls |
| GMAIL-001C metadata spike | Yes, after owner approval | identity, labels, counts, metadata samples | bodies, draft write, send |
| Read-only search audit | Yes, explicit queries | subject/snippet/date/label metadata | bulk body export |
| Draft inventory | Yes | draft metadata, counts | draft overwrite |
| GMAIL-001D draft write spike | Maybe after gate | create/update draft only | send |
| Send smoke | Later, explicit approval | one controlled test | batch send |

## Account rules

- Owner may use real primary Gmail for **metadata inventory** after GATE-GMAIL-METADATA-001 passes and owner approves the run.
- Owner may **not** use real primary Gmail for draft write-scope smoke until **GMAIL-001D** draft-write gate passes and token storage is proven.
- First write-scope test should use **throwaway/test Gmail** unless owner explicitly overrides.
- Send tests require **separate explicit owner approval** and a dedicated send gate.
- Bulk historical mining requires a separate query plan and redaction policy.
- Legal/divorce-sensitive or family-sensitive searches require separate evidence handling — not default automation.

## Operator preflight (before any real API call)

- [ ] GATE-GMAIL-METADATA-001 pass
- [ ] OAuth client credentials in `secrets/` only (gitignored)
- [ ] Adapter wipe command tested
- [ ] Redaction policy acknowledged
- [ ] No bodies by default
- [ ] Receipt path does not log tokens or private content

## Forbidden in all passes until explicit gate

- `gmail.compose` scope on primary account
- `gmail.modify` scope
- `mail.google.com` scope
- Storing tokens in localStorage, repo, fixtures, docs, screenshots, logs
- Committing private message content
