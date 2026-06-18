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

Each page is judged against these standards:

| Standard | Human meaning |
| --- | --- |
| Owner-first clarity | The screen should tell Chris what to do next without requiring agent knowledge. |
| Trust honesty | Fixture/sample/preview data must not look like live truth. |
| One primary action | The page should not show several equally loud CTAs for the same job. |
| Progressive disclosure | Advanced, scaffold, receipt, CLI, and debug content belongs behind Advanced or scaffold mode. |
| Accessibility and cognition | The UI should reduce scanning load, repeated copy, table overflow, and multi-column noise. |
| Provider safety | Send, draft write, delete, label/archive, calendar write, and other provider mutations remain blocked unless explicitly approved. |
| Consistent product model | Similar surfaces should use the same language and owner-mode pattern. |
| Scaffold recovery | Agent/operator detail can still exist, but it should not be the default owner experience. |

## Human status summary

| Surface | Human status | Plain-English meaning |
| --- | --- | --- |
| Mail | Fixed, needs owner eyes | The Mail page was simplified to message-first reading and reduced operator noise, but Chris still needs to verify it at `:4488`. |
| Account drawer / Settings Accounts | Fixed, needs owner eyes | Account connection was simplified to connect/sync/account settings instead of CLI/operator clutter. Needs owner visual check. |
| Home | Fixed, needs owner eyes | Home no longer promotes fixture mail as real urgency. It now explains preview state and gives owner actions. Needs owner visual check. |
| Ibal drawer | Fixed, needs owner eyes | Ibal now has one clearer owner path and less duplicate proposal noise. Needs owner visual check. |
| Calendar | Reviewed, not fixed yet | Calendar is still too busy for owner mode. Month-first cleanup is next high-value implementation work. |
| Tasks | Reviewed, not fixed yet | Tasks still reads like a product/backlog system instead of a personal task surface. Needs owner-mode simplification. |
| Automations | Reviewed, not fixed yet | Automations should probably be hidden or reduced to one calm dry-run card until the product phase supports it. |
| Activity | Reviewed, proof needed | A prior table-overlap bug may already be fixed, but it needs visual classify at `:4488` before implementation. |
| Integrations | Reviewed, IA blocked | Integrations overlaps with Account drawer and Settings Accounts. Need decision on where Connect Gmail primarily belongs. |

## Page-by-page human review

### 1. Mail

Human problem found:

Mail had too much scaffold and system explanation around the core job: read messages, understand status, and decide what to do next. It risked making preview/import/provider limitations louder than the message list itself.

Standards applied:

- Owner-first clarity
- One primary action
- Trust honesty
- Progressive disclosure
- Provider safety

Fixed direction:

- Message-first reading.
- Setup guide reduced to one next step.
- Inspector and advanced metadata demoted.
- Provider write/send actions still blocked.

Current status:

Fixed in FIX-BATCH-001. Owner retest pending.

Owner should check:

- Does Mail feel like a usable inbox first, not a developer console?
- Is provider/sync status honest but not overwhelming?
- Are send/write actions clearly blocked?
- Does the first meaningful action make sense?

### 2. Account drawer and Settings Accounts

Human problem found:

Account setup mixed owner actions with CLI/operator controls. That made connection status hard to trust and made the drawer feel like a development tool instead of a product surface.

Standards applied:

- Owner-first clarity
- Trust honesty
- One primary action
- Progressive disclosure
- Consistent product model

Fixed direction:

- Account owner mode added.
- Primary actions reduced to connect, sync, add account, and account settings.
- CLI/import/wipe/debug content moved behind Advanced/scaffold paths.
- Receipt duplication reduced.

Current status:

Fixed in FIX-BATCH-002. Owner retest pending.

Owner should check:

- Is there one obvious account status?
- Is Connect Gmail or Sync now easy to find?
- Are CLI/import/wipe controls no longer primary?
- Do Account drawer and Settings Accounts feel like the same product model?

### 3. Home

Human problem found:

Home is the first-run surface, but it treated fixture/sample mail as if it were real priority. That is a trust problem because it could make fake urgency look operationally real.

Standards applied:

- Trust honesty
- Owner-first clarity
- Accessibility and cognition
- Progressive disclosure

Fixed direction:

- Fixture priority card replaced by owner next-step card.
- Preview state is explicit.
- Counts are context, not a real live-priority ranking.
- Advanced build explanation is behind Advanced.
- Owner actions point to Mail, Account settings, Tasks, and Calendar.

Current status:

Fixed in FIX-BATCH-003. Owner retest pending.

Owner should check:

- Does Home feel like a safe starting point?
- Does it avoid lying about live urgency?
- Does it give useful next actions without too much explanation?
- Does it avoid looking like a developer demo?

### 4. Ibal drawer

Human problem found:

Ibal had too many AI/proposal surfaces at once. Duplicate proposal display and scaffold mail context made the assistant feel output-heavy before the user had a clear input path.

Standards applied:

- One primary action
- Owner-first clarity
- Accessibility and cognition
- Consistent product model

Fixed direction:

- One prompt/input path.
- Duplicate selected proposal hidden when already visible in chat.
- Owner-safe mail context copy.
- Redundant Ask Ibal buttons hidden while drawer is open.
- Local receipts and clear controls moved behind Advanced.

Current status:

Fixed in FIX-BATCH-004. Owner retest pending.

