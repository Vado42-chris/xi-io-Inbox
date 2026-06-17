# Component drift register

Living register of atomic element inconsistencies. Update during each workspace peer review. Fix in **batches** (see global findings), not one-off per page.

## Legend

- **Expected** — UI-013C / `:root` tokens in `public/inbox-preview.css`
- **Severity** — P0 trust · P1 drift · P2 polish
- **Status** — Open · In progress · Fixed @ SHA · Won't fix (scaffold-only)

---

## Shell / chrome

| Element | Expected | Actual (2026-06-17) | Severity | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `.app-topbar` | `--radius-chrome`, single background | Glass box + nav layer history | P1 | Open | Partial fix in CSS layers |
| `.env-status-badge` | `--type-label`, 3px radius | Long technical string, repeated | P0 | Open | B1 |
| `.product-nav-item` | 3px chrome; active = inset indicator | Pill container history + lane glow | P1 | Open | B4 |
| `.product-level-nav` | Flat inside topbar | Was nested pill background | P1 | Fixed partial | Owner Mail pass removed nested pill |

## Actions

| Element | Expected | Actual | Severity | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `.inbox-action-btn.is-primary` | Lane accent or token primary | Gradient glow varies by lane | P1 | Open | B4 |
| `.inbox-action-btn.is-blocked` | De-emphasized, not in primary row | Prominent in Mail reading actions | P1 | Open | B5 owner mode |
| `.ibal-concierge-btn` | Matches primary set | Duplicated in inspector | P1 | Open | B2 |

## Surfaces

| Element | Expected | Actual | Severity | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `.mail-setup-guide` | One owner setup pattern | Multiple banner types still exist | P1 | In progress | B3 |
| `.gmail-sync-status-panel` | Advanced/settings only | Shown in Mail header stack (scaffold) | P1 | Open | B5 |
| `.trust-affordance-warn` | Rare; one per viewport | Every lane has yellow slab | P1 | Open | B1 |
| `.thread-list-panel` | `--radius-md`, readable row height | Cramped rows, meta chip stack | P0 | In progress | Mail owner row CSS |
| Card / `.lane-item` | `--radius-md`, `--space-4` padding | Mixed 8–12px, tight meta grids | P1 | Open | |

## Navigation

| Element | Expected | Actual | Severity | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `.lane-nav` / context nav | Minimal folders | Drafts/Approvals/Imported snapshots sections | P1 | Fixed partial | Owner Mail UX hides |
| `.scope-lens` | When multi-account meaningful | On Calendar/Tasks/Activity always | P1 | Open | B5 |
| Right inspector | Contextual | Same Related/Provider template | P1 | Open | B2 |

## Typography

| Element | Expected | Actual | Severity | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Page H1 | `--type-display` once | Mail workspace eyebrow + title + inspector title | P1 | Open | Per-workspace receipts |
| Meta / labels | `--type-label` | ALL CAPS scattered | P2 | Open | |
| User-facing copy | Plain language | Tier 1, CLI, fixture, metadata-only | P0 | Open | B1 copy pass |

---

## Register changelog

| Date | Change |
| --- | --- |
| 2026-06-17 | Initial register from owner screenshot peer review program |
