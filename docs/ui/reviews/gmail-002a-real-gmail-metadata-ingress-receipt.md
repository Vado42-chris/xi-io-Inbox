# GMAIL-002A Real Gmail Metadata Ingress Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`pending`

## Scope

GMAIL-002A real Gmail metadata ingress bridge — extend local CLI adapter, metadata snapshot export/import, preview status honesty, Activity linkage. Metadata-only; no body read, draft write, or send.

## Excluded scope

- GMAIL-002B body read
- GMAIL-002C draft write
- GMAIL-002D send
- UI-012D visual polish
- Browser OAuth / token storage
- Owner UI-003E
- PR #12 merge or ready-for-review

## Files changed

- `tools/gmail/lib/adapter.js` — metadata commands, snapshot export, expanded blocked methods
- `tools/gmail/cli.js` — list-threads, list-messages, thread-metadata, export-metadata-snapshot
- `tools/gmail/test/metadata-guards.mjs` — fail-closed guard tests
- `tools/gmail/package.json` — check + export script
- `public/inbox-preview.js` — metadata snapshot import, UI status, Activity linkage
- `public/data/gmail-metadata.sample.json` — sanitized sample snapshot
- `.gitignore` — `public/data/gmail-metadata.local.json`
- `package.json` — `check:gmail`
- `docs/product/gmail-002-real-email-ingress-plan.md`
- `docs/providers/gmail/gmail-002a-metadata-bridge.md`
- `docs/product/03-sprint-slice-plan.md`
- `docs/product/06-compliance-validation-index.md`
- `TODO.md`

## Product UI code changed

**yes** (metadata import gate + status honesty; no schemaVersion change)

## Adapter verification result

**pass** — OAuth client `secrets/gmail-oauth-client.json` (gitignored); tokens `tools/gmail/data/token.json` (gitignored); scopes `openid`, `email`, `gmail.metadata` only; bodies/send/draft write blocked.

## OAuth/secrets path result

**pass** — secrets gitignored; tokens not in repo/browser localStorage. Local OAuth **not configured** on validation machine (`secretsConfigured: false`, `connected: false`).

## Scope result

**pass** — `gmail.metadata` only per [Google Gmail API scopes](https://developers.google.com/workspace/gmail/api/auth/scopes). No `gmail.readonly`, `gmail.compose`, `gmail.send`, or `mail.google.com`.

## Official Gmail scope reference

[Choose Gmail API scopes | Google for Developers](https://developers.google.com/workspace/gmail/api/auth/scopes)

## Command set result

**pass** — profile, labels/list-labels, labels-counts, list-threads, list-messages, search-metadata, thread-metadata, drafts-metadata, export-metadata-snapshot, blocked escalation.

## Metadata snapshot format result

**pass** — documented fields: accountEmail, generatedAt, source, mode, labels, counts, threads, messages, warnings, blockedCapabilities. Bodies/tokens/raw payloads excluded.

## Preview import result

**pass** — Import via Settings → Accounts → Import metadata snapshot; reads `gmail-metadata.local.json` (gitignored) then `gmail-metadata.sample.json`. Auto-load local file on init when present. Module memory only (no new localStorage keys).

## UI status honesty result

**pass** — Distinguishes fixture preview, metadata snapshot/sample, browser not connected, body/draft/send blocked via env badge and account status strings.

## Activity/receipt linkage result

**pass** — Account receipts for import/missing/clear mapped into unified Activity feed with provider gate labels.

## Body read blocked result

**pass** — `node cli.js blocked gmail.messages.getBody` → blocked:true

## Draft write blocked result

**pass** — `node cli.js blocked gmail.drafts.send` → blocked:true

## Send blocked result

**pass** — `node cli.js blocked gmail.users.messages.send` → blocked:true

## Provider mutation blocked result

**pass** — modify/trash/draft create/update methods in BLOCKED_METHODS set

## Redaction result

**pass** — snapshot schema excludes bodies, attachments, raw payloads, tokens; sample uses synthetic addresses only

## Tests/checks result

**pass** — `tools/gmail/test/metadata-guards.mjs`; `npm run check` includes `check:gmail`

## Pass 55 verification result

**unverified** — no repo artifact matching "Pass 55" or "bounded metadata alignment" (only noted in `nav-001-self-peer-review.md`)

## Regression result (NAV-001, UI-011B–I, UI-012A–C)

**pass** — NAV-001 top nav/contextual rail smoke; mail workbench preserved; fixture threads used when no snapshot loaded

## Storage result

Canonical key unchanged: `xiioInbox.preview.state` only. Metadata snapshot not persisted in localStorage.

## schemaVersion

**11** (unchanged)

## localStorage keys used

- `xiioInbox.preview.state` (canonical)
- Migration read-only: `xiioInbox.preview.ui005b`, legacy `xiio-inbox-preview-state-v2`

## Safety/egress result

Body read, draft write, send, provider mutation, browser OAuth remain blocked.

## Route smoke result

**pass** — load, nav, metadata import, blocked honesty, external requests 0

## External network request result

**0** during preview smoke (same-origin JSON fetches only)

## secrets status

`secrets/` gitignored and unstaged. OAuth/token files not staged.

## PR draft state

PR #12 remains **draft**

## Remaining blockers

- Live OAuth metadata export smoke blocked locally (OAuth not configured)
- GMAIL-002B body read gate not started
- UI-012D–F polish paused
- Owner UI-003E blocked until UI-012F

## Next recommended pass

**GMAIL-002B** read-only body gate if owner prioritizes real-mail capability; otherwise **UI-012D** interaction polish.

## Decision value

`GMAIL_002A_PASS_METADATA_INGRESS_READY_FOR_BODY_READ_GATE_OR_UI_012D`
