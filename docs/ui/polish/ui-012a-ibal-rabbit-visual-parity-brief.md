# UI-012A Ibal / Rabbit Visual Parity Brief

## Status

```text
Audit: COMPLETE (local references inspected 2026-06-11)
Implementation: BLOCKED until UI-012B
Owner visual proof: BLOCKED until UI-012F
```

Parent governance: `docs/ui/polish/ui-012-visual-polish-governance.md`

Supersedes partial checklist in `docs/ui/polish/ui-012a-rabbit-mod-visual-parity-brief.md` (redirect only).

---

## 1. What “Ibal / Rabbit visual parity” means for xi-io Inbox

**Parity is not a pixel clone of Rabbit_mod or the ibal management console.**

For xi-io Inbox, **Ibal/Rabbit visual parity** means:

1. **Shared xi-io visual language** — adopt the disciplined token, spacing, typography, focus, pill, and navigation-selected patterns proven in `xi-io.net` framework CSS and refined in `xi-io: ibal` (local clone `016_Rabbit_r1`, GitHub `Vado42-chris/xi-io-Rabbit_mod`).
2. **Email-first product posture** — Mail, Drafts, and Approval Queue remain the primary visual gravity; polish must not turn Inbox into an admin console or device preview shell.
3. **Ibal as conductor, not lane** — match ibal’s proposal clarity, evidence citation, and blocked-action honesty, but through Inbox’s **context rail + concierge drawer**, not ibal’s sidebar page model.
4. **Honest safety grammar** — preview-only, metadata-only, blocked, and provider-gated states must remain visually obvious without alarm-banner clutter (aligned with UI-011 gate copy).
5. **Framework export readiness** — patterns proven in UI-012B–F become candidates for `16-white-label-framework-feedback-plan.md` and eventual `xi-io.net#239` package path.

**Explicit non-goals (do not port from Rabbit/ibal):**

- Device preview iframe pane (`public/device/`)
- ibal management pages (Connections telemetry, Model Config, Diagnostics console)
- Orange ibal brand override as Inbox primary accent (Inbox may keep product accent; document in UI-012B)
- Runtime connection dots, health pills tied to live sockets
- OAuth/runtime/device shell behaviors

---

## 2. Visual reference inventory

| Reference | Location | Inspected? | Relevance |
| --- | --- | --- | --- |
| xi-io Inbox static preview CSS/JS | `public/inbox-preview.{css,js}` | **yes** (read-only audit) | Baseline to polish |
| xi-io Inbox visual standard | `docs/ui/polish/00-xi-io-visual-product-standard.md` | **yes** | Product principles |
| xi-io Inbox interaction standard | `docs/ui/polish/11-interaction-standard.md` | **yes** | Keyboard/focus rules |
| UI-011I settings gate copy | `public/inbox-preview.js` `PRODUCT_GATE_COPY` | **yes** | Cross-product language |
| xi-io.net framework tokens | `/media/.../xi-io.net/public/styles.css` | **yes** | `--space-*`, `--accent`, pills, nav active |
| xi-io: ibal styles | `/media/.../016_Rabbit_r1/public/style.css` | **yes** | Comfort scale, nav-item, icon-btn, status cluster |
| ibal UI surface map | `016_Rabbit_r1/docs/product/xi-io-ibal-ui-surface-map-v1.md` | **yes** | IA contrast (admin vs Inbox) |
| ibal a11y report | `016_Rabbit_r1/docs/reports/XIIO-IBAL-UX-A11Y-FRAMEWORK-HOOKS-001.md` | **yes** | Scale, touch targets, focus |
| ibal product identity | `016_Rabbit_r1/docs/product/xi-io-ibal-product-identity-v1.md` | **yes** | Ecosystem roles |
| UI-003E owner checklist | `docs/ui/reviews/ui-003e-owner-visual-proof-packet.md` | **yes** | Proof gate targets |
| Prior partial brief | `docs/ui/polish/ui-012a-rabbit-mod-visual-parity-brief.md` | **yes** | Checklist seeds |
| xi-io-emulator branding | `/media/.../015_emulator/public/branding`, `icons.svg` | **partial** (asset listing only) | Not Inbox mail parity source |
| GitHub Rabbit_mod remote | `Vado42-chris/xi-io-Rabbit_mod` | **not separately** | Covered by local `016_Rabbit_r1` |
| 000_Xibalba repo | not inspected | **no** | No Inbox visual artifacts found |
| Live running previews | not required for UI-012A | **no** | Static file audit sufficient |

