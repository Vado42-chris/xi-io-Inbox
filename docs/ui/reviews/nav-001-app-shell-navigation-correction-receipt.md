# NAV-001 App Shell Navigation Correction Receipt

## Date

2026-06-10

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`62af2dcbcf2c972f6669f9aec593de381cf3b651`

## Scope

NAV-001 app shell / navigation correction after UI-012C — product header, level-1 nav, contextual left rail, Settings demotion, Help replacement, account/provider status placement, GMAIL-002 ingress plan docs.

## Excluded scope

- UI-012D interaction/state polish
- GMAIL-002A implementation (metadata bridge runtime)
- Gmail body read, draft write, send
- schemaVersion / localStorage shape changes
- Fixture/data model changes
- Provider runtime / browser OAuth
- Owner UI-003E
- PR #12 merge or ready-for-review

## Source screenshots / user feedback reference

Peer review (2026-06-10): UI-012C screenshots — center “P Personal Gmail preview” header identity, global left-rail lanes, weak Help accordion, Settings as primary nav.

## Files changed

- `public/inbox-preview.js` — header nav, contextual left rail, nav handlers
- `public/inbox-preview.css` — NAV-001 shell/nav styles
- `docs/product/nav-001-app-shell-navigation-correction.md`
- `docs/product/gmail-002-real-email-ingress-plan.md`
- `docs/ui/polish/ui-012-visual-polish-governance.md` — sequencing update
- `TODO.md`

## Product UI code changed

**yes** (JS + CSS nav wiring; no schema/fixture changes)

## Top header result

Top-left **XI-IO Inbox** with environment badge `Preview · Local · Metadata-only`. Center account/debug identity removed from header.

## Level-1 nav result

Top bar: Mail, Drafts, Approvals, Plan, Automations, Activity, Integrations. Settings removed from primary workflow nav.

## Contextual left rail result

Left rail is workspace-scoped level-2 navigation with required item groups per workspace; global lane link list removed.

## Settings placement result

Settings opens from account drawer utility actions; contextual Settings sections available when `#/settings` lane active.

## Help replacement result

Weak header Help accordion removed. `?` contextual help panel added with workspace-specific copy and egress policy statements.

## Ask Ibal preservation result

Ask Ibal remains globally visible top-right; not hidden behind navigation.

## Search preservation result

Search/command field remains globally visible top-right with expanded placeholder mental model.

## Product identity result

Product identifier **XI-IO Inbox** preserved top-left; not replaced by account identity.

## Account/provider state result

Account/provider status moved to top-right account control and drawer with honest preview / not-connected / CLI path copy.

## Real email ingress plan result

**yes** — `docs/product/gmail-002-real-email-ingress-plan.md` (GMAIL-002A–D staged; Google scope doc cited).

## Persistence result

**yes** — `docs/product/nav-001-app-shell-navigation-correction.md` records rationale, nav model, UI-012D pause, GMAIL-002A relationship.

## Accessibility result

Keyboard-reachable nav buttons; help panel dismissible; focus-visible styles preserved from UI-012B; logical header order (identity → product nav → utilities); color not sole indicator for active nav (`aria-current`, borders). No keyboard trap introduced in smoke pass.

## Accessibility references used

- [WCAG 2.2 (W3C Recommendation)](https://www.w3.org/TR/WCAG22/) — Keyboard (2.1), Focus Visible (2.4.7), Focus Order (2.4.3), Headings and Labels (2.4.6), Use of Color (1.4.1), Consistent Navigation (3.2.3), Consistent Identification (3.2.4)
- [NN/g Ten Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) — consistency, visibility of system status, recognition over recall

## Regression result (UI-011B–I, UI-012A–C)

Preserved: mail workbench, drafts/approval queue, calendar, tasks, automations builder, extensions taxonomy, activity ledger, settings IA, UI-012B tokens, UI-012C layout tokens, blocked provider/runtime/send gates.

## Storage result

Canonical key unchanged: `xiioInbox.preview.state` only. No new localStorage keys.

## schemaVersion

**11** (unchanged)

## localStorage keys used

- `xiioInbox.preview.state` (canonical)
- Migration read-only: `xiioInbox.preview.ui005b`, legacy `xiio-inbox-preview-state-v2` (unchanged)

## Safety/egress result

Provider blocked honesty preserved. No body read, draft write, send, or external execution enabled.

## Provider/runtime/platform result

Browser preview not connected. Gmail CLI path documented in account drawer only.

## Route smoke result

**pass** — Playwright smoke (local Chrome, `http://127.0.0.1:4488`): default load, product ID, 7 workspaces, contextual rails, Ask Ibal, Search, account status, help control, provider honesty.

## External network request result

**0** external HTTP(S) requests during smoke (same-origin fixture fetch only).

## Same-origin fixture fetch result

**yes** — `./data/inbox-events.preview.json` fetched from preview origin during load.

## Owner proof gate result

**blocked** until UI-012F (unchanged).

## Remaining blockers

- Real Gmail metadata ingress (GMAIL-002A) not implemented
- UI-012D–F polish passes remain
- Owner UI-003E blocked until UI-012F
- PR #12 draft; framework package import blocked by `xi-io.net#239`

## Next recommended pass

**GMAIL-002A** — local Gmail metadata bridge per `docs/product/gmail-002-real-email-ingress-plan.md`. UI-012D may resume after GMAIL-002A unless product owner explicitly prioritizes interaction polish first.

## Self peer review

`docs/ui/reviews/nav-001-self-peer-review.md` — regression repair for mail folders/mailboxes/views; plan/compliance sync.

## Decision value

`NAV_001_PASS_READY_FOR_GMAIL_002A_OR_UI_012D`
