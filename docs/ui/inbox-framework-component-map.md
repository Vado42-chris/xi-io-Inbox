# Inbox Framework Component Map

## Purpose

Map mature `xi-io.net` framework UI patterns to future `xi-io Inbox` runtime surfaces.

## Source components

| Framework source | Relevant exports/patterns | Inbox use |
| --- | --- | --- |
| `public/workbench-event-components.js` | `renderLeftRail`, `renderStream`, `renderContextPanel`, `renderEventCard`, `renderEventChain`, `renderEvidence`, `renderClaims`, `renderClosureCriteria`, `renderActions`, status pills | Primary Inbox shell pattern. |
| `public/workbench-event-runtime.js` | runtime state, view filters, selected event, keyboard selection, local UI state persistence | Inbox event stream runtime pattern. |
| `public/github-management-components.js` | warning banner, summary cards, project rail, repo status, PR cards, warnings/gates, next safe action, invariant panel | Inbox account/provider health and safe-action panels. |

## Inbox surface map

| Inbox surface | Framework pattern to reuse/adapt | Notes |
| --- | --- | --- |
| Account/provider rail | Workbench left rail / GitHub project rail | Accounts replace projects; provider health replaces repo health. |
| Inbox stream | Workbench event stream | Messages, threads, proposals, exports, provider events become stream items. |
| Thread card | Workbench event card | Thread/message metadata plus lifecycle, risk, privacy, AI status. |
| Thread chain | Workbench event chain | Thread timeline, follow-ups, replies, exports, decisions. |
| Selected thread context | Workbench context panel | Show summary, participants, evidence, source refs, attachments, draft state. |
| Evidence/source refs | Workbench evidence panel | Message IDs, thread refs, attachment refs, provider refs. |
| Draft-only egress panel | Workbench actions panel | Actions must remain preview-safe unless user confirms. |
| Claims checked | Workbench claims checked panel | AI assertions and extracted facts should be inspectable. |
| Closure criteria | Workbench closure criteria panel | Tasks/proposals must show what would close or verify the item. |
| Provider warnings | GitHub warnings/gates panel | OAuth, sync, permission, or local proof blockers. |
| Next safe action | GitHub next safe action panel | Show human path and optional AI path. |
| Summary cards | GitHub portfolio summary cards | Unread, needs reply, blocked, drafts, deadlines, exports. |
| Status pills | Framework pill classes | Use no-silent-green status language. |
| Privacy banner | GitHub warning banner | Sensitive/private thread warning, cloud AI warning, export warning. |

## Candidate Inbox views

| View | Description | Framework base |
| --- | --- | --- |
| `inbox` | default incoming stream | Workbench stream view |
| `needs_reply` | user action required | quick filter / lifecycle state |
| `drafts` | AI/user drafts awaiting review | event cards + action panel |
| `tasks` | task proposals from messages | event chain / closure panel |
| `calendar` | deadlines and schedule proposals | event stream + future Calendar shell |
| `exports` | archive/export packets | evidence/context panel |
| `providers` | account/provider status | GitHub management shell |
| `model_routing` | AI provider status and permissions | warning/gate/invariant panels |

## Required view model fields

Inbox UI should normalize data before rendering:

```text
accountId
providerId
threadId
messageId
eventId
eventType
lifecycleState
reviewState
severity
privacy.sensitive
title
summary
timestamp
evidence[]
claims[]
actions[]
closureCriteria[]
downstreamAgentNote
requiresLocalVerification
```

## Draft-only action mapping

| Action | Default UI state |
| --- | --- |
| summarize | enabled |
| classify | enabled |
| create draft | enabled |
| edit draft | enabled |
| copy draft | enabled |
| send | blocked / requires explicit user action outside AI default |
| forward | blocked / requires explicit user action |
| delete | blocked / requires explicit user action |
| export packet | proposal enabled, external sharing blocked |
| create task | proposal enabled |
| create calendar event | proposal enabled |

## Accessibility requirements

Borrow framework patterns:

- explicit `aria-label` on rails, streams, and context panels
- keyboard activation for cards
- visible selected state
- plain-language empty states
- warning banners with `role="status"` where appropriate
- no destructive action styled as casual

## Decision value

`INBOX_UI_COMPONENT_MAP_ESTABLISHED_FRAMEWORK_FIRST`
