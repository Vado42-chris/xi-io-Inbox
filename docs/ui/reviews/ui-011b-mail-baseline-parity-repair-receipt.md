# UI-011B Mail Baseline Parity Repair Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Interrupted-agent recovery

| Field | Result |
| --- | --- |
| Failure | `Error: T: WritableIterable is closed` (agent stream; not repo code) |
| Recovery patch | `/tmp/xi-io-inbox-recovery/ui-011b-interrupted-working-tree.patch` (878 lines) |
| Status snapshot | `/tmp/xi-io-inbox-recovery/ui-011b-status.txt` |
| JSON check | `/tmp/xi-io-inbox-recovery/inbox-events-json-check.txt` — pass |
| Partial edits | **Preserved** — expected files only; validation passed |
| Recovery decision | `UI_011B_RECOVERY_PASS_CONTINUED_AND_COMPLETED` |

## Commit SHA

`d270be3636ec7d7ca3d3bbdc567387305de0e506`

## Scope

Mail baseline parity repair per `docs/product/ui-011a-product-capability-gap-matrix.md` CAP-MAIL-* items.

## Excluded scope

- UI-011C+ slices
- Owner UI-003E visual proof
- PR merge / ready-for-review
- Gmail body read, draft write, send, archive/delete/label mutation
- Provider runtime connect in browser

## Files changed

- `public/inbox-preview.js` — schema v4, mail nav, search, filters, reading pane
- `public/inbox-preview.css` — mail baseline styles
- `public/data/inbox-events.preview.json` — folders, labels, sent/archive/trash/spam fixtures
- `TODO.md`
- `docs/ui/reviews/ui-011b-mail-baseline-parity-repair-receipt.md`

## Results

| Area | Result |
| --- | --- |
| Product UI code changed | **yes** |
| Unified inbox | All inboxes nav |
| Per-account inbox | Account filter + demo/queued states |
| Folders / Labels | Interactive filters |
| Search | Local fixture search + clear |
| Sent / Archive / Trash / Spam | Views + fixture threads |
| Drafts / Approval queue | Preserved |
| Compose / Reply | Preserved |
| Attachments | Indicator + disclosure |
| Activity linkage | Toolbar + reading pane |
| Gmail/provider boundary | Demo accounts; no false connected |
| Canonical storage | `xiioInbox.preview.state` schema **v4** |
| Secrets tracked | **no** |

## Validation

| Check | Result |
| --- | --- |
| `npm run check` | pass |
| `git diff --check` | pass |
| JSON (`python3 -m json.tool`) | pass |
| Route smoke (same-origin) | index/js/json **200**; external network **0** |
| PR #12 draft | yes |

## Provider / runtime / send

Gmail connected in product: **no**. Send/body read/draft write: **blocked**.

## Next pass

**UI-011C** — Drafts + Approval Queue proof

## Decision value

```text
UI_011B_PASS_MAIL_BASELINE_READY_FOR_DRAFT_APPROVAL_REPAIR
```
