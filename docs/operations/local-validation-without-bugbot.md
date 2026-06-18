# Local validation without Bugbot

## Core correction

```text
Bugbot is not the build system.
GitHub Actions is the build system.
Local CI-parity commands are the pre-push safety net.
Owner :4488 retest is the UX gate.
```

Do not rely on Cursor Bugbot or GitHub review bots to know whether builds pass. Use local checks plus GitHub Actions directly.

## CI ↔ local parity

| GitHub workflow | Runs on PR when paths match | Local equivalent |
| --- | --- | --- |
| **Static Preview Check** | `public/**`, `scripts/**`, `package.json`, adapter tools | `npm run check` |
| **Tauri Runtime Check** | `src-tauri/**`, runtime scripts | `cargo test --manifest-path src-tauri/Cargo.toml` + `npm run gate:runtime002c` |

First-time setup (once per clone):

```bash
npm ci
npx playwright install chromium
npm ci --prefix tools/gmail
npm ci --prefix tools/gcal
```

## Required validation workflow (`ui-002`)

### 1. After each implementation edit batch

```bash
npm run check:quick
```

### 2. Before push — product UI / static preview

When touching `public/**`, `scripts/**`, `package.json`, or overlay entrypoints:

```text
public/inbox-preview.js
public/inbox-preview.css
public/index.html
public/*owner-mode.js
public/*owner-mode.css
```

Run:

```bash
npm run check
```

### 3. Before push — Tauri / runtime

When touching `src-tauri/**` or runtime gate scripts:

```bash
cargo test --manifest-path src-tauri/Cargo.toml
npm run gate:runtime002c
```

### 4. Slice close / high confidence

```bash
npm run check:full
```

### 5. Docs-only changes

Minimum:

```bash
git diff --check
```

Use `npm run check:quick` if docs changed governance scripts, route docs, generated references, or validation-related files.

## Read CI without Bugbot

```bash
gh pr checks 12
gh run list --branch ui-002/framework-derived-static-preview --limit 6
gh run view <run-id> --log-failed
```

### Record CI exactly

| State | Meaning |
| --- | --- |
| **success** | Proof for that workflow on that SHA |
| **failure** | Blocker — fix before claiming green |
| **cancelled** | No proof — not necessarily failure (often concurrency) |
| **in_progress** | No proof yet |
| **not triggered** | No proof — path filter may not have matched |

Never write **“CI green”** unless `gh pr checks` or `gh run list` confirms **success** on the **current HEAD** for the relevant workflows.

## Owner visual retest (separate gate)

Local and CI validation do **not** replace owner visual proof.

```bash
npm run dev
# http://localhost:4488
```

Current owner retest surfaces (FIX-BATCH-001–004):

- Mail
- Account drawer + Settings → Accounts
- Home
- Ibal drawer

Outcome tokens (owner records):

- `OWNER_RETEST_PASS`
- `OWNER_RETEST_FAIL`
- `OWNER_RETEST_PARTIAL`
- `OWNER_RETEST_BLOCKED`

If fail or partial, record: surface, commit, browser/runtime, what broke, screenshot/reference, suspected cause, next action.

## FIX-BATCH receipt validation block

Every fix-batch receipt must include:

| Section | Content |
| --- | --- |
| Validation (local) | `check:quick`, `check`, `cargo test` / `gate:runtime002c` — pass / fail / not run / N/A |
| CI @ HEAD | Static Preview + Tauri Runtime — success / failure / cancelled / in_progress / not triggered / N/A |
| Owner retest | Checklist + pending / pass / fail |
| Stop lines | Unchanged — no UI-003E, no merge-prep, no export, no provider mutation |
| Decision token | From receipt template only — do not invent |

Distinguish precisely:

```text
landed ≠ locally validated ≠ CI green ≠ owner-ready ≠ owner-passed
```

## PR #12 body update rules

Update only **after** the commit exists on origin:

- Remote HEAD
- Batch status + receipt path
- Decision token
- Validation status (local + CI, honest)
- Owner retest pending

Do **not**: mark ready for review, claim UI-003E PASS, start merge-prep, promote framework export, or enable provider mutation.

## Post-edit hook

`.cursor/hooks/post-edit-reminder.sh` reminds agents after product UI and script edits. See hook for matched paths.

## Agent operating brief (summary)

Branch: `ui-002/framework-derived-static-preview` · PR #12 draft.

- FIX-BATCH-001 Mail, 002 Account, 003 Home, 004 Ibal: **landed** · owner retest pending at `:4488`
- Calendar, Tasks, Automations, Activity, Integrations: **classified** — not passed
- Activity B6: visual classify required
- Integrations: Connect Gmail IA decision required
- Do not start Calendar/Tasks/Activity/Integrations implementation unless explicitly instructed

Stop lines: no UI-003E PASS by agents, no PR ready, no MERGE-PREP, no framework export promotion, no provider send/draft/write/delete/label/archive mutation.

## Related docs

- `docs/operations/branch-truth.md` — branch map and required validation
- `AGENTS.md` — command table and stop lines
- `.github/workflows/static-preview-check.yml`
- `.github/workflows/tauri-runtime-check.yml`
