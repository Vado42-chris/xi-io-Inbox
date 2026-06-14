# UI-016 Level 5 Componentization and Consistency Index

## Status

```text
Type: Level 5 wargaming audit + component ownership index.
Depends on: UI-015 Level 4 lane purpose and journey index.
Blocks: claiming the preview is componentized or framework-ready.
Unblocks: focused strangler extraction planning.
```

Level 5 is where reusable components must become intentional. The current preview has
emergent component patterns, but it is not actually componentized: `public/inbox-preview.js`
and `public/inbox-preview.css` remain the runtime surface.

## Verdict

```text
LEVEL_5_AUDIT_RESULT = NOT_COMPONENTIZED_YET
```

The product has reusable ideas and repeated visual grammar, but it still looks and behaves
like a monolithic static preview. It is not yet polished enough to outperform generic
AI-generated interfaces.

## Design docs required for consistency

| Required doc | Purpose | Status |
| --- | --- | --- |
| `UI-013 Level 2 Visual Experience System` | Brand thesis, token reset, typography, depth, lane personality, premium visual standard. | Planning doc created; implementation required before owner visual proof. |
| `UI-014 Level 3 Contextual Cross-Pollination Map` | Page-specific related-object zones and anti-silo rules. | Planning doc created; implementation required before lane polish claims. |
| `UI-015 Level 4 Lane Purpose and Journey Index` | Lane promises, journeys, failure points, Level 5 prep. | Complete. |
| `UI-016 Level 5 Componentization and Consistency Index` | Component inventory, duplication audit, framework/repo/template ownership. | This doc. |
| `Component Anatomy Spec` | Standard props/slots/states for shell, scope lens, receipt row, provider gate, related object rail, cards, sheets. | UI-016B doc created; check scripts pending. |
| `Visual QA Checklist` | No AI-slop gate: hierarchy, lane identity, contrast, density, copy, motion, empty/error states. | UI-013 defines gate; executable checklist still needed before UI-003E. |
| `Framework Backfeed Plan` | What moves to `xi-io.net`, what stays here, what becomes reusable template material. | Backfeed standard created; xi-io.net update pending. |

## Existing component-like patterns

| Pattern | Current anchors | Assessment |
| --- | --- | --- |
| App shell | `renderShell`, `renderTopBar`, `renderProductLevelNav`, `renderContextualLeftRail`, `renderInspector` | Strong candidate, but route/nav config is not a real contract yet. |
| Pills/status chips | `renderPill`, `renderPillRow`, `renderThreadStatusChip`, `.pill-*`, `.thread-status-chip` | Reusable primitive; needs anatomy spec and lane-specific semantics. |
| Trust/status grammar | `renderTrustToken`, `providerAccountStatusSummary`, `.trust-token`, `.env-status-badge` | Good framework candidate; currently under-designed visually. |
| Context nav | `contextNavButton`, `renderContextNavSection`, per-lane nav renderers | Useful pattern, but repeated arrays should become route/context config. |
| Receipt rows | `local-receipt-row`, Activity ledger, `render*LocalReceipts` variants | High-value reusable component; currently duplicated. |
| Provider gates | Extensions cards, Settings gates, blocked action copy | Strong framework/template candidate; needs consistent card/detail anatomy. |
| Forms/sheets | Compose, Calendar, Tasks, Automations, Extensions, Settings sheets | Repeated modal/form shell; should become a shared sheet component. |
| Detail grids | Calendar object summary, Activity detail, Extensions detail, Settings detail | Repeated `<dl>` pattern; should become `XiDetailGrid`. |
| Work-item cards | Tasks kanban, stories, bugs, evidence panels | Repo/split candidate; visual grammar needs Level 2. |
| Calendar proposals | Proposal detail, month/week/day panels | Split candidate; currently too cramped and not premium. |

## Repeated one-offs that must be collapsed

| Duplication | Risk | Level 5 action |
| --- | --- | --- |
| `renderCalendarLocalReceipts`, `renderTasksLocalReceipts`, `renderAutomationsLocalReceipts`, `renderExtensionsLocalReceipts`, `renderSettingsLocalReceipts` | Receipt UI diverges and failures hide by lane. | Create one receipt-list helper before module extraction. |
| `renderCalendarProviderBanner` and `renderTasksProviderBanner` | Trust/blocked-provider language drifts. | Create provider/trust banner component. |
| Per-lane edit sheets | Forms look and behave inconsistently. | Create shared sheet/form anatomy. |
| Multiple detail grid CSS blocks (`extensions-detail-grid`, `settings-detail-grid`, `activity-detail-grid`) | Data hierarchy varies by lane. | Create shared detail grid component/class. |
| Context nav arrays in JS | Nav/routing can drift from product IA. | Convert to one route/context table. |
| Activity/log/receipt rows | Audit trail can look disconnected from source lanes. | Use one receipt row and continuation link model. |
| Task/story/bug/evidence cards | Tasks can become disconnected mini-apps. | Use one `XiWorkItemCard` with typed badges. |

## Consistency issues present now

