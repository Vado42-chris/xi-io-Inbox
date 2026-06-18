# MAIL-001 Mail Workspace IA Template Repair Receipt

## Date

2026-06-13

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

*(uncommitted at receipt write — run `git rev-parse HEAD` after commit)*

## Scope

MAIL-001 — Mail workspace IA and responsive template repair after real metadata import exposed unreadable thread list and empty metadata reading pane.

## Excluded scope

UI-012D · GMAIL-002C · GMAIL-002D · owner proof · merge prep · Gmail mutation · committed real bodies

## Source feedback

Owner screenshot + ChatGPT peer review: metadata honest but mail workspace structurally unacceptable.

## Files changed

- `public/inbox-preview.js` — account accordion, compact thread rows, metadata reading pane, rail compact mode
- `public/inbox-preview.css` — MAIL-001 layout/template block
- `scripts/mail-001-model-check.mjs`
- `package.json` — `check:mail`
- `docs/product/mail-001-mail-workspace-ia-template-repair.md`
- `docs/ui/reviews/mail-001-mail-workspace-ia-template-repair-receipt.md`
- `TODO.md`, sprint/governance sequencing updates

## Product UI code changed

**yes**

## Results summary

| Area | Result |
| --- | --- |
| Column model | pass — nav · list · reading · compact rail |
| Account accordion | pass — per-account mailboxes + labels group |
| Thread rows | pass — compact `mail-thread-row` list |
| Metadata reading pane | pass — body-unavailable banner + actions |
| Fixture vs snapshot | pass — source chips; snapshot account auto-filter |
| Responsive | pass — breakpoints 1280/980 |
| Ibal/action rail | pass — `is-rail-compact` when no selection |
| Gates | pass — draft/send/mutation blocked |

## Storage

- schemaVersion: **11** (unchanged)
- localStorage: `xiioInbox.preview.state` only

## Validation

| Check | Result |
| --- | --- |
| `npm run check` | pass |
| `git diff --check` | pass |
| Route smoke | manual — reload Mail with local metadata file |

## PR draft state

**draft**

## Decision value

`MAIL_001_PASS_MAIL_WORKSPACE_READY_FOR_LIVE_PROOF_OR_UI_012D`

## Next recommended pass

Owner **UI-003E** mail workspace glance (see `ui-003e-owner-visual-proof-packet.md`). UI-012D–F complete.

## Remaining estimate to merge-ready

**~1 agent pass** after owner UI-003E PASS (operator push + merge prep).
