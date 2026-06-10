# UI-007 Draft Workbench Architecture

## Purpose

Define the draft-centered product spine that supersedes lane-as-destination navigation. Docs-only architecture for UI-007B+ implementation.

## Owner Clarification (2026-06-10)

The received email is an **input**. The **draft email** is the working artifact. **Send** is the event boundary. Calendar, Tasks, Automations, Receipts, files, labels, folders, and projects are **capabilities** triggered from draft lifecycle — not equal destination pages.

## Current Weakness (Lane-Centered)

Primary nav treats Inbox, Calendar, Tasks, Automations, Extensions, Settings as peer destinations. Drafts live as side effects (`composeDraft`, `replyDrafts`) inside Inbox. Right rail (`renderInspector`) shows evidence copy, not contextual commands. UI-006 fixed progressive disclosure per lane but not draft-first workflow.

## Draft-Centered Spine

```text
Ingress → classify → create draft → edit → attach/link → tag/label/folder/project
→ pre-send checks → approval queue → send (Tier 2) → post-send events → receipt ledger
```

Aligns with `docs/product/invariants.md`: Ingress → Analysis → Controlled Egress → Receipt.

## Core Objects

| Object | Role |
| --- | --- |
| Incoming thread | Source context for drafts |
| Draft email | Primary controllable work artifact |
| Approval queue entry | Draft ready for human send decision |
| Send event | Ledger boundary; fans out downstream proposals/events |
| Receipt | Audit record per confirmed or simulated action |

## Required Primary Views

| View | Purpose |
| --- | --- |
| Inbox | Source threads and messages |
| Drafts | All draft emails needing work |
| Approval Queue | One-by-one or batch approve-before-send |
| Sent Events / Receipts | Sent mail and downstream event ledger |
| Automations | Pre-send and post-send recipes |
| Files | Cloud storage, attachments (gated) |
| Projects / Labels | User organization metadata |
| Calendar / Tasks | Outcomes linked to drafts/send (not primary nav spine) |

## Recommended Shell

```text
Left:   accounts, folders, labels, projects, smart views
Center: message/draft/approval/sent lists
Main:   reading pane OR draft editor
Right:  contextual command rail (stage-aware)
```

Reuse UI-006 `lane-workspace` list/detail/modal patterns inside the mail workbench.

## Right Rail Modes

| Mode | Selected object | Rail answers |
| --- | --- | --- |
| thread | incoming thread | summarize, classify, draft reply, task/calendar proposals |
| draft | single draft | approval status, pre-send checks, attachments, labels, send consequences |
| batch | approval selection | batch approve, shared risks, missing metadata |
| sent | sent message | receipt, follow-ups, automation results |
| file | attachment/cloud ref | source, attach, relink (gated) |
| project | project/label | related drafts, sent, files, tasks |

Rail must be **command-oriented**. Evidence/details collapse into `<details>` — not primary copy.

## Draft Object Model (Tier 1 schema target)

```text
draft_id, source_thread_id, account_id, project_id, labels[], folder_id,
recipients[], subject, body, attachments[], source_files[],
status, approval_state, risk_flags[], pre_send_checks[],
post_send_automation_plan[], calendar_events[], task_links[], receipts[],
created_by, updated_by, created_at, updated_at, sent_at
```

## Status Model

```text
drafting | needs_review | approved | queued | sent | blocked | archived | reusable_template
```

## Storage (UI-007B+)

Canonical key: `xiioInbox.preview.state` (schemaVersion 3 — `drafts` namespace shipped in UI-007B-R2).

Allowed new namespaces: `drafts`, `approvalQueue`, `sentEvents` (shipped UI-007C), `files`, `projects` (UI-007D).

Forbidden in storage: credentials, tokens, secrets, real private bodies, runtime provider IDs, provider file contents.

## Preserving UI-005 and UI-006

| Keep | Re-center |
| --- | --- |
| Tier 1/Tier 2 contract, egress blocks, receipts | Nav: mail workbench primary |
| UI-005B compose/reply local drafts | Promote to `drafts` namespace + Drafts view |
| UI-006 list/detail/modal workspaces | Apply inside Inbox/Drafts/Approval Queue |
| Ibal concierge (not nav lane) | Proposals into right rail |
| Automations dry-run | Wire to `pre_send` / `post_send` on draft |
| Calendar/Tasks local proposals | Link from draft, not orphan lanes |

Do **not** discard lane code; demote lanes to outcome/history views or contextual panels.

## Acceptance Before UI-007B

- [x] UI-007A state reconciliation receipt
- [x] This architecture doc
- [x] `ui-007-send-event-automation-model.md`
- [x] `GATE-DRAFT-WORKBENCH-001` documented
- [ ] Operator push of UI-006 commits (GitHub truth)
- [ ] Owner UI-003E re-review (optional parallel; does not block UI-007B docs gate)

## Decision

```text
UI_007_DRAFT_WORKBENCH_ARCHITECTURE_DEFINED
```
