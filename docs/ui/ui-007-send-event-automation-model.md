# UI-007 Send-Event Automation Model

## Purpose

Define pre-send and post-send automation, approval queue behavior, receipts, and Tier 1 vs Tier 2 boundaries for the draft-centered spine.

## Send as Event Boundary

```text
draft.approved → draft.send (Tier 2) → message.sent event → downstream fan-out
```

In Tier 1 preview: `draft.send` is **simulated** only. UI shows send-consequence preview and dry-run receipts — never implies provider delivery.

Aligns with Gmail/Microsoft draft→send separation (draft object distinct from sent message).

## Pre-Send Automations (proposals on draft)

| Action | Tier 1 | Tier 2 |
| --- | --- | --- |
| classify / tag / label | local proposal | provider write (gated) |
| attach / link file | local ref + gate state | cloud picker (gated) |
| check tone / missing info / recipients | checklist UI | model/provider (gated) |
| sensitive/legal/safety language | flag + block send proposal | policy engine |
| create approval request | queue entry | workflow runtime |
| schedule send proposal | local queued state | provider schedule |
| create task proposal | local task link | provider sync |
| create calendar hold proposal | local event link | provider sync |

Language: **propose**, **preview**, **dry-run** — not execute.

## Post-Send Automations (react to send event)

| Action | Tier 1 | Tier 2 |
| --- | --- | --- |
| create receipt | local receipt | persisted ledger |
| file copy/link to project | simulated plan | cloud write |
| follow-up task | proposal record | provider sync |
| calendar event | proposal record | provider sync |
| update project status | local metadata | sync |
| notify user | status message | notification service |
| archive thread | local state | provider |
| apply label | local overlay | provider |
| schedule reminder | proposal | provider |

Tier 1: **post-send plan preview** — "would fire if sent."

## Approval Queue Model

| Capability | Requirement |
| --- | --- |
| Single approve | Per-draft approval_state → `approved`; receipt |
| Batch approve | Shared risk summary + per-draft risks visible |
| Blocked send | Disabled with gate reason; no silent fail |
| Send consequence preview | Before approve: list calendar/task/automation/receipt outcomes |

Batch approve is high-risk egress — requires explicit gatekeeper UX and per-draft receipts.

## Receipt Model

Every approve, save, simulate-send, and automation dry-run appends a local receipt:

```text
type: draft | approval | pre_send | post_send_plan | blocked
limitations: Tier 1 preview only; no provider write
```

Receipts do not authorize Tier 2.

## Safety Gates

- `GATE-DRAFT-WORKBENCH-001` — blocks UI-007B until architecture docs complete
- `GATE-LOCAL-OPERABILITY-001` — Tier 1 boundary (pass)
- `GATE-PROVIDER-001`, `GATE-AUTO-EXEC-001`, `GATE-RUNTIME-001` — Tier 2 blocked
- `AI_ASSISTED_SEND = false` — user sends, AI drafts

## Framework Reuse Candidates (`xi-io.net#239`)

- Draft object schema + status enum
- Send-event envelope and fan-out pattern
- Approval queue + batch risk summary component
- Context command rail mode contract
- Pre/post-send automation recipe model

## Decision

```text
UI_007_SEND_EVENT_AUTOMATION_MODEL_DEFINED
```
