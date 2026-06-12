# GMAIL-002A-HARDEN Metadata Adapter Hardening Receipt

## Date

2026-06-12

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`f4749babd4f88b86d7637985d43ceb58ec033e62`

## Scope

GMAIL-002A-HARDEN — Bugbot/CI adapter hardening for metadata-only Gmail ingress: CI dependency install verification, fail-closed local check behavior, OAuth state/callback/timeout hardening, complete local wipe, expanded guard tests, documentation/compliance alignment.

## Excluded scope

- GMAIL-002B body read
- GMAIL-002C draft write
- GMAIL-002D send
- UI-012D–F visual polish
- Mail account accordion / GitHub provider UX (deferred; see recommendation)
- Browser OAuth / token storage in preview
- Owner UI-003E
- PR #12 merge or ready-for-review

## Files changed

- `tools/gmail/lib/adapter.js` — OAuth state, loopback port alignment, timeout, wipe integration, snapshot validation
- `tools/gmail/lib/oauth-loopback.js` — state generation/validation, redirect parsing, timeout message
- `tools/gmail/lib/local-data.js` — complete local wipe (token, snapshot, receipts, data files)
- `tools/gmail/lib/snapshot-schema.js` — metadata snapshot validation
- `tools/gmail/scripts/ensure-deps.mjs` — fail-closed dependency check
- `tools/gmail/test/metadata-guards.mjs` — expanded blocked methods + snapshot validation
- `tools/gmail/test/oauth-hardening.mjs` — OAuth helper tests
- `tools/gmail/test/wipe-local-data.mjs` — wipe dry-run/live tests
- `tools/gmail/cli.js` — `wipe --dry-run`
- `tools/gmail/package.json` — expanded check script
- `package.json` — `setup:gmail`; `check:gmail` fail-closed (no auto-install)
- `.github/workflows/static-preview-check.yml` — verified explicit `npm ci` in tools/gmail
- `docs/product/gmail-002-real-email-ingress-plan.md`
- `docs/providers/gmail/gmail-002a-metadata-bridge.md`
- `docs/product/03-sprint-slice-plan.md`
- `docs/product/06-compliance-validation-index.md`
- `TODO.md`

## Product UI code changed

**no**

## CI dependency result

**pass** — workflow runs `npm ci` in `tools/gmail` before root `npm run check`; paths include `tools/gmail/**`, `package.json`, workflow file.

## check:gmail behavior result

**pass** — option A adopted: `check:gmail` fails closed with `Run from repo root: npm run setup:gmail` when `node_modules` missing. CI installs explicitly; no hidden network install during check.

## OAuth state result

**pass** — connect flow generates random `state`, validates on callback, rejects missing/mismatched state with 403 and closes server.

## OAuth callback/port result

**pass** — callback host/port/path derived from OAuth client redirect URI; warns when `GMAIL_OAUTH_PORT` env differs from redirect URI port.

## OAuth timeout result

**pass** — default 300s (`GMAIL_OAUTH_TIMEOUT_MS` override); timeout closes server and rejects with actionable message (client JSON path, redirect URI, browser approval).

## Local wipe completeness result

**pass** — `wipe` removes token, metadata snapshot, receipt files, and other generated files under `tools/gmail/data` and `tools/gmail/receipts`; `--dry-run` supported. `disconnect` removes token only.

## Blocked command result

**pass** — body read, draft write, send, modify, trash, delete blocked via `BLOCKED_METHODS` and CLI `blocked` command.

## Metadata guard test result

**pass** — tests cover blocked methods, snapshot forbidden fields, sample snapshot validation, OAuth state helpers, wipe dry-run/live.

## Documentation alignment result

**pass** — plan, provider bridge doc, sprint plan, TODO, and compliance index updated for hardening pass and GMAIL-002B gate.

## Compliance index result

**pass** — added/updated rows for CI nested install, OAuth state, OAuth timeout, wipe completeness; Pass 55 remains unverified.

## Pass 55 verification result

**unverified** — no repo artifact matching "Pass 55" or "bounded metadata alignment".

## Body read blocked result

**pass**

## Draft write blocked result

**pass**

## Send blocked result

**pass**

## Broad scope blocked result

**pass** — `gmail.metadata` only; no `gmail.readonly`, `gmail.compose`, `gmail.send`, or `mail.google.com`.

## Secrets status

`secrets/` gitignored and unstaged. OAuth/token files not staged.

## Generated data ignore result

**pass** — `tools/gmail/data/`, `tools/gmail/receipts/`, `node_modules/` gitignored.

## schemaVersion

**11** (unchanged)

## localStorage keys used

- `xiioInbox.preview.state` (canonical; unchanged)

## npm run check result

**pass**

## git diff --check result

**pass**

## Gmail CLI checks result

- status: fail-closed (`secretsConfigured: false`, `connected: false`)
- wipe `--dry-run`: pass
- blocked body/draft/send: pass
- guard tests: pass

OAuth not configured locally; live metadata smoke blocked.

## CI status if available

Static Preview Check expected to pass on push (local validation pass).

## PR draft state

PR #12 remains **draft**

## Remaining blockers

- Live OAuth connect/export smoke blocked locally (OAuth not configured)
- Mail account accordion / multi-account UX not implemented (deferred)
- GitHub integration provider taxonomy not implemented (deferred)
- GMAIL-002B not started
- Owner UI-003E blocked until UI-012F

## Next recommended pass

**GMAIL-002B** read-only body gate unless owner explicitly chooses **UI-012D** or **ACC-001** (account organization + integration provider UX) first.

## Decision value

`GMAIL_002A_HARDEN_PASS_READY_FOR_GMAIL_002B_OR_UI_012D`
