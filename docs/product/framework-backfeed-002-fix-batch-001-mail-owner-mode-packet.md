# FRAMEWORK-BACKFEED-002 — FIX-BATCH-001 Mail Owner-Mode Packet

## Date

2026-06-17

## Direction

Two-way freshness record:

1. Out: Mail owner-mode cleanup patterns are recorded for `xi-io.net#239` export planning.
2. In: Framework consumer obligations are unchanged. Inbox still uses an adapted-copy path until a stable export/import path exists.

## Source consumer state

```text
Repo: Vado42-chris/xi-io-Inbox
Branch: ui-002/framework-derived-static-preview
PR: #12 (draft, unmerged)
Remote HEAD: 8fb8c319ba3a534225d303b94fb8be83ae9d078b
Implementation batch: 7c9fda054852d2cb3f3da33df6408d71e270145e
Framework issue: Vado42-chris/xi-io.net#239
```

## Source evidence

| Artifact | Purpose |
| --- | --- |
| `docs/ui/reviews/peer-review/UI-PEER-REVIEW-FIX-BATCH-001-mail-owner-mode-receipt.md` | Canonical Inbox receipt for Mail owner-mode cleanup. |
| `docs/ui/reviews/peer-review/owner-vs-scaffold-mode.md` | Owner/scaffold mode distinction. |
| `docs/ui/reviews/peer-review/UI-PEER-REVIEW-GLOBAL-FINDINGS.md` | Shared peer-review findings driving the batch. |
| PR #12 body | Current branch truth, HEAD, validation summary, and blocked gates. |

## Classification

Owner-mode Mail pattern evidence only.

This packet does not mark UI-003E PASS, does not mark PR #12 ready for review, does not start merge-prep, does not promote a framework export, and does not authorize send/draft/provider mutation.

## Patterns offered to `xi-io.net#239`

| Pattern | Inbox proof | Candidate framework note |
| --- | --- | --- |
| Owner-vs-scaffold split | `OWNER_MAIL_UX = true`; full scaffold mode restored through `state.settings.userPrefs.showWorkflowScaffold = true` | Future consumer surfaces may separate owner-simple review mode from agent/scaffold inspection mode. |
| Setup guide reduction | Single setup guide when action is needed; no CLI instructions in primary owner copy | Provider setup surfaces should begin with owner-language, not operator commands. |
| Message-first Mail reading pane | Snippet/body preview first; metadata and blocked details demoted to Advanced | Workbench detail panes should present user-meaningful content before audit metadata. |
| Slim inspector rail | Hidden when idle; thread-only action rail when a thread is selected | Context rails should reduce idle noise and follow object selection. |
| Owner thread rows | Single-column rows with unread dot | Mail list density should read like an owner-facing inbox, not a fixture/debug table. |
| Activity table overflow hardening | Shared ledger component text overflow fix | Receipt/ledger tables require text containment before shared component promotion. |

## Explicitly withheld

| Withheld item | Reason |
| --- | --- |
| UI-003E owner visual PASS | Owner-only gate not passed. |
| Merge-prep | Blocked until UI-003E PASS. |
| PR #12 ready-for-review | Blocked until owner direction after UI-003E. |
| Framework export promotion | `xi-io.net#239` still decides package/static export/pattern-library path. |
| Scroll closure | CSS is present, but owner retest at `npm run dev` → `:4488` is still required. |
| Live Gmail proof | Separate Tauri runtime proof only: `npm run tauri:dev`, then Connect + Sync. |
| Runtime refresh Gmail calls | The 60s refresh loop re-reads the local index only. Gmail calls require Sync/history sync. |
| Provider send/draft/delete/label/archive mutation | Still blocked by product gate. |

## Validation state

FIX-BATCH-001 receipt records:

- `npm run check:quick` pass
- `npm run check` pass
- `npm run check:runtime002a` pass
- `npm run check:runtime001` pass
- `cargo test --manifest-path src-tauri/Cargo.toml` pass
- `cargo build --manifest-path src-tauri/Cargo.toml` pass
- `git diff --check` pass

Known documentation gap: the receipt does not list `gate:runtime002c` as a validation row. Branch/CI context records the runtime gate availability, but this packet does not amend the original receipt.

## Framework-side updates

- `xi-io.net` `docs/framework/inbox-ui-consumer-freshness-note.md` updated with June 17 FIX-BATCH-001 freshness addendum.
- `xi-io.net` `docs/reviews/inbox-consumer-backfeed-002-fix-batch-001-freshness-receipt.md` created.
- `xi-io.net#239` commented with owner-mode Mail pattern summary.

## Next consumer batch

`UI-PEER-REVIEW-FIX-BATCH-002` — Account drawer owner-mode cleanup.

Do not redo FIX-BATCH-001 unless owner retest finds a specific regression such as column scroll failure or stale data display.

## Decision value

`FRAMEWORK_BACKFEED_002_FIX_BATCH_001_MAIL_OWNER_MODE_PACKET_RECORDED_2026_06_17`
