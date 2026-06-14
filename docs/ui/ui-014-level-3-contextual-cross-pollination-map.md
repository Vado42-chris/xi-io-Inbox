# UI-014 Level 3 Contextual Cross-Pollination Map

## Status

```text
Type: anti-silo interaction standard.
Scope: page-specific related-object behavior across primary lanes.
Blocks: claiming lane polish or component anatomy is complete.
```

UI-014 defines how lanes promote each other without turning the product into disconnected
mini-apps. Every primary lane must make the rest of the suite more useful.

## Required design docs inside UI-014

| Section | Required content | Why |
| --- | --- | --- |
| Shared object graph | Objects, required fields, source refs, receipt expectations. | Prevents isolated stores and fake cross-links. |
| Lane related zones | What each lane must surface from other lanes. | Prevents siloed pages. |
| Trigger matrix | Which user actions create suggestions, proposals, tasks, receipts, or gates. | Makes journeys end-to-end. |
| Continuation rules | Exact destination route/focus for each cross-lane link. | Prevents broad, unhelpful navigation. |
| Trust rules | Blocked provider/runtime actions remain visible in every handoff. | Prevents silent dangerous assumptions. |
| Evidence rules | Every generated suggestion cites source object and limitation. | Keeps AI/Ibal suggestions auditable. |

## Shared object graph

| Object | Native lane | Cross-lane obligations |
| --- | --- | --- |
| `XiMailThread` | Mail | Can create draft, task, calendar proposal, automation candidate, activity receipt. |
| `XiDraft` | Mail | Appears on Home, Activity, and related Tasks when approval or send simulation matters. |
| `XiTimeProposal` | Calendar | Appears on Home, Mail source thread, Tasks due/work context, Activity receipt. |
| `XiWorkItem` | Tasks | Appears on Home, source Mail/Calendar, Activity, and provider/gate context. |
| `XiAutomationDryRun` | Automations | Appears on Tasks, Activity, Integrations, and Home risk/waiting stacks. |
| `XiReceipt` | Activity | Appears wherever its source object is rendered. |
| `XiProviderGate` | Integrations | Appears on any lane where blocked provider capability affects action. |

## Lane related zones

| Lane | Required related zones |
| --- | --- |
| Home | Now, Next, Waiting, Risk; each item deep-links to exact native object. |
| Mail | Related calendar proposals, task candidates, draft approvals, provider gates, recent receipts. |
| Calendar | Source mail threads, related tasks, conflicts, provider gates, receipt history. |
| Tasks | Source mail/calendar/GitHub refs, deadlines, evidence, receipts, blocked providers. |
| Automations | Source patterns, affected work items, provider gates, dry-run receipts. |
| Activity | Continue-in-native-lane links for every receipt. |
| Integrations | Surfaces unlocked by provider, blocked objects waiting on provider, permission trail. |

## Anti-silo gates

A lane fails Level 3 if:

- it renders only objects native to itself,
- related links route to a broad lane instead of exact object focus,
- a suggestion lacks source and limitation,
- provider/action safety disappears during handoff,
- Activity cannot resume the user back into the original object,
- Home cannot explain why an item is surfaced now.

## Route and focus requirements

Cross-lane links must carry:

```text
targetLane, targetRoute, objectId, sourceRef, reason, blockedState, receiptExpectation
```

Until full routing exists, the preview must document any missing focus behavior in the lane
receipt and cannot call the journey complete.

## Acceptance criteria

- [ ] Every primary lane has at least two contextual external object types.
- [ ] Every related object has source/ref/why-now copy.
- [ ] Activity can resume each receipt into the relevant native lane.
- [ ] Provider gates appear at point of need, not only in Integrations.
- [ ] Route smoke or model checks cover at least one cross-lane handoff per primary lane.
- [ ] No handoff implies live provider mutation, send, sync, or automation execution.

## Decision value

`UI_014_LEVEL_3_CROSS_POLLINATION_REQUIRED_BEFORE_LANE_POLISH`

