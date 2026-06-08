# xi-io Inbox Roadmap

## Current phase

Bootstrap and planning.

The repository is intentionally documentation-first until source audit, framework alignment, and Android mail spine decisions are complete.

## Phase 0: Bootstrap governance

Goal: make the repo safe, inspectable, and framework-aligned before runtime work.

Deliverables:

- product invariants
- draft-only egress policy
- source audit index
- model-provider layer plan
- monetization guardrails
- Android mail spine decision stub
- framework alignment doc
- portable archive draft
- automation bridge plan
- schema stubs

Exit criteria:

- TODO reflects completed bootstrap docs
- framework freshness issue exists in `xi-io.net`
- no runtime import occurs before source audit

## Phase 1: Source mining and framework freshness

Goal: mine proven work from xi-io repos without leaking private implementation or duplicating framework contracts.

Sources:

- `xi-io.net`
- `realitypools.tv`
- `google_planner`
- `xi-io_docuforge`
- `xi-io_AuDHD-field-guide`
- `xi-io-emulator`

Outputs:

- source candidate matrix
- framework dependency matrix
- import boundary decisions
- freshness candidates for `xi-io.net`

## Phase 2: Android mail spine proof plan

Goal: decide how to use Thunderbird Android/K-9 or an alternative spine.

Outputs:

- license/attribution review
- package rename plan
- provider sign-in plan
- build proof checklist
- upstream update strategy
- sidecar integration boundary

## Phase 3: Runtime skeleton

Goal: introduce minimal buildable code only after audit decisions.

Outputs:

- app skeleton or upstream mail-spine import
- schema validation tooling
- example events/proposals
- tests for schema contracts
- CI baseline

## Phase 4: Email ingress and Ibal sidecar proof

Goal: prove email can become xi-io events without destabilizing the mail spine.

Outputs:

- normalized message/thread event records
- local action proposal generation
- draft-only egress gate
- Ibal assistant panel concept
- receipt records

## Phase 5: Export and archive proof

Goal: produce useful portable packets from threads and attachments.

Outputs:

- `.xiia.zip` archive proof
- printable thread packet
- checksums
- attachment index
- source receipts

## Phase 6: Automations and task compiler

Goal: convert inbound messages into reviewable work.

Outputs:

- email-to-task proposals
- email-to-bug proposals
- calendar/reminder proposals
- minimized webhook events
- Zapier/MCP-compatible bridge contracts

## Phase 7: Contacts, files, cloud storage

Goal: expand beyond email without losing egress safety.

Outputs:

- contact dedupe model
- attachment library
- Android Storage Access Framework exploration
- Drive/OneDrive/Dropbox/Nextcloud adapter planning

## Phase 8: Freemium and support paths

Goal: add ethical monetization without weakening user control.

Outputs:

- donation/tip support option
- optional hosted convenience plan
- paid feature boundary
- privacy-preserving payment architecture

## Phase estimate

- Repo-ready MVP planning state: 4 passes.
- Buildable Android proof: 7 to 9 passes.
- Initial MVP documentation, code comments, compliance, and two-way framework freshness: 10 to 14 passes.
