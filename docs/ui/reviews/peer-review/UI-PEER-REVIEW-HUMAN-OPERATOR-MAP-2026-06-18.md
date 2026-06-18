# UI peer review — human operator map

## Date

2026-06-18

## Why this exists

The FIX-BATCH ledger is useful for agents, but it does not explain the review in plain product terms. This map translates the peer-review program into human-readable operator language:

- What page or surface was reviewed.
- What owner problem was found.
- What standard it was judged against.
- What has already been fixed.
- What still needs owner visual proof.
- What should not be started yet.

## Review standard used across every page

| Standard | Human meaning |
| --- | --- |
| Owner-first clarity | The screen should tell Chris what to do next without requiring agent knowledge. |
| Trust honesty | Fixture/sample/preview data must not look like live truth. |
| One primary action | The page should not show several equally loud CTAs for the same job. |
| Progressive disclosure | Advanced, scaffold, receipt, CLI, and debug content belongs behind Advanced or scaffold mode. |
| Accessibility and cognition | The UI should reduce scanning load, repeated copy, table overflow, and multi-column noise. |
| Provider safety | Send, draft write, delete, label/archive, calendar write, task sync, issue tracker, evidence upload, and other provider mutations remain blocked unless explicitly approved. |
| Consistent product model | Similar surfaces should use the same language and owner-mode pattern. |
| Scaffold recovery | Agent/operator detail can still exist, but it should not be the default owner experience. |

## Human status summary

| Surface | Human status | Plain-English meaning |
| --- | --- | --- |
| Mail | Fixed, needs owner eyes | Mail was simplified to message-first reading and reduced operator noise. Chris still needs to verify it at `:4488`. |
| Account drawer / Settings Accounts | Fixed, needs owner eyes | Account connection was simplified to connect/sync/account settings instead of CLI/operator clutter. Needs owner visual check. |
| Home | Fixed, needs owner eyes | Home no longer promotes fixture mail as real urgency. It now explains preview state and gives owner actions. Needs owner visual check. |
| Ibal drawer | Fixed, needs owner eyes | Ibal now has one clearer owner path and less duplicate proposal noise. Needs owner visual check. |
| Calendar | Fixed, needs owner eyes | Calendar is now month-first, with week/day/detail/proposal/conflict surfaces behind Advanced. Needs owner visual check. |
| Tasks | Fixed, needs owner eyes | Tasks now starts as a personal task surface. PM/backlog scaffold lives behind Advanced. Needs owner visual check. |
| Automations | Reviewed, not fixed yet | Automations should probably be hidden or reduced to one calm dry-run card until the product phase supports it. |
| Activity | Reviewed, proof needed | A prior table-overlap bug may already be fixed, but it needs visual classify at `:4488` before implementation. |
| Integrations | Reviewed, IA blocked | Integrations overlaps with Account drawer and Settings Accounts. Need decision on where Connect Gmail primarily belongs. |

## Page-by-page human review

### 1. Mail

Human problem found: Mail had too much scaffold and system explanation around the core job: read messages, understand status, and decide what to do next.

Standards applied: owner-first clarity, one primary action, trust honesty, progressive disclosure, provider safety.

Fixed in FIX-BATCH-001:

- Message-first reading.
- Setup guide reduced to one next step.
- Inspector and advanced metadata demoted.
- Provider write/send actions still blocked.

Owner should check:

- Does Mail feel like a usable inbox first, not a developer console?
- Is provider/sync status honest but not overwhelming?
- Are send/write actions clearly blocked?
- Does the first meaningful action make sense?

### 2. Account drawer and Settings Accounts

Human problem found: Account setup mixed owner actions with CLI/operator controls. That made connection status hard to trust and made the drawer feel like a development tool instead of a product surface.

Standards applied: owner-first clarity, trust honesty, one primary action, progressive disclosure, consistent product model.

Fixed in FIX-BATCH-002:

- Account owner mode added.
- Primary actions reduced to connect, sync, add account, and account settings.
- CLI/import/wipe/debug content moved behind Advanced/scaffold paths.
- Receipt duplication reduced.

Owner should check:

- Is there one obvious account status?
- Is Connect Gmail or Sync easy to find?
- Are CLI/import/wipe controls no longer primary?
- Do Account drawer and Settings Accounts feel like the same product model?

### 3. Home

Human problem found: Home treated fixture/sample mail as if it were real priority, creating fake urgency at the app entry point.

Standards applied: trust honesty, owner-first clarity, accessibility and cognition, progressive disclosure.

Fixed in FIX-BATCH-003:

- Fixture priority card replaced by owner next-step card.
- Preview state is explicit.
- Counts are context, not live-priority ranking.
- Advanced build explanation is behind Advanced.
- Owner actions point to Mail, Account settings, Tasks, and Calendar.

Owner should check:

- Does Home feel like a safe starting point?
- Does it avoid lying about live urgency?
- Does it give useful next actions without too much explanation?
- Does it avoid looking like a developer demo?

### 4. Ibal drawer

Human problem found: Ibal had too many AI/proposal surfaces at once. Duplicate proposal display and scaffold mail context made the assistant feel output-heavy before the user had a clear input path.

Standards applied: one primary action, owner-first clarity, accessibility and cognition, consistent product model.

Fixed in FIX-BATCH-004:

- One prompt/input path.
- Duplicate selected proposal hidden when already visible in chat.
- Owner-safe mail context copy.
- Redundant Ask Ibal buttons hidden while drawer is open.
- Local receipts and clear controls moved behind Advanced.

