# NAV-001: App Shell / Navigation Correction

## Why the current shell was wrong

Peer review of UI-012C screenshots found product-structure problems that layout polish alone cannot fix:

1. **Account identity in the global header** — “P Personal Gmail preview” read as debug/session state, not product navigation.
2. **Left rail as global level-1 nav** — duplicated lanes (Mail, Tasks, Settings, etc.) instead of contextual workspace navigation.
3. **Help as a weak accordion** — one-line blurb; no screen context or blocked-state guidance.
4. **Settings as primary workflow** — belongs in account/system utility, not beside Mail and Plan.
5. **Provider/account status misplaced** — honest blocked state was mixed into the wrong shell region.

Polishing interaction (UI-012D) on this structure would polish the wrong architecture.

## Corrected top-level navigation (level 1)

Global header product identity:

```text
XI-IO Inbox
Preview · Local · Metadata-only   (environment badge)
```

Level-1 product nav (top bar):

```text
Mail | Drafts | Approvals | Plan | Automations | Activity | Integrations
```

Top-right utilities (always visible):

```text
Search / command
Ask Ibal
? Help
Account / provider status
```

Settings is **not** level-1. It opens from the account menu as a utility/system area.

## Contextual left rail (level 2)

The left rail is **workspace-scoped**, not global lane navigation.

| Workspace | Contextual items |
| --- | --- |
| **Mail** | Accounts, Inbox, Unread, Needs reply, Draft-linked, Labels, Search results |
| **Drafts** | Composed, Replies, Needs approval, Approved, Blocked, Templates |
| **Approvals** | Ready, Blocked, Risk flags, Batch approval, Send blocked |
| **Plan** | Tasks, Calendar, Epics, Stories, Bugs, Evidence |
| **Automations** | Rules, Dry-runs, Action library, Templates, Blocked runs |
| **Activity** | All, Blocked, Proposed, Completed, Provider gates, Receipts |
| **Integrations** | Email, Storage, Automation, Communication, Local tools, Developer |

Existing lane routes (`#/inbox`, `#/tasks`, `#/receipts`, etc.) are preserved; level-1 nav maps to them without schema or localStorage changes.

## Account / provider status placement

Account and provider honesty move to the **top-right account control** and account drawer:

- Preview / local / metadata-only environment badge
- Browser not connected (default in static preview)
- Queued / demo fixture accounts (not implied live Gmail)
- Gmail CLI path documented in drawer (`tools/gmail`) — not browser OAuth

No connected Gmail is shown unless verified by the app adapter (future GMAIL-002A).

## Help, search, and Ibal

| Control | Placement | Behavior |
| --- | --- | --- |
| **Search / command** | Top-right | Global; mental model: mail, commands, activity, providers, tasks |
| **Ask Ibal** | Top-right | Global; labels reflect workspace; no false runtime claims |
| **Help** | `?` control | Context panel for active workspace + egress policy statements; replaces header accordion |

## Provider blocked explanation

Tier 1 static preview remains honest:

- Fixture-driven mail in browser
- Provider runtime, body read, draft write, and send blocked
- Metadata ingress is a **separate local adapter path** (see GMAIL-002)

NAV-001 fixes **where** status appears, not **whether** gates exist.

## Relationship to GMAIL-002A

NAV-001 establishes credible product navigation so real Gmail metadata ingress (GMAIL-002A) can surface in **Accounts** and **Integrations → Email** without restructuring the shell again.

Next product ingress step: `docs/product/gmail-002-real-email-ingress-plan.md`.

## UI-012D pause

**UI-012D (interaction / state polish) remains paused until NAV-001 passes.**

Sequence after NAV-001:

```text
GMAIL-002A → UI-012D → UI-012E → UI-012F → UI-003E → xi-io.net backfeed → merge prep
```

## Scope boundaries (NAV-001)

| In scope | Out of scope |
| --- | --- |
| Header / left-rail nav structure | Gmail body read |
| Nav class/state wiring in preview JS | Gmail draft write / send |
| Account drawer Settings entry | schemaVersion / localStorage shape changes |
| Help replacement | Provider runtime in browser |
| Product + ingress **plans** | Owner visual proof (UI-003E) |

## Evidence

- Implementation receipt: `docs/ui/reviews/nav-001-app-shell-navigation-correction-receipt.md`
- Peer-review source: UI-012C screenshots / ChatGPT product review (2026-06-10)
