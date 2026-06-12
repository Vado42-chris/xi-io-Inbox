# GMAIL-002B Read-Only Body Gate Receipt

## Date

2026-06-12

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`pending`

## Scope

GMAIL-002B read-only Gmail body gate — explicit `gmail.readonly` opt-in, redacted body read/export CLI, preview import, guard tests. No draft write, send, or mutation.

## Excluded scope

- GMAIL-002C draft write
- GMAIL-002D send
- UI-012D visual polish
- ACC-001 account UX
- Browser OAuth
- Owner UI-003E
- PR merge / ready-for-review

## Files changed

- `tools/gmail/lib/body-gate.js`, `body-redaction.js`, `body-snapshot-schema.js`
- `tools/gmail/lib/adapter.js`, `response.js`, `local-data.js`, `cli.js`
- `tools/gmail/test/body-gate.mjs`, `metadata-guards.mjs`
- `public/inbox-preview.js`, `inbox-preview.css`
- `public/data/gmail-body.sample.json`
- `.gitignore`
- docs/receipts, TODO, compliance, plan

## Product UI code changed

**yes** — read-only body snapshot import, status honesty, thread body preview panel

## Metadata default result

**pass** — default `GMAIL_ACCESS_MODE=metadata`; metadata export/commands unchanged

## Read-only scope result

**pass** — `gmail.readonly` only when `GMAIL_ACCESS_MODE=readonly` + reconnect

## Official Gmail scope reference

[Choose Gmail API scopes | Google for Developers](https://developers.google.com/workspace/gmail/api/auth/scopes)

## Restricted scope / verification implication result

**pass** — documented in body-gate status + provider doc

## Command set result

**pass** — body-gate-status, read-message-body, read-thread-bodies, export-readonly-body-snapshot, redact-body-snapshot, blocked escalation

## Body snapshot format result

**pass** — mode `read-only-body`, scopeRequired, redactionStatus, blockedCapabilities

## Redaction result

**pass** — HTML strip, remote URL removal, length cap, forbidden field validation

## Preview import result

**pass** — local/sample import; auto-load local file; Activity receipts

## UI status honesty result

**pass** — distinguishes metadata vs read-only body snapshot; draft/send/mutation blocked

## Activity/receipt linkage result

**pass** — import/missing/clear receipts via account receipt feed

## Missing OAuth fail-closed result

**pass**

## Insufficient scope fail-closed result

**pass** — metadata mode blocks body read with actionable message

## Draft write blocked result

**pass**

## Send blocked result

**pass**

## Provider mutation blocked result

**pass**

## Broad scope blocked result

**pass**

## Tests/checks result

**pass** — `npm run check` includes body-gate + metadata-guards + oauth + wipe tests

## Pass 55 verification result

**unverified**

## Regression result

**pass** — GMAIL-002A/HARDEN metadata path preserved; NAV-001 shell unchanged structurally

## Storage result

`xiioInbox.preview.state` only; body snapshot in module memory

## schemaVersion

**11** (unchanged)

## localStorage keys used

- `xiioInbox.preview.state`

## Safety/egress result

Browser OAuth, draft write, send, mutation blocked

## Route smoke result

**pass** (local) — load, import body sample, blocked honesty

## External network request result

**0** during preview smoke (same-origin JSON only)

## Secrets status

gitignored; unstaged

## PR draft state

**draft**

## Remaining blockers

- Live OAuth readonly body smoke blocked locally (OAuth not configured)
- ACC-001 account organization UX deferred
- Pass 55 unverified

## Next recommended pass

**ACC-001** account/mail organization UX (GitHub taxonomy, accordion mail views)

## Decision value

`GMAIL_002B_PASS_READ_ONLY_BODY_GATE_READY_FOR_ACC_001_OR_UI_012D`