---

## 3. Product visual principles (Inbox polish north star)

| Principle | Definition for Inbox |
| --- | --- |
| Email-first | Mail list + reading pane hierarchy wins; other lanes share grammar, not identical layout |
| Draft-centered | Drafts and Approval Queue visually continuous with Mail; compose/reply sheets feel primary |
| Calm under load | High information density without equal-weight noise; muted metadata, strong object titles |
| User-facing language | No engineering-console tone in primary surfaces (Settings user sections already repaired UI-011I) |
| Strong selected states | Selected thread, row, tab, provider, activity entry obvious by weight + border/background + text |
| Low cognitive load | Progressive disclosure; collapsible advanced/build evidence stays secondary |
| Inspectable receipts | Activity rows and receipt metadata scannable; Activity ≠ hidden logs |
| Safe blocked actions | Blocked controls look disabled **and** explain why in text/tooltip nearby |
| Accessibility-first | Focus visible, no color-only state, readable density, keyboard-safe scroll regions |
| Clear local/provider boundary | Browser-not-connected and metadata-only visually distinct from preview-only internal tools |

---

## 4. Screen-level polish goals

| Screen | Goal | Rabbit/ibal signal | Inbox current (audit) | Target pass |
| --- | --- | --- | --- | --- |
| Mail / Inbox | Thread list rhythm, unread weight, folder nav icons, reading hierarchy | nav-item density, card/list discipline | partial (`thread-row`, text nav) | 012C + icons 012B |
| Drafts | Same list grammar as Mail; status chips for drafting/queued | status pills | partial | 012C |
| Approval Queue | Queue urgency without alarm; approval state chips | pill grammar | partial | 012C |
| Calendar | Grid alignment, proposal row clarity, conflict emphasis | page section rhythm | capability OK (011D), visual gap | 012C |
| Tasks / Planning | Kanban card density, backlog/epic hierarchy | card spacing | partial | 012C |
| Automations | When→If→Then builder scanability; dry-run emphasis | form sections | partial (011F) | 012C |
| Extensions | Category tabs + provider cards; internal vs external markers | extension cards | partial (011G) | 012C |
| Activity | Feed + detail two-column; filter chips; build evidence subdued | ledger rows | repaired (011H), polish gap | 012C |
| Settings | User-first nav (011I); Advanced visually secondary | settings sections | IA OK, visual refinement | 012C |
| Ibal / context rail | Proposal-only visible; conductor recommendations; concierge drawer | ibal panels (reference tone) | partial (`ibal-concierge-*`) | 012D |
| Account / provider states | Queued/metadata/blocked badges consistent across Mail, Settings, Extensions | conn-dot, health-pill **pattern only** | text labels | 012B chips |

---

## 5. Component-level polish goals

| Component | Goal |
| --- | --- |
| App shell | Tokenized spacing; top bar grid stable at 320px+; trust/help not competing with title |
| Navigation | Lane nav selected state matches framework `nav-button.is-active` / ibal `nav-item.active` discipline |
| Cards | Single elevation level; no card-in-card; object cards for repeated items only |
| Lists | Consistent row height band (compact/comfortable); hover/focus/selected trinity |
| Detail panes | Title → meta → body → actions; actions toolbar aligned |
| Forms | Label hierarchy; hint text muted; primary vs blocked secondary actions |
| Status chips | Adopt framework pill grammar (`pill-ok`, `pill-warning`, `pill-neutral`) |
| Provider badges | external / internal / local markers from Extensions taxonomy |
| Blocked-state banners | Compact module, not full-width warning slabs |
| Action buttons | Primary, secondary, blocked, danger variants with shared min-height |
| Modals / disclosures | Compose sheet, settings edit sheet, `<details>` rhythm consistent |
| Activity rows | Timestamp + outcome + scope scannable in one line |
| Receipt metadata | Detail grid labels uppercase-muted (Settings pattern) |
| Evidence placeholders | Attachment rows show blocked/upload state in text |
| Calendar grid | Cell borders subtle; today/selected states textual + visual |
| Task board | Column headers stable; card focus ring consistent |
| Automation builder | Step connectors visual; library rows match list grammar |
| Extension cards | Category color accent subtle; status in chip not color alone |

