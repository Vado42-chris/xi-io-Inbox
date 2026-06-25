# UI-PEER-REVIEW-FIX-BATCH-008 — Mail owner folder restoration receipt

## Date

2026-06-19

## Branch

`ui-002/framework-derived-static-preview`

## Classification source

Owner review on `:4488` (2026-06-19) — Mail owner-mode IA regression, not scroll failure.

## Human problem fixed

FIX-BATCH-001 owner Mail UX over-simplified the left rail to Inbox, Unread, Sent, and Archive only. That read as missing mail (no Trash, Spam, Drafts, labels, approvals, or multi-account switcher), not as calm UI. Sync copy also implied manual sync as the primary workflow.

## Implemented owner-mode changes

### FIX-BATCH-008A — folder restoration

| Area | Result |
| --- | --- |
| Core folders | Inbox, Unread, Needs reply, Drafts, Sent, Archive, Trash, Spam |
| Labels | Collapsed group (user labels from snapshot when available) |
| Review work | Collapsed group for Approvals and Draft-linked when present |
| Accounts | Multi-account switcher when more than one account; demo accounts marked · preview |
| Scaffold recovery | `showWorkflowScaffold` path unchanged |

### FIX-BATCH-008B — data-source honesty

| Area | Result |
| --- | --- |
| Preview framing | `Saved snapshot · not live Gmail` — not live inbox decoration |
| Data source panel | Live: No · Source · Account snapshot context · Last imported · Coverage · Live sync unavailable in browser |
| Account top bar | `Saved snapshot` (not Partial import) |
| User burden | Removed primary **Set up sync** in owner mode; **Connect in desktop app** for live path |
| Manual action | `Refresh now` (repair), not primary `Sync now` |
| Desktop connected | `Connected · last synced … · background refresh on`; connect triggers initial sync in Tauri |
| Reading pane | Saved snapshot / not live Gmail honesty |

## Product principles locked

```text
Calm does not mean hiding the user's mailbox.
Event-based does not mean making the user press Sync.
Account identity, data freshness, and sync capability must always agree.
```

## Files changed (Group A — this commit)

| Path | Change |
| --- | --- |
| `public/inbox-preview.js` | 008A folder nav + 008B data-source panel, snapshot context, Refresh now, desktop connect action |
| `public/inbox-preview.css` | Owner nav groups, data-source panel, account switcher styles |
| `docs/ui/reviews/shell-layout-001-owner-scroll-proof-packet.md` | DEFER note pending Mail restoration + scroll rerun |
| `docs/ui/reviews/peer-review/UI-PEER-REVIEW-FIX-BATCH-008-mail-owner-folder-restore-receipt.md` | This receipt |

## Excluded scope

- Live provider sync / Gmail Pub/Sub push
- Activity B6 classify
- Integrations IA (#21–#25 unblock)
- UI-003E PASS claim
- Full noisy scaffold restoration

## Owner retest result (2026-06-19)

```text
MAIL_OWNER_RETEST: PASS
Mode: :4488 owner mode · workflow scaffold off
Gate: headless Playwright checklist (saved snapshot honesty + folder structure)
```

Checklist passed: saved snapshot framing, Live: No, source/freshness/coverage, no Set up sync burden, Connect in desktop app, folders Inbox–Spam, Labels collapsed group, reading pane honesty.

## Validation

| Command | Result |
| --- | --- |
| `npm run check:quick` | pass |
| `npm run check` | pass (pre-commit) |
| Playwright Mail owner gate `:4488` | pass (19/19 checklist items) |

## Stop lines unchanged

- UI-003E PASS is not claimed.
- PR #12 remains draft.
- MERGE-PREP-001 remains blocked.
- Activity B6 remains blocked until shell scroll proof reruns after this batch.
- Provider mutation and live ingress event bus remain out of scope.

## Decision value

```text
UI_PEER_REVIEW_FIX_BATCH_008_PASS_MAIL_OWNER_RETEST_COMPLETE_READY_FOR_SHELL_SCROLL_RERUN
```

## Related planned slice (docs only)

`SLICE-RUNTIME-INGRESS-EVENT-001` — connect/full sync → historyId incremental sync → local event bus → UI refresh; Gmail Pub/Sub push as later optimization.
