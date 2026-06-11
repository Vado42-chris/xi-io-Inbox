# UI-011I Settings Cross-Product Cleanup Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

*(filled after commit)*

## Scope

Settings residual / cross-product cleanup per `docs/product/ui-011a-product-capability-gap-matrix.md` — last UI-011 capability pass before UI-012 visual governance.

## Excluded scope

- UI-012 visual polish implementation
- Owner UI-003E visual proof
- Real provider connection / OAuth in browser
- Gmail body read, draft write, send
- Cloud upload/download / real export write
- External automation or Discord/Slack execution
- PR #12 draft exit or merge

## Source matrix references

- CAP-SET-001 Settings IA — user sections first; build evidence under Advanced
- CAP-SET-002 Accounts — queued/metadata-only/blocked states; CLI path; no browser tokens
- CAP-SET-003 Providers — aligned with Integrations and Activity catalogs
- CAP-SET-004 Privacy — local preview, blocked egress, reset affordance
- CAP-SET-005 Storage — canonical key, preview-only evidence/export
- CAP-SET-006 Notifications — preview toggles; provider delivery blocked
- CAP-SET-007 AI/Ibal — proposal-only; runtime blocked
- CAP-SET-008 Automation safety — dry-run, approval, external execution blocked
- CAP-SET-009 Advanced isolation — gates, policies, build evidence, schema
- CAP-SET-010 Cross-product copy — shared `PRODUCT_GATE_COPY` gate language

## Files changed

- `public/inbox-preview.js` — schema v11, settings IA, nine user-facing panes, cross-product gate copy, preview reset
- `public/inbox-preview.css` — settings page head, provider list, detail grid, copy list
- `public/data/inbox-events.preview.json` — settings lane summary
- `docs/ui/reviews/ui-011i-settings-cross-product-cleanup-receipt.md`
- `TODO.md`

## Product UI code changed

**yes**

## Settings IA result

Nine user-facing nav sections (Profile/Workspace, Accounts, Providers, Privacy, Storage, Notifications, AI/Ibal, Automation safety) plus Advanced/Developer. Build evidence, route smoke references, commit SHA, and provider gate fixtures isolated under Advanced.

## User settings result

Profile/workspace pane with display density and default mailbox; saves to canonical envelope; Activity vs Receipts copy in hint.

## Account settings result

Queued account form, metadata-only sync states, CLI connect steps secondary, Connect in browser blocked, no false connected claim, Gmail adapter path documented in collapsible advanced hint.

## Provider settings result

Provider list from `EXTENSION_PROVIDER_CATALOG` filtered to external email/cloud/automation/communication plus local export; each row shows status, permission class, allowed preview, blocked runtime, gate, Activity receipt expectation; View in Integrations navigates to Extensions detail.

## Privacy settings result

Local-only preview data, no tokens in browser, body/draft/send blocked, fixture/redaction policy, Reset local preview state (localStorage only via `resetCanonicalPreviewState()`).

## Storage settings result

Canonical key `xiioInbox.preview.state`, schema version display, evidence/artifact preview-only, export packet preview-only, no cloud backup claim.

## Notifications result

Preview toggles for desktop (no system API), activity digest, calendar reminders; provider notification sync blocked copy.

## AI / Ibal settings result

Proposal-only toggles for compose, reply, task, calendar, automation suggest; runtime send blocked control; no external model runtime claims.

## Automation safety result

Dry-run only default, approval required, reusable action library referenced, send blocked, Open Automations link, Enable rules blocked.

## Advanced / Developer isolation result

Provider gate fixtures, policy fixtures, and build evidence rows in collapsible Advanced pane; schema and storage key shown; primary Settings nav does not surface build evidence as main content.

## Cross-product copy alignment result

Shared `PRODUCT_GATE_COPY` constants for preview-only, metadata-only, browser not connected, send/draft/body blocked, Activity vs Receipts label — reused in Settings panes and aligned with Extensions/Activity language.

## Storage result

Canonical key `xiioInbox.preview.state` only. Schema **v11** adds `settings.ibalPrefs`, `settings.automationSafety`, expanded `userPrefs`, default `selectedKey: user:profile`. v10→v11 and v9→v11 migrations call `migrateSettingsOps()`.

## schemaVersion

**11**

## localStorage keys used

- `xiioInbox.preview.state` (canonical envelope only)

## UI-011B regression result

Mail baseline preserved.

## UI-011C regression result

Drafts + Approval Queue preserved.

## UI-011D regression result

Calendar grid + proposals preserved.

## UI-011E regression result

Tasks planning workflow preserved.

## UI-011F regression result

Automations builder + action library preserved.

## UI-011G regression result

Extensions taxonomy preserved; Settings provider pane links to Extensions detail.

## UI-011H regression result

Activity / Receipts feed and filters preserved; Open Activity from Privacy works.

## Accessibility result

Settings section nav uses buttons with `is-selected`; pane headings and meta lines expose state in text; blocked controls disabled with titles; privacy reset uses confirm dialog.

## Keyboard/focus result

Section nav keyboard reachable via settings list buttons; inspector focus ids on nav rows; independent scroll regions unchanged from prior lanes.

## Safety/egress result

No credentials, OAuth tokens, secrets, provider body read, draft write, send, cloud upload, or external execution. Preview reset clears localStorage only.

## Provider/runtime/platform result

Gmail browser not connected. Metadata CLI documented under Accounts advanced hint. Tier 1 preview only.

## Route smoke result

| Check | Result |
| --- | --- |
| Default app load | 200 |
| Settings JS markers (9 panes + gate copy) | pass |
| Fixture JSON fetch | 200 same-origin |
| Settings lane summary | pass |
| External network requests | **0** |
| Preview server stopped after smoke | yes |

## Same-origin fixture fetch result

`public/data/inbox-events.preview.json` at `127.0.0.1:4488` — pass.

## Remaining blockers

- Real provider connect in browser — blocked
- Owner UI-003E — blocked until UI-012F
- Visual polish implementation — blocked until UI-012 governance allows
- xi-io.net framework freshness backfeed — parallel docs pass after UI-012A

## Next recommended pass

**UI-012A** — Ibal/Rabbit visual parity brief (docs), then **UI-012B–F** visual polish implementation

## Decision value

```text
UI_011I_PASS_CAPABILITY_REPAIRS_READY_FOR_VISUAL_POLISH_GOVERNANCE
```