---

## 6. Visual distinction rules

| Class | Visual treatment |
| --- | --- |
| Internal xi-io tools | Neutral panel + “internal” chip; preview-only copy nearby |
| External providers | External marker, OAuth/requires gate chip, connect/run blocked styling |
| Local-only tools | “Local” chip; no cloud iconography |
| Preview-only features | Muted meta line using `PRODUCT_GATE_COPY.previewOnly` |
| Metadata-only integrations | Distinct from connected; e.g. Gmail metadata CLI path in disclosure |
| Blocked runtime actions | `is-blocked` button style + explanatory hint; no fake enabled affordance |
| Advanced / developer evidence | Collapsed by default; monospace SHA only inside Advanced/Build evidence |

---

## 7. Ibal / context rail guidance

| Topic | Guidance |
| --- | --- |
| Compose suggestions | Show as proposal cards with “proposal_only” state label; no send CTA |
| Reply proposals | Link to draft/thread source; blocked send repeated in rail |
| Task / calendar suggestions | Cross-lane chips; open-source navigation on accept preview |
| Automation suggestions | Dry-run language; link to Automations lane |
| Blocked-action explanations | Plain language in rail body, not red walls |
| Source / evidence awareness | “From Mail · thread X” pattern; inspector sync |
| No fake runtime claims | No “connected model” unless proven; proposal-only badge persistent |
| Proposal-only mode | Visible in concierge header meta + Settings AI/Ibal section alignment |

**Layout rule:** Ibal stays **concierge drawer + context rail**, not a primary left nav lane (per UI-005H / UI-003E checklist).

---

## 8. Accessibility baseline (UI-012E enforces; B–D must not regress)

| Requirement | Target |
| --- | --- |
| Visible focus | 2px outline on `:focus-visible`; accent token (framework parity) |
| No color-only state | Selected/unread/blocked always have text or icon weight |
| Contrast | WCAG 2.2 AA for text and controls on dark surfaces |
| Keyboard navigation | Tab order: top bar → lane nav → primary content → inspector/rail |
| Readable density | Optional comfort scale later; minimum 44px touch targets on mobile widths |
| Reduced clutter | One status message region per lane; avoid duplicate gate copy |
| Independent scroll safety | Focus not trapped in list/reading/inspector scroll regions |
| Disabled controls | `disabled` + visible explanation (title or adjacent hint) |

Reference: ibal `--ui-scale` comfort system is a **candidate** for Inbox density toggle (Settings Profile), not required in UI-012B.

---

## 9. Parity audit scores (top gaps)

Score: **match / partial / gap / n/a**

| ID | Area | Score | Evidence |
| --- | --- | --- | --- |
| PAR-001 | Design token layer | **gap** | Inbox ad hoc `--bg`; framework has `--space-1..6` |
| PAR-002 | Accent semantics | **partial** | Inbox `--cyan`; framework teal; ibal orange override |
| PAR-003 | Typography scale | **partial** | Inbox Inter only; no modular scale |
| PAR-004 | Icon grammar | **gap** | Rabbit `icon-btn`; Inbox text badges |
| PAR-005 | Nav selected state | **partial** | Inbox lane nav vs ibal `nav-item.active` |
| PAR-006 | Status pills | **partial** | Framework pills exist; Inbox uses mixed `label()` text |
| PAR-007 | Mail list density | **partial** | UI-011B structure OK |
| PAR-008 | Focus ring | **match** | Both use 2px outline pattern |
| PAR-009 | Comfort/density scale | **gap** | ibal `--ui-scale`; Inbox density pref not wired to CSS |
| PAR-010 | Ibal conductor UX | **partial** | Concierge exists; polish below ibal panel refinement |
| PAR-011 | Blocked action styling | **partial** | `is-blocked` present; inconsistent across lanes |
| PAR-012 | Build evidence demotion | **match** | UI-011H + Settings Advanced isolation |

