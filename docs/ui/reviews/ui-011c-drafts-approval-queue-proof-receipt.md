# UI-011C Drafts + Approval Queue Proof Receipt

## Date

2026-06-11

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`1155c91de4755aef95bf101656a87b3767e662d2`

## Scope

Drafts + Approval Queue capability proof per `docs/product/ui-011a-product-capability-gap-matrix.md` (CAP-DRAFT-003/006/008, CAP-MAIL-010, CAP-EVD-003 partial).

## Excluded scope

- UI-011D+ slices
- UI-012 visual polish implementation
- Owner UI-003E visual proof
- PR merge / ready-for-review
- Gmail body read, draft write, send, archive/delete/label mutation
- Provider runtime connect in browser
- Automation execution

## Source matrix references

- CAP-DRAFT-003 Draft status — status chips + object summary
- CAP-DRAFT-006 Batch approval — batch select, preview, approve selected/all
- CAP-DRAFT-008 Pre-send checks — visible checklist in draft detail
- CAP-DRAFT-012 Source thread link — open source thread from draft
- CAP-MAIL-010 Drafts mailbox — first-class drafts view preserved

## Files changed

- `public/inbox-preview.js` — schema v5, drafts/approval UI, batch preview, pre-send checks, receipt linkage
- `public/inbox-preview.css` — draft object, pre-send, batch approval, queue toolbar styles
- `docs/ui/reviews/ui-011c-drafts-approval-queue-proof-receipt.md`
- `TODO.md`
- `docs/product/06-compliance-validation-index.md`

## Product UI code changed

**yes**

## Drafts view result

First-class Drafts mailbox with seeded local examples (compose + reply), list + detail pane, status, approval state, project/account metadata, source thread link, pre-send checks (when queued), post-send consequence preview, Activity/receipt panel.

## Draft detail result

Draft object summary (id, account, status, approval, project, source thread, missing metadata, risk flags), editable form, queue/approve/dequeue/simulate-send actions, blocked send button with explanation.

## Approval Queue result

First-class Approval Queue mailbox listing queued + approved drafts, toolbar with select all/clear, batch selection checkboxes on queued rows.

## Single approval preview result

Selected queued draft shows pre-send checks, shared risks in inspector batch/draft modes, approve-for-send action (local only).

## Batch approval preview result

`renderBatchApprovalPreview` panel with subject list, shared risks, consequence preview, Approve selected / Approve all queued, Send blocked disabled.

## Blocked send state result

Provider send and batch send remain disabled with `is-blocked` styling and Tier 1 copy; simulate send is dry-run only.

## Pre-send checks result

Seven checks: recipients, subject, body, attachments, metadata, tone/safety placeholder, provider send gate (blocked).

## Post-send consequence preview result

Activity/receipt, label/folder move, project tag, task/calendar proposals, follow-up reminder, automation dry-run — preview only via `buildPostSendPlan`.

## Activity/receipt linkage result

Draft receipts stored in `state.drafts.receipts`; draft detail shows recorded + expected receipts; Open Activity navigates to receipts lane.

## Storage result

Canonical key `xiioInbox.preview.state` only. Schema **v5** adds `drafts.batchSelectedIds`. v4→v5 migration preserves existing namespaces.

## schemaVersion

**5**

## localStorage keys used

- `xiioInbox.preview.state` (canonical envelope only)

## UI-011B regression result

Unified/per-account inbox, folders, labels, search, thread list, reading pane, compose, reply, sent/archive/trash/spam views preserved. `npm run check` pass.

## Accessibility result

Draft/approval nav keyboard reachable via existing mail nav; draft rows use `tabindex="0"` + inspector focus; status text in chips (not color-only); blocked send explains why in label/title.

## Keyboard/focus result

Draft list selection via click/focus + Enter/Space on inspector focus; batch checkbox separate from row select; focus-visible styles on draft rows and form fields.

## Safety/egress result

No provider credentials, OAuth tokens, secrets, or real private bodies stored. Send/provider/archive/label mutation blocked.

## Provider/runtime/platform result

No provider connect, runtime, or platform claims. Tier 1 preview only.

## Route smoke result

| Check | Result |
| --- | --- |
| Default app load (`/`) | 200 |
| Served JS markers (batch/pre-send/schema v5) | pass |
| Fixture JSON fetch | 200 same-origin |
| External network requests | **0** |
| Preview server stopped after smoke | yes |

## Same-origin fixture fetch result

`public/data/inbox-events.preview.json` fetched at `127.0.0.1:4488` — pass.

## Remaining blockers

- CAP-DRAFT-010/011 templates/history not in scope
- CAP-DRAFT-013 full Activity→draft drill-down deferred to UI-011H
- Owner UI-003E blocked until UI-011I + UI-012F
- Visual polish blocked until UI-011I + UI-012F

## Next recommended pass

**UI-011D** — Calendar grid proof

## Decision value

```text
UI_011C_PASS_DRAFTS_APPROVAL_READY_FOR_CALENDAR_GRID_REPAIR
```
