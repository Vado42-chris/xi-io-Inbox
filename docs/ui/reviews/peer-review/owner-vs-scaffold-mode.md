# Owner mode vs scaffold mode

## Problem

The static preview serves two audiences at once:

- **Owners / users** — want a modern mail-first experience with one clear next step.
- **Agents / gates** — need receipts, provider gates, Ibal proposals, fixtures, and blocked-action proof.

Showing both at full volume on every page reads as overwhelming and inconsistent.

## Decision (2026-06-17)

| Mode | Audience | Default surfaces |
| --- | --- | --- |
| **Owner** | Product users | Mail folders, one setup card, compose/search, reading pane; minimal inspector |
| **Scaffold** | Agents, CI, egress proof | Drafts/approvals rails, receipt ledgers, gate grids, fixture narratives, CLI hints |

## Code switch (preview)

- `OWNER_MAIL_UX = true` in `public/inbox-preview.js` — Mail lane owner simplification (sidebar, setup guide, no sample drafts).
- `OWNER_ACCOUNT_UX = true` — Account drawer owner simplification (connect/sync/trust; operator tools in Advanced).
- Developer re-enable full scaffold: `state.settings.userPrefs.showWorkflowScaffold = true` (localStorage-backed).

## Doc implication for peer review

Peer review findings tagged **Scaffold** should be fixed by **hiding or collapsing** in Owner mode, not deleted from codebase until egress/scaffold gates close.

## Target end state

- Owner mode: top-tier mail/calendar/tasks **input-forward** UX.
- Scaffold mode: available under Advanced, Settings debug, or agent flag — not default nav noise.
