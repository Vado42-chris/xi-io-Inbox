# UI-011G Extensions Taxonomy Proof Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`(pending commit)`

## Scope

Extensions taxonomy and provider cards per `docs/product/ui-011a-product-capability-gap-matrix.md` (CAP-EXT-001–010).

## Excluded scope

- UI-011H+ slices
- UI-012 visual polish implementation
- Owner UI-003E visual proof
- Real provider connection / OAuth in browser
- Gmail body read, draft write, send
- Cloud upload/download
- External automation or Discord/Slack execution

## Source matrix references

- CAP-EXT-001 Internal xi-io extensions — first-party marker + internal category section
- CAP-EXT-002 External providers — external marker on provider cards
- CAP-EXT-003 Gmail connect — accurate Gmail card (metadata CLI only, browser not connected)
- CAP-EXT-004 Outlook/Microsoft — blocked provider card
- CAP-EXT-005 Cloud storage — Drive, OneDrive, Dropbox + gated workflows
- CAP-EXT-006 Discord/Slack — communication connector cards
- CAP-EXT-007 Zapier/Make/n8n — automation connector cards vs internal recipes
- CAP-EXT-008 Local tools — local marker + filesystem/redacted export cards
- CAP-EXT-009 Permission/blocked states — status labels, connect/run blocked controls
- CAP-EXT-010 Visual type distinction — category sections, not flat marketplace grid

## Files changed

- `public/inbox-preview.js` — schema v9, provider catalog, taxonomy UI, filters, detail panel
- `public/inbox-preview.css` — taxonomy banner, category tabs, provider cards, detail grid
- `public/data/inbox-events.preview.json` — extensions lane summary/metrics
- `docs/ui/reviews/ui-011g-extensions-taxonomy-proof-receipt.md`
- `TODO.md`

## Product UI code changed

**yes**

## Taxonomy result

Seven user-facing categories: Internal xi-io, Email providers, Cloud storage, Automation connectors, Communication, Local tools, Developer/advanced. Catalog grouped by category when filter is All.

## Internal xi-io extension result

Ibal, Activity/Receipts, Draft Workbench, Evidence Packets, Automation Recipes, Local Export/Redacted Packet Builder with internal marker and preview-only status.

## External provider result

Gmail, Outlook, IMAP (later), Drive, OneDrive, Dropbox, GitHub, Zapier, Make, n8n, Discord, Slack with external marker and honest blocked/metadata-only states.

## Local tool result

Local filesystem/export and redacted packet builder with local marker; no filesystem writes in browser preview.

## Gmail card result

Status metadata_only; documents GMAIL-001C CLI under tools/gmail; body read, draft write, send, and browser OAuth blocked; tokens never in product UI; not connected unless operator CLI evidence exists (default: not connected).

## Cloud storage card result

Google Drive, OneDrive, Dropbox shown as blocked; attach/link/evidence/backup workflows described as future/blocked; no upload.

## Automation connector result

Internal xi-io Automations distinguished from Zapier, Make, n8n; external execution blocked; dry-run recipes referenced for internal path.

## Communication connector result

Discord and Slack cards with outbound communication blocked.

## Provider detail result

Selecting a provider shows permissions, data touched, current gate, allowed preview action, blocked runtime action, related areas, receipt expectations, secret boundary, and blocked Connect/Run controls.

## Filter/search result

Category tabs, status filter chips, and search field filter the catalog.

## Activity/receipt linkage result

Provider gate viewed receipt on selection; install/provision receipts preserved; Open Activity navigates to receipts lane. Full Activity drill-down deferred UI-011H.

## Storage result

Canonical key `xiioInbox.preview.state` only. Schema **v9** adds `extensions.categoryFilter`, `statusFilter`, `searchQuery`, `selectedProviderId`. v8→v9 migration preserves installs/receipts.

## schemaVersion

**9**

## localStorage keys used

- `xiioInbox.preview.state` (canonical envelope only)

## UI-011B regression result

Mail baseline preserved. `npm run check` pass.

## UI-011C regression result

Drafts + Approval Queue preserved.

## UI-011D regression result

Calendar grid + proposals preserved.

## UI-011E regression result

Tasks planning workflow preserved.

## UI-011F regression result

Automations builder + action library preserved.

## Accessibility result

Provider cards and filter chips are buttons with aria-pressed/aria-selected; status in text labels; blocked controls have title/explanation; taxonomy banner role=note.

## Keyboard/focus result

Cards and filters keyboard reachable; inspector focus sync for `extensions:provider:*` ids.

## Safety/egress result

No credentials, OAuth tokens, secrets, or provider runtime in browser preview. secrets/ remains gitignored.

## Provider/runtime/platform result

No provider connected in browser. Gmail metadata CLI documented separately. Tier 1 preview only.

## Route smoke result

| Check | Result |
| --- | --- |
| Default app load | 200 |
| Extensions taxonomy JS markers | pass |
| Fixture JSON fetch | 200 same-origin |
| External network requests | **0** |
| Preview server stopped after smoke | yes |

## Same-origin fixture fetch result

`public/data/inbox-events.preview.json` at `127.0.0.1:4488` — pass.

## Remaining blockers

- CAP-EXT-003 live Gmail browser connect — blocked; operator CLI only
- CAP-AUTO-010 / Activity full drill-down — deferred UI-011H
- Owner UI-003E blocked until UI-011I + UI-012F
- Visual polish blocked until UI-011I + UI-012F

## Next recommended pass

**UI-011H** — Activity / Receipts user-facing repair

## Decision value

```text
UI_011G_PASS_EXTENSIONS_TAXONOMY_READY_FOR_ACTIVITY_REPAIR
```