Owner should check:

- Is there one clear way to ask Ibal?
- Does the drawer avoid repeating the same proposal in two places?
- Does the context copy sound owner-facing, not engineer-facing?
- Is Advanced detail hidden until needed?

### 5. Calendar

Human problem found:

Calendar has a good purpose, but the owner view is overloaded: month grid, week strip, daily detail, proposal editor, provider gate, conflicts, and fixture account references compete at once.

Standards applied:

- Owner-first clarity
- Progressive disclosure
- Accessibility and cognition
- Trust honesty
- Provider safety

Required fix direction:

- Keep month view primary.
- Show day/event detail after selection.
- Move proposal editor and conflict preview behind Advanced.
- Remove fixture account text from primary owner UI.
- Collapse provider-write warning to one setup/status card.
- Keep calendar provider writes blocked.

Current status:

Reviewed and classified P0. Not implemented yet.

Best next batch:

FIX-BATCH-005 Calendar owner month-first cleanup.

### 6. Tasks

Human problem found:

Tasks currently reads like a product-management/backlog system. Epics, stories, bugs, acceptance criteria, and evidence are valid for agents, but too heavy for a normal owner task surface.

Standards applied:

- Owner-first clarity
- Accessibility and cognition
- Progressive disclosure
- Consistent product model

Required fix direction:

- Simple personal task list by default.
- Optional board view.
- Hide epics, stories, bugs, acceptance criteria, and evidence unless scaffold mode or Advanced is enabled.
- Suppress fixture seeds in owner mode.

Current status:

Reviewed and classified P0. Not implemented yet.

Best later batch:

Tasks owner-mode simplification after Calendar or as a separate batch.

### 7. Automations

Human problem found:

Automations currently presents a lot of template/scaffold content before the product has enough live automation behavior. This risks selling capability that is not actually enabled yet.

Standards applied:

- Trust honesty
- Progressive disclosure
- Provider safety
- Owner-first clarity

Required fix direction options:

1. Hide Automations from owner primary nav until product phase.
2. Keep it visible as one calm dry-run / coming-soon card.
3. Move templates and builder detail to Advanced only.

Current status:

Reviewed and classified P1. Product-phase decision needed before major implementation.

Recommended human decision:

Prefer one calm dry-run card or hide until real automation value exists.

### 8. Activity

Human problem found:

Activity has a possible table-overlap P0 and too much filtering/detail for owner mode. It should be a simple history of what happened, what was proposed, and what was blocked.

Standards applied:

- Accessibility and cognition
- Trust honesty
- Progressive disclosure
- Auditability

Required proof first:

A previous shared overflow fix may already have repaired the table overlap. The Activity page must be visually classified at `:4488` before more implementation.

Outcome choices:

- `CLOSED_BY_FIX_BATCH_001`
- `PARTIAL_REPAIR_NEEDS_ACTIVITY_BATCH`
- `STILL_P0_BLOCKER`

Required fix direction if not closed:

- Fix truncation/wrapping first.
- Reduce filters to search plus one primary filter.
- Move export packet and receipt class details behind Advanced.
- Collapse unrelated inspector content.

Current status:

Reviewed. Proof needed before implementation.

### 9. Integrations

Human problem found:

Integrations overlaps with Account drawer and Settings Accounts. All three can point at provider connection, especially Gmail. If we implement before deciding ownership, the app may show duplicate Connect Gmail paths.

Standards applied:

- Consistent product model
- One primary action
- Trust honesty
- Provider safety

Decision needed:

| Option | Human meaning |
| --- | --- |
| Accounts primary | Account drawer + Settings own Connect Gmail. Integrations becomes provider catalog / Advanced. |
| Integrations primary | Integrations owns Connect Gmail hero. Account drawer shows session/status only. |
| Split | Both show the same action with identical copy and one backend path. Highest duplication risk. |

Current status:

Reviewed and IA-blocked. Do not implement until this decision is recorded.

Recommended human decision:

Use Accounts primary for Gmail connection. Let Integrations become a provider catalog and explanation surface. This avoids duplicate Connect Gmail CTAs.

## What is already safe to say

- Every primary page/surface has been reviewed at least once in the peer-review program.
- Mail, Account, Home, and Ibal have fixes landed and await owner visual retest.
- Calendar, Tasks, Automations, Activity, and Integrations are not forgotten. They are reviewed, classified, and sequenced.
- The remaining work is not random; each page has a known human problem and fix direction.

## What is not safe to say yet

- Do not say UI-003E passed.
- Do not say the app is owner-approved.
- Do not say Calendar, Tasks, Automations, Activity, or Integrations are fixed.
- Do not say Integrations is ready until the Connect Gmail IA decision is made.
- Do not say Activity is fixed until B6 is visually classified.

## Recommended finish order for a human operator

1. Retest Mail, Account, Home, and Ibal at `:4488`.
2. Implement Calendar owner month-first cleanup.
3. Implement Tasks personal-task owner mode.
4. Decide Automations: hide vs one dry-run card.
5. Visually classify Activity B6, then fix only if needed.
6. Decide Integrations ownership, then implement.
7. Run full owner UI-003E review only after these surfaces are fixed or intentionally deferred.

## Decision value

```text
UI_PEER_REVIEW_HUMAN_OPERATOR_MAP_CREATED_2026_06_18
```