Owner should check:

- Is there one clear way to ask Ibal?
- Does the drawer avoid repeating the same proposal in two places?
- Does the context copy sound owner-facing, not engineer-facing?
- Is Advanced detail hidden until needed?

### 5. Calendar

Human problem found: Calendar had too many things fighting for attention: month grid, week strip, daily detail, proposal editor, provider gate, conflicts, and fixture account references.

Standards applied: owner-first clarity, progressive disclosure, accessibility and cognition, trust honesty, provider safety.

Fixed in FIX-BATCH-005:

- Month view is the primary surface.
- Provider warning is reduced to a calmer setup/status card.
- Week strip, day agenda, reading/detail pane, proposal/conflict detail, and provider detail move behind `Advanced calendar details`.
- Primary action says `New local event` to preserve provider-write honesty.
- Calendar provider writes remain blocked.
- Scaffold recovery is preserved.

Owner should check:

- Does the month grid dominate the page?
- Is Advanced collapsed by default?
- Does the page avoid any false live-calendar-write feeling?
- Does selecting a day or event still work?
- Does scaffold mode restore full detail?

### 6. Tasks

Human problem found: Tasks read like a product-management/backlog system instead of a personal task surface. Epics, stories, bugs, acceptance criteria, evidence, project selector, board controls, and provider sync copy competed with the basic owner job: see what needs doing and add a task.

Standards applied: owner-first clarity, accessibility and cognition, progressive disclosure, consistent product model, provider safety.

Fixed in FIX-BATCH-006:

- Tasks starts with an owner-facing `Your tasks` card.
- `New task` is the obvious primary action.
- Project selector, Planning/Board toggle, epics, stories, bugs, evidence, and backlog detail move behind `Advanced task planning details`.
- External task sync, issue tracker mutation, and evidence upload remain blocked.
- Scaffold recovery is preserved.

Owner should check:

- Does Tasks start as a personal task page, not a backlog console?
- Is `New task` obvious?
- Are epics/stories/bugs/evidence behind Advanced?
- Do local task create/edit flows still work?
- Does scaffold mode restore full detail?

### 7. Automations

Human problem found: Automations currently presents template/scaffold content before the product has enough live automation behavior. This risks selling capability that is not actually enabled yet.

Standards applied: trust honesty, progressive disclosure, provider safety, owner-first clarity.

Required fix direction options:

1. Hide Automations from owner primary nav until product phase.
2. Keep it visible as one calm dry-run / coming-soon card.
3. Move templates and builder detail to Advanced only.

Current status: reviewed and classified P1. Product-phase decision needed before major implementation.

Recommended human decision: prefer one calm dry-run card or hide until real automation value exists.

### 8. Activity

Human problem found: Activity has a possible table-overlap P0 and too much filtering/detail for owner mode. It should be a simple history of what happened, what was proposed, and what was blocked.

Standards applied: accessibility and cognition, trust honesty, progressive disclosure, auditability.

Required proof first: a previous shared overflow fix may already have repaired the table overlap. The Activity page must be visually classified at `:4488` before more implementation.

Outcome choices:

- `CLOSED_BY_FIX_BATCH_001`
- `PARTIAL_REPAIR_NEEDS_ACTIVITY_BATCH`
- `STILL_P0_BLOCKER`

Required fix direction if not closed:

- Fix truncation/wrapping first.
- Reduce filters to search plus one primary filter.
- Move export packet and receipt class details behind Advanced.
- Collapse unrelated inspector content.

### 9. Integrations

Human problem found: Integrations overlaps with Account drawer and Settings Accounts. All three can point at provider connection, especially Gmail. If we implement before deciding ownership, the app may show duplicate Connect Gmail paths.

Standards applied: consistent product model, one primary action, trust honesty, provider safety.

Decision needed:

| Option | Human meaning |
| --- | --- |
| Accounts primary | Account drawer + Settings own Connect Gmail. Integrations becomes provider catalog / Advanced. |
| Integrations primary | Integrations owns Connect Gmail hero. Account drawer shows session/status only. |
| Split | Both show the same action with identical copy and one backend path. Highest duplication risk. |

Current status: reviewed and IA-blocked. Do not implement until this decision is recorded.

Recommended human decision: use Accounts primary for Gmail connection. Let Integrations become a provider catalog and explanation surface.

## What is already safe to say

- Every primary page/surface has been reviewed at least once in the peer-review program.
- Mail, Account, Home, Ibal, Calendar, and Tasks have fixes landed and await owner visual retest.
- Automations, Activity, and Integrations are not forgotten. They are reviewed, classified, and sequenced.
- The remaining work is not random; each remaining page has a known human problem and fix direction.

## What is not safe to say yet

- Do not say UI-003E passed.
- Do not say the app is owner-approved.
- Do not say Automations, Activity, or Integrations are fixed.
- Do not say Integrations is ready until the Connect Gmail IA decision is made.
- Do not say Activity is fixed until B6 is visually classified.

## Recommended finish order for a human operator

1. Retest Mail, Account, Home, Ibal, Calendar, and Tasks at `:4488`.
2. Decide Automations: hide vs one dry-run card.
3. Visually classify Activity B6, then fix only if needed.
4. Decide Integrations ownership, then implement.
5. Run full owner UI-003E review only after these surfaces are fixed or intentionally deferred.

## Decision value

```text
UI_PEER_REVIEW_HUMAN_OPERATOR_MAP_SYNCED_AFTER_FIX_BATCH_006_2026_06_18
```