**Top 10 polish priorities for UI-012B–F:**

1. Token layer (`--space-*`, semantic colors, radius, shadow)
2. Button + chip component alignment
3. Lane navigation selected/hover/focus
4. Mail thread list + reading pane hierarchy
5. Drafts + Approval Queue continuity
6. Status pill grammar across lanes
7. Ibal concierge + context rail proposal styling
8. Extensions provider card refinement
9. Activity feed row + detail density
10. Settings user nav visual refinement (Advanced stays quiet)

**UI-012B–F scope estimate:** 4–5 implementation passes + UI-012F gate doc.

---

## 10. UI-012B–F sequence (implementation)

### UI-012B — Visual token / component alignment

| Field | Value |
| --- | --- |
| Allowed | `public/inbox-preview.css`, `public/index.html` (font links only), `docs/ui/reviews/ui-012b-*` |
| Forbidden | Provider/runtime behavior, `inbox-preview.js` logic changes except class hooks |
| Validation | `npm run check`, route smoke, no external network |
| Decision | `UI_012B_PASS_TOKENS_COMPONENTS_READY_FOR_LAYOUT` / partial / fail |
| Exit | Token comments map to framework; buttons/chips/pills/nav share one grammar |

### UI-012C — Layout / composition polish

| Field | Value |
| --- | --- |
| Allowed | `public/inbox-preview.css`, `public/inbox-preview.js` (layout class hooks only), lane-specific CSS |
| Forbidden | New capabilities, provider connect, send |
| Validation | `npm run check`, route smoke all lanes, regression UI-011B–I |
| Decision | `UI_012C_PASS_LAYOUT_COMPOSITION_READY_FOR_INTERACTION` / partial / fail |
| Exit | Mail-first layouts polished; calendar/tasks/automations/extensions/activity/settings rhythm consistent |

### UI-012D — Interaction / state polish

| Field | Value |
| --- | --- |
| Allowed | CSS + JS for hover/selected/loading/empty/disabled states |
| Forbidden | Runtime execution, OAuth |
| Validation | route smoke + keyboard spot-check documented in receipt |
| Decision | `UI_012D_PASS_INTERACTION_STATES_READY_FOR_A11Y` / partial / fail |
| Exit | Selected/focus/hover consistent; Ibal proposal states obvious |

### UI-012E — Accessibility / contrast / focus polish

| Field | Value |
| --- | --- |
| Allowed | CSS focus/contrast/density; minor ARIA text tweaks in JS if needed |
| Forbidden | Reducing focus visibility for aesthetics |
| Validation | contrast checklist in receipt; keyboard route smoke |
| Decision | `UI_012E_PASS_A11Y_BASELINE_READY_FOR_FINAL_GATE` / partial / fail |
| Exit | WCAG-oriented checklist signed in receipt |

### UI-012F — Final visual readiness gate

| Field | Value |
| --- | --- |
| Allowed | docs receipts, PR body, optional screenshots under `docs/ui/reviews/` |
| Forbidden | Owner PASS claim without human sign-off |
| Validation | `npm run check`; owner packet checklist prepared |
| Decision | `UI_012F_PASS_VISUAL_READY_FOR_OWNER_PROOF` / partial / fail |
| Exit | Unblocks **UI-003E** owner visual proof (human), not agent self-PASS |

---

## 11. Gates (unchanged)

- **UI-003E** owner visual proof — blocked until **UI-012F** receipt + human checklist
- **PR #12** — remains draft through UI-003E
- **Merge prep** — blocked until owner PASS
- **UI-012A** — does **not** make the app visually complete

---

## Decision value (UI-012A)

```text
UI_012A_PASS_VISUAL_POLISH_SEQUENCE_READY
```