| Issue | Why it matters | Gate |
| --- | --- | --- |
| Monolith instead of modules | Components cannot be reused or tested independently. | No "componentized" claim until `public/src/*` extraction starts. |
| CSS selector sprawl | New features require more lane-specific selectors. | New UI must use shared component classes or update UI-016. |
| Flat visual system | Current surfaces feel like dark admin panels, not boutique product design. | UI-013 must precede owner visual proof. |
| Route labels differ from lane IDs | `receipts`/Activity and `extensions`/Integrations can drift. | Route table must own labels and hashes. |
| Drafts/Approvals are sub-views but not deep-linked | Mail workbench can be hard to cite/resume. | Workbench route contract needed before extraction. |
| Scope lens missing outside Mail | Calendar/Tasks cannot yet meet multi-account promise. | SCOPE-001 remains blocking. |
| Provider and runtime non-claims vary by lane | Users may mistake preview actions for live execution. | Shared blocked-action component required. |
| Visual states are mostly borders | Active/blocked/proposed/complete states lack memorable lane personality. | Level 2 lane identity tokens required. |

## Ownership index

| Component candidate | Current state | Owner | Extraction priority | Blocking dependency |
| --- | --- | --- | --- | --- |
| `XiRouteTable` / primary nav config | Hard-coded nav + routing helpers | Framework with repo config | P0 | None; should lead extraction. |
| `XiAppShell` | `renderShell` + topbar/frame/inspector | Framework with repo adapters | P0 | Route table. |
| `XiContextNav` | Shared helper plus repeated lane arrays | Framework | P0 | Route/context table. |
| `XiScopeLens` | Mail account filter only; Calendar/Tasks missing | Framework | P1 | SCOPE-001/accountId model. |
| `XiReceiptRow` / `XiReceiptList` | Duplicated local receipt renderers | Framework | P0 | Receipt anatomy spec. |
| `XiProviderGateCard` | Extensions/Settings provider cards | Framework | P1 | Provider gate anatomy spec. |
| `XiBlockedActionBar` | Disabled action/toolbars repeated | Framework | P1 | Safety copy contract. |
| `XiRelatedObjectRail` | Partial rail outcomes and source links | Framework | P1 | UI-014 cross-pollination map. |
| `XiDetailGrid` | Repeated `<dl>` grids | Framework | P0 | Anatomy spec. |
| `XiSheet` / `XiFormShell` | Repeated modal sheets | Framework | P1 | Form state contract. |
| `XiCalendarProposalCard` | Calendar detail/proposal UI | Split | P2 | UI-013 visual redesign + SCOPE-001. |
| `XiWorkItemCard` | Tasks/story/bug cards | Split | P2 | UI-014 cross-lane object model. |
| `XiAutomationDryRunTrace` | Dry-run panel exists | Framework candidate | P2 | Another product proof or stronger template need. |
| Gmail metadata/body snapshot import | Hardened repo-specific logic | This repo | Keep local | Privacy/provider specificity. |
| Mail reading pane/workbench internals | Product-specific | This repo with framework primitives | P2 | Mail route/deep-link contract. |
| Brand theme / lane personality tokens | Token layer exists but bland | Template + repo | P1 | UI-013 visual direction. |

## Extraction order

1. Create `XiRouteTable` as a data contract; primary nav, hash route, active workspace, and context rails read from it.
2. Collapse receipt rendering into one `XiReceiptList` helper.
3. Collapse detail grids into `XiDetailGrid`.
4. Collapse provider/trust banners and blocked action rows.
5. Add `XiScopeLens` after `accountId` model decisions.
6. Extract app shell into `public/src/shell/`.
7. Extract framework candidates only after this repo proves stable anatomy.
8. Backfeed framework candidates to `xi-io.net#239` with exact repo evidence.

## Level 5 failure index

| Failure | Symptom | Prevention |
| --- | --- | --- |
| Component theater | Helpers renamed but monolith still owns everything. | Require module boundary and import path for "componentized" claims. |
| Over-generalization | Gmail/privacy-specific logic moved to framework. | Keep provider adapters repo-local. |
| Under-generalization | Receipt/gate/scope patterns repeated in every product. | Promote framework candidates after anatomy stabilizes. |
| Visual inconsistency | Shared components still look bland or lane-agnostic. | UI-013 token/identity pass before UI-003E. |
| Template leakage | Repo-specific product copy becomes template default. | Template slots own labels; repo owns final copy. |
| Silent regression | One lane uses old local receipt/detail markup. | Component-boundary checks must scan for banned duplicate renderers. |
| Broken cross-pollination | Extracted components do not support related-object slots. | UI-014 must define related-object slots before final anatomy. |

## Checks needed before extraction

- [x] A route-table check: every primary nav item has label, route, lane, context rail, owner.
- [ ] A duplicate-receipt-renderer check: only one local receipt list renderer remains.
- [ ] A duplicate-detail-grid check: detail grids use one shared class/helper.
- [ ] A blocked-action check: every provider/dry-run/send action uses shared blocked-action grammar.
- [ ] A scope-lens check: Mail, Calendar, Tasks, Activity use the same account scope contract.
- [ ] A visual QA check: screenshots prove lane identity, hierarchy, and premium polish.
- [ ] A framework ownership check: every extracted component is tagged `framework`, `repo`, `split`, or `template`.

## Level 5 readiness checklist

- [x] Existing component-like patterns inventoried.
- [x] Repeated one-off UI patterns identified.
- [x] Consistency/polish risks listed.
- [x] Framework/repo/split/template ownership assigned.
- [x] Extraction order defined.
- [x] UI-013 visual direction doc complete.
- [x] UI-014 cross-pollination map doc complete.
- [x] Component anatomy spec doc complete.
- [ ] Component-boundary checks implemented.
- [ ] First strangler extraction complete.

## Decision value

`UI_016_LEVEL_5_COMPONENTIZATION_AUDIT_COMPLETE_EXTRACTION_NOT_STARTED`

