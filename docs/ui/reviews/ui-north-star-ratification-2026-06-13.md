# UI North Star Ratification Amendment

## Date

2026-06-13

## Branch

`cursor/gmail-harden-5e1b`

## Decision

```text
UI_NORTH_STAR_OPTION_B_MAIL_SPINE_WITH_PRIMARY_CALENDAR_TASKS_SCOPE_LENS
```

Amend the prior draft-centered ratification. Proceed with **Option B**:

```text
Received message = input.
Draft = work artifact.
Send = event boundary.
Receipt = audit artifact.
Mail is the workbench spine.
Home, Calendar, Tasks, Automations, Activity, and Integrations remain primary destinations.
Calendar and Tasks get global/per-account scope lenses.
Ibal is concierge/command entry, not a lane.
```

## Why this path

- It preserves completed Mail/Drafts/Approvals work instead of discarding it.
- It restores the original unified operations-app vision where Calendar and Tasks are not
  buried under `Plan`.
- It resolves duplicate lane/nav models by defining one primary nav plus contextual rails.
- It matches existing safety invariants: AI proposes, human controls, receipts record.
- It unlocks module skeleton work without requiring a big-bang rewrite.
- It avoids conflating code module grouping with product information architecture.

## Correction from prior pass

The previous ratification over-applied the draft-centered RFC and treated Calendar/Tasks as
secondary capabilities. Discovery review found that this was a product mistake: NAV-001
fixed a broken shell but did not prove Calendar/Tasks should be demoted. This amendment
keeps Mail as the workbench spine while restoring Calendar, Tasks, and Home as primary user
destinations.

## Safety limits

- No irreversible deletion of working UI in this ratification pass.
- No send, draft write, provider mutation, automation execution, or runtime claims.
- Route/lane removal requires a focused migration receipt and passing route smoke.
- `public/inbox-preview.js` migration must be strangler-style.
- No demotion of a primary REQ lane without owner sign-off and a product-capability review.
- Shell receipts cannot close Calendar/Tasks/GitHub capability gaps.

## Self peer review

| Question | Answer |
| --- | --- |
| Best path? | Yes. Option B preserves the mail workbench while restoring Calendar/Tasks/Home as primary operations surfaces. |
| Correct fix vs different approach? | Correct amendment: route-table and scope-lens work must precede monolith extraction so we do not extract the wrong IA. |
| Truncation? | Corrected. Prior ratification truncated the multi-account Calendar/Tasks requirement; this receipt restores it. |
| Hallucination? | No new product capability is claimed; this is a planning/gating decision. |
| Duplicated work? | Reduces duplicate lane models by selecting one primary nav and shared scope lens. |
| Efficiency improvement | Future agents can implement NAV-002 without re-litigating UI-003/NAV-001/north-star conflicts. |

## Next allowed work

1. NAV-002 route-table contract with Home/Mail/Calendar/Tasks/Automations/Activity/Integrations.
2. Shared scope lens contract for Mail, Calendar, Tasks, and Activity.
3. UI-003E owner visual-proof support packet on the corrected IA.
4. First route/nav strangler extraction.

