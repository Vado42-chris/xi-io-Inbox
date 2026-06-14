# UI-015 Level 4 Lane Purpose and Journey Index

## Status

```text
Type: Level 4 wargaming plan.
Depends on: NAV-002, UI-NORTH-STAR-AMEND, planned Level 2 visual direction, planned Level 3 cross-pollination.
Prepares: Level 5 componentization and framework backfeed.
```

Level 4 refocuses purpose inside each primary lane. Level 3 establishes cross-pollination;
Level 4 makes each lane memorable on its own while keeping the suite unified.

## Locked product suite lanes

| Lane | User expectation | Memorable promise |
| --- | --- | --- |
| Home | Tell me what matters now across all accounts and surfaces. | "Start here; nothing important is hiding." |
| Mail | Turn incoming messages into drafts, decisions, work, time, and receipts. | "Mail becomes controlled action." |
| Calendar | Show time pressure, proposals, conflicts, and commitments across accounts. | "Time is negotiated before it is written." |
| Tasks | Convert intent, projects, bugs, stories, and mail-derived commitments into work. | "Everything that needs doing has a source and next step." |
| Automations | Design and dry-run rules before anything can execute. | "Automation is rehearsed before it is trusted." |
| Activity | Explain what happened, what was proposed, what was blocked, and why. | "Every meaningful action leaves a receipt." |
| Integrations | Explain providers, permissions, gates, and what each unlocks. | "Connections are explicit, reversible, and understandable." |

Ibal remains a concierge and command layer across lanes, not a lane. Settings remains a
utility area for account/system preferences and gates.

## Lane journey maps

### Home: command center

| Stage | User need | UI obligation | Handoff |
| --- | --- | --- | --- |
| Arrive | Understand the day quickly. | Show Now / Next / Waiting / Risk with account scope. | Mail, Calendar, Tasks, Activity. |
| Decide | Pick the highest-value next action. | Rank items by urgency, risk, and blocked state. | Focus selected object in its native lane. |
| Act | Continue in the right surface. | Deep-link to exact thread, task, proposal, receipt, or gate. | Native lane owns edits. |
| Verify | Know whether action happened or remains preview-only. | Show receipt expectation and blocked provider state. | Activity captures proof. |

Failure points:

- Home becomes a generic dashboard of cards instead of a prioritized command center.
- Items lack "why now" explanations.
- Cross-links open broad lanes instead of exact object focus.
- Provider-blocked items look like actionable live operations.

### Mail: controlled ingress workbench

| Stage | User need | UI obligation | Handoff |
| --- | --- | --- | --- |
| Triage | See signal across accounts without reading private bodies unless imported. | Account scope, metadata honesty, unread/risk groupings. | Calendar/Tasks suggestions. |
| Draft | Compose or reply locally. | Draft state, evidence, risk flags, approval readiness. | Approvals sub-view. |
| Approve | Decide what can be simulated or held. | Block send clearly; show consequences before any future provider write. | Activity receipt. |
| Convert | Turn thread into task, calendar proposal, or automation candidate. | Source-linked creation affordances. | Tasks, Calendar, Automations. |

Failure points:

- Send, archive, forward, delete, or provider mutation appears live.
- Drafts and Approvals reappear as top-level lanes.
- Metadata-only mode leaks bodies or snippets beyond documented policy.
- Mail becomes the whole product instead of an ingress surface.

### Calendar: time and commitment lane

| Stage | User need | UI obligation | Handoff |
| --- | --- | --- | --- |
| Scan | Understand time pressure across accounts. | Today/week/month hierarchy with account-colored proposals. | Home risk stack. |
| Inspect | Know the source and consequences of a proposal. | Source mail/task, conflict preview, provider write lock. | Mail, Tasks, Activity. |
| Propose | Create or edit local proposal. | Local-only event draft with account scope and receipt expectation. | Activity. |
| Resolve | Decide conflict or next step. | Conflict alternatives and task follow-up suggestions. | Tasks/Automations. |

Failure points:

- Calendar feels like a small utility widget instead of a primary lane.
- `accountLabel` display strings substitute for durable `accountId`.
- Provider write block reads as an error banner instead of trust control.
- Proposal cards lack source, risk, and next-step context.

### Tasks: work and structure lane

| Stage | User need | UI obligation | Handoff |
| --- | --- | --- | --- |
| Capture | Add work from mail, calendar, GitHub, or manual source. | Source type, source ref, account/workspace scope. | Mail/Calendar/Integrations. |
| Organize | Move between planning, board, epics, stories, bugs, evidence. | One work-item model with clear sub-views. | Home priority, Activity proof. |
| Execute | Know next action and blockers. | Owner, status, due/time links, evidence, blocked providers. | Calendar/Automations. |
| Verify | Confirm proof path. | Receipt expectation and source trace on every work item. | Activity. |

Failure points:

- Plan returns as a fake umbrella lane.
- Epics, stories, bugs, and evidence become disconnected mini-apps.
- GitHub source refs imply live GitHub integration before gates.
- Work items lack source and account identity.

### Automations: rehearsal lane

| Stage | User need | UI obligation | Handoff |
| --- | --- | --- | --- |
| Discover | See candidate automations from repeated work. | Suggestions from Mail/Tasks/Calendar patterns. | Ibal/Tasks. |
| Design | Build When / If / Then locally. | Visual dry-run grammar, no live execution affordance. | Activity dry-run receipt. |
| Test | Understand what would happen. | Simulation trace, affected objects, blocked external calls. | Activity/Integrations. |
| Promote later | Know what must be approved before runtime. | Provider permissions and human approval checklist. | Integrations/Settings. |

Failure points:

- Dry-run controls look executable.
- External providers look connected without credentials and gates.
- Automation results are not explainable as receipts.
- Rules are not reusable templates for Level 5.

### Activity: receipt and audit lane

| Stage | User need | UI obligation | Handoff |
| --- | --- | --- | --- |
| Review | Know what changed, what was proposed, and what was blocked. | Filter by all/proposed/blocked/completed/provider gates. | Native object lane. |
| Audit | Understand source and decision trail. | Timeline with actor, object, source, limitation, evidence. | Mail/Tasks/Calendar. |
| Recover | Resume work from a receipt. | Deep-link to original object and next allowed action. | Native lane. |
| Export later | Prepare safe evidence packets. | Redaction and custody language; no silent upload. | Integrations/local tools. |

Failure points:

- Activity becomes a passive log with no continuation path.
- Receipt rows imply runtime proof when they are preview evidence.
- Blocked actions are hidden instead of first-class.
- Export/upload is implied before provider/runtime gates.

### Integrations: provider and trust lane

| Stage | User need | UI obligation | Handoff |
| --- | --- | --- | --- |
| Understand | See what each provider unlocks and what data it touches. | Provider cards grouped by product surface and trust state. | Mail/Calendar/Tasks/Automations. |
| Evaluate | Know required scopes and risks. | Permission summary, data touched, blocked runtime action. | Settings/gates. |
| Prepare | Configure local notes or CLI path where allowed. | Preview-only setup notes; no credential storage in browser. | Activity receipt. |
| Connect later | Know future approval path. | Explicit gate checklist and provider-specific next proof. | Runtime/provider work. |

Failure points:

- GitHub remains only a blocked card instead of explaining task/activity value.
- Provider cards do not say which lanes they unlock.
- Credentials or OAuth appear to live in browser preview.
- Integration status is not reflected in Home/Activity.

## Cross-lane index

| Object | Native lane | Must appear contextually in | Required fields before build |
| --- | --- | --- | --- |
| `XiMailThread` | Mail | Home, Calendar, Tasks, Activity | `id`, `accountId`, `sourceRef`, `privacyMode`, `snippetPolicy` |
| `XiDraft` | Mail | Home, Activity, Tasks | `id`, `threadId`, `approvalState`, `riskFlags`, `receiptExpectation` |
| `XiTimeProposal` | Calendar | Home, Mail, Tasks, Activity | `id`, `accountId`, `workspaceId`, `sourceRef`, `status`, `conflicts` |
| `XiWorkItem` | Tasks | Home, Mail, Calendar, Activity | `id`, `accountId`, `workspaceId`, `sourceType`, `sourceRef`, `status` |
| `XiAutomationDryRun` | Automations | Home, Tasks, Activity, Integrations | `id`, `sourceRefs`, `blockedActions`, `simulationTrace` |
| `XiReceipt` | Activity | Home and every source lane | `id`, `objectRef`, `actor`, `state`, `evidenceRefs`, `limitations` |
| `XiProviderGate` | Integrations | Home, Mail, Calendar, Tasks, Activity | `providerId`, `surfaceIds`, `permissionSummary`, `gateState` |

## Level 4 failure index

| Failure class | Example | Preventive gate |
| --- | --- | --- |
| Silent capability gap | Calendar has UI but no account lens. | Each lane receipt lists unimplemented scope/provider work. |
| False runtime claim | Button suggests real send/sync/execute. | Copy and disabled states say preview/dry-run/local-only. |
| Siloed lane | Tasks does not show mail/calendar source. | Each lane must show at least two external object types after Level 3. |
| Lost source trace | Work item lacks origin. | No object ships without `sourceType` and `sourceRef`. |
| Visual sameness | All lanes use same gray cards. | Level 2/4 lane identity tokens required before UI-003E. |
| Component over-extraction | Repo-specific Gmail logic moved into framework. | Level 5 ownership decision before extraction. |
| Framework under-extraction | Reusable route/scope/receipt patterns stay buried. | Level 5 backfeed index required. |
| Template mismatch | Templates reuse components without safety gates. | Template contract must include blocked-action and receipt slots. |

## Level 5 componentization prep

| Candidate | Likely home | Why |
| --- | --- | --- |
| Primary app shell + route table contract | Framework, with repo config | Reusable across operations apps; product lanes configured here. |
| Scope lens control | Framework | Multi-account/global pattern is broadly reusable. |
| Receipt timeline/list | Framework | Audit and continuation pattern should be shared. |
| Provider gate card | Framework | Provider trust language and blocked-action grammar recur. |
| Cross-lane related object rail | Framework | Anti-silo pattern is reusable across templates. |
| Mail metadata/Gmail adapter | This repo | Product/provider-specific and privacy-sensitive. |
| Calendar proposal renderer | Split | Generic proposal card to framework; Inbox-specific copy/data stays here. |
| Tasks work-item board | Split | Generic board/card grammar to framework; app-specific types stay here. |
| Automation dry-run trace | Framework candidate | Dry-run proof is useful across apps, but needs one more concrete implementation first. |
| Visual brand theme | Template + repo | Framework supplies token slots; this repo owns final brand expression. |

## Level 4 readiness checklist

- [ ] Every lane has a named promise and expected journey.
- [ ] Every lane has start, inspect, act, verify stages.
- [ ] Every lane lists source objects and outbound handoffs.
- [ ] Every lane lists predicted silent failures.
- [ ] Every lane has explicit non-claims for runtime/provider capabilities.
- [ ] Cross-lane object index exists before SCOPE-001 implementation.
- [ ] Level 5 component candidates are sorted into framework, repo, split, or template.

## Decision value

`UI_015_LEVEL_4_LANE_PURPOSE_JOURNEY_FAILURE_INDEX_READY_FOR_LEVEL_5`

