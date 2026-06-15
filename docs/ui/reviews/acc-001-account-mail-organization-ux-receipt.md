# ACC-001 Account Mail Organization UX Receipt

## Date

2026-06-12

## Branch

`ui-002/framework-derived-static-preview`

## Commit SHA

`e117bf8fc5791af53dd617be3f16ed6909f0b8d2`

## Scope

ACC-001 account model + mail organization UX — mail vs integration taxonomy, per-account accordion nav, grouped thread lists, unified account status, GitHub under Integrations not Mail, Ibal/Activity linkage.

## Excluded scope

- GMAIL-002C draft write
- GMAIL-002D send
- UI-012D visual polish
- Owner UI-003E
- PR merge / ready-for-review
- Provider mutation
- Browser OAuth

## Files changed

- `public/inbox-preview.js`, `public/inbox-preview.css`
- `public/data/inbox-events.preview.json`
- `scripts/acc-001-model-check.mjs`
- `package.json`
- `docs/product/acc-001-account-mail-organization-ux.md`
- `docs/product/03-sprint-slice-plan.md`, `docs/product/06-compliance-validation-index.md`
- `TODO.md`

## Product UI code changed

**yes**

## Mail account model result

**pass** — `allMailAccounts()`, `enrichMailAccount()`, status grid with metadata/body/draft/send/mutation states

## Account/folder hierarchy result

**pass** — per-account Inbox/Sent/Archive/Trash/Spam accordion + system mailboxes + labels/folders preserved

## Accordion/grouped mail views result

**pass** — `renderMailAccountAccordion`, `renderGroupedMailThreadList`

## Provider taxonomy separation result

**pass** — `MAIL_PROVIDER_IDS` vs `INTEGRATION_PROVIDER_IDS`; Settings mail vs integration blocks

## GitHub integration result

**pass** — removed from mail accounts fixture; thread uses `integrationSource: github` under Gmail account; Integrations card for `dev-github`

## Multi-account pattern result

**pass** — structure supports multiple Gmail preview accounts and integration cards

## Account settings integration result

**pass** — Settings → Accounts: add, import snapshots, wipe hint, gates visible (blocked actions disabled)

## Status honesty result

**pass** — fixture/metadata/body snapshot/blocked states distinguished

## Ibal/context linkage result

**pass** — `ibalMailContextLabel()` in concierge drawer

## Activity/receipt linkage result

**pass** — account receipts including `account_selected`, `local_data_wipe` map to Activity

## Tests/checks result

**pass** — `npm run check` includes `check:acc`; `git diff --check` clean

## Regression result

**pass** — NAV-001 shell nav preserved; GMAIL-002A/HARDEN/002B bridges preserved; UI-011B–I and UI-012A–C unchanged structurally

## Storage result

**pass** — no new localStorage keys; schemaVersion unchanged

## schemaVersion

**11**

## localStorage keys used

`xiioInbox.preview.state` only (plus legacy migration read for `xiio-inbox-preview-state-v2`)

## Safety/egress result

**pass** — draft write, send, provider mutation remain blocked

## Route smoke result

**pass** — default load, Mail assets, account accordion symbols, fixture has no GitHub mail account id

## External network request result

**not checked** — static same-origin fixture fetch only in smoke

## Same-origin fixture fetch result

**pass** — `inbox-events.preview.json` loads via `./data/` relative URL

## Secrets status

**pass** — `secrets/`, `tools/gmail/data`, `tools/gmail/receipts` gitignored and unstaged

## PR draft state

**draft** — PR #12 remains draft

## Remaining blockers

- Live OAuth operator proof
- Owner visual proof until UI-012F
- Dependabot disabled
- `gmail.readonly` restricted scope production verification
- Pass 55 bounded metadata alignment unverified

## Next recommended pass

**UI-012D** interaction/state polish (default)

## Decision value

`ACC_001_PASS_ACCOUNT_MAIL_UX_READY_FOR_UI_012D_OR_GMAIL_002C`
