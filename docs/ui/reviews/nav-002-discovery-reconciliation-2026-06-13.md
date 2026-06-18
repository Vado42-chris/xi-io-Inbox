# NAV-002 Discovery Reconciliation

## Date

2026-06-13

## Branch

`cursor/gmail-harden-5e1b`

## Trigger

Owner/local-agent discovery found Calendar, Tasks, and Home were demoted or orphaned by
shell cleanup and mail-first passes. The prior north-star ratification over-applied the
draft-centered RFC as a product IA decision.

## Decision

```text
NAV_002_REQUIRED_RESTORE_PRIMARY_HOME_CALENDAR_TASKS_AND_SHARED_SCOPE_LENS
```

Adopt Option B:

```text
Mail workbench spine + primary capability destinations.
Top nav: Home | Mail | Calendar | Tasks | Automations | Activity | Integrations.
Mail sub-views: Inbox | Drafts | Approvals | Sent/Receipts under Mail.
Plan dissolves into Tasks sub-views.
Calendar and Tasks require global/per-account scope lenses.
```

## What was wrong

| Issue | Correction |
| --- | --- |
| Calendar and Tasks hidden under `Plan` | Restore as primary destinations. |
| Home route not top-level discoverable | Restore Home as primary destination. |
| Draft-centered model treated capabilities as secondary IA | Keep mail spine, but make Calendar/Tasks primary product surfaces. |
| Calendar/Tasks lacked mail-style account lens | Add shared scope lens contract before implementation. |
| Shell receipts risked closing capability gaps | Require capability review for Calendar/Tasks/GitHub/account scope. |

## NAV-002 target

1. Create one route table for primary nav and contextual rails.
2. Promote `Home`, `Calendar`, and `Tasks` to primary nav.
3. Move `Plan` concepts into Tasks sub-views: Epics, Stories, Bugs, Backlog/Evidence.
4. Keep Settings in account/system utility.
5. Keep Ibal as concierge/command entry, not a lane.
6. Preserve provider gates and draft-only egress copy.

## Scope lens target

Shared scope applies to Mail, Calendar, Tasks, and Activity:

```text
All accounts | accountId
```

Calendar proposals and work items need `accountId`, `workspaceId`, `sourceRef`, and
`sourceType`. Account-specific views are filtered projections of the same objects, not
duplicate stores.

## Self peer review

| Question | Answer |
| --- | --- |
| Best path? | Yes. Correct the IA before extracting modules so agents do not modularize the wrong navigation. |
| Correct fix vs different approach? | NAV-002 should precede route/nav strangler extraction. |
| Truncation? | Corrected: Calendar/Tasks/Home are explicit again. GitHub remains a provider/task/activity source, not a separate top-level app. |
| Hallucination? | No new completed capabilities claimed; this is a correction plan. |
| Duplicated work? | Reduces duplicated Plan/Tasks/Epics/Stories/Bugs surfaces by assigning them to Tasks sub-views. |
| Silent failure? | The remaining-pass estimate was increased to account for NAV-002 and scope-lens work. |

## Decision value

`NAV_002_RESTORE_PRIMARY_OPERATIONS_DESTINATIONS_BEFORE_MODULAR_EXTRACTION`

