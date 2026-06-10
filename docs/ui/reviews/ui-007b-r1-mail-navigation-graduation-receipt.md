# UI-007B-R1 Mail Navigation Graduation Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

(recorded at commit — see `git rev-parse HEAD` on branch)

## Scope

Mail navigation graduation: left-rail mail folders, 2-pane center, 4-pane independent scroll, outcome lane demotion, Approval Queue placeholder.

## Excluded

UI-007B-R2 draft object model, UI-007B-R3 command modes, provider/runtime, owner visual PASS.

## Owner IA failure addressed

Center column contained non-interactive folder scaffolding; mail nav was one level too deep.

## After IA

| Column | Role |
| --- | --- |
| 1 Left rail | Workbench + Mail accordion (Inbox, Drafts, Approval Queue, smart views) |
| 2 List | Filtered threads |
| 3 Reading | Message/draft body |
| 4 Context rail | Actions + evidence (independent scroll) |

## Results

| Check | Result |
| --- | --- |
| Center fake-nav removed | pass |
| Mail nav interactive | pass — `mailboxView` in `inbox` namespace |
| Approval Queue placeholder | pass |
| Drafts view | pass — filter + count |
| Outcome lanes demoted | pass — Calendar/Tasks/Automations/Extensions in collapsible |
| Operability preserved | pass — compose, reply, triage, Ibal |
| Storage | `xiioInbox.preview.state` schemaVersion 2; `mailboxView` persisted |
| Independent scroll | pass — nav, list, reading, context rail |
| Safety/egress | pass — send/provider blocked |
| `npm run check` | pass |

## Owner screenshot review required

**Yes** — Inbox workbench only, before UI-003E full proof.

## Decision

```text
UI_007B_R1_PASS_MAIL_NAV_READY_FOR_OWNER_SCREENSHOT_REVIEW
```

## Next pass

Owner Inbox screenshot review → UI-007B-R2 Drafts + Approval Queue data model.
