# ACC-001: Account Model and Mail Organization UX

## Purpose

Repair the product model around real mail accounts, folder/mailbox organization, provider taxonomy, and GitHub-as-integration separation before further visual polish or write gates.

## Account model

Each **mail account** exposes:

| Field | Meaning |
| --- | --- |
| account label | Human-readable name |
| provider | `gmail`, `imap`, `outlook`, `microsoft`, `exchange`, `fixture` |
| mode | `fixture`, `queued`, `metadata-only`, `read-only-body`, `connected` |
| connection state | Derived from `syncState` / bridge imports |
| metadata state | `fixture`, `available`, `blocked` |
| body-read state | `available_local_snapshot` or `blocked` |
| draft-write state | **blocked** (until GMAIL-002C) |
| send state | **blocked** (until GMAIL-002D) |
| mutation state | **blocked** |
| last snapshot/import | Shown when metadata or read-only body bridge active |
| safe next action | Honest CLI/import guidance |

Supported mail account types in this pass:

- Gmail account (fixture + queued CLI connect)
- fixture preview account
- local metadata snapshot (GMAIL-002A)
- local read-only body snapshot (GMAIL-002B)
- IMAP / Outlook — **later** (structure reserved)

## Mail account vs integration account

**Mail accounts** have inbox semantics: Inbox, Sent, Archive, Trash, Spam, labels, search.

**Integrations** (GitHub, Slack, Calendar, Drive, Zapier/Make/n8n, local tools) live under **Integrations** and Settings → Integration accounts. They expose org/repo/notification scope — not inbox folders.

**Decision:** GitHub must **not** appear as a mail account. GitHub-sourced threads may appear under a Gmail mail account with an `integrationSource: github` badge when modeled as forwarded/notification mail.

## Folder / system mailbox hierarchy

Mail contextual navigation organizes as:

1. **Mail accounts** — per-account accordion (Inbox, Sent, Archive, Trash, Spam)
2. **Mail** — All accounts, Inbox, Unread, Needs reply, Draft-linked, Search results
3. **Views** — smart views from fixture metadata
4. **Labels / Folders** — preserved from NAV-001
5. **System mailboxes (all)** — Sent, Archive, Trash, Spam
6. **Imported snapshots** — metadata / read-only body bridge status when active

## Accordion / grouped mail views

Thread lists group by account when multiple accounts are visible and no account filter is active. Mail rows, labels, and system mailboxes are not removed.

## Multi-account future model

Structure supports multiple Gmail accounts in `previewAccounts` and multiple integration cards under Integrations. GitHub integrations use integration semantics only.

## Snapshot modes (status honesty)

| State | UI label |
| --- | --- |
| fixture preview | Fixture preview — not connected |
| browser not connected | Browser preview is not connected |
| OAuth not configured | Connect via tools/gmail CLI |
| metadata snapshot | Metadata-only snapshot |
| read-only body snapshot | Read-only body snapshot |
| body read blocked | Provider body read blocked |
| draft write blocked | blocked |
| send blocked | blocked |
| provider mutation blocked | blocked |

## Ibal / Activity linkage

- Ibal drawer shows mail context: account · mailbox · thread; no send/mutate/live-read claims.
- Account actions append to account receipts → Activity: account selected, snapshot import/clear, wipe instructions, provider gate viewed.

## Remaining blockers

- Live OAuth operator proof not run in CI
- GMAIL-002C draft write blocked
- GMAIL-002D send blocked
- Owner visual proof blocked until UI-012F
- PR #12 remains draft
- Dependabot disabled (tracked tech debt)
- `gmail.readonly` restricted scope — production verification required

## Next recommended pass

**UI-012D** interaction/state polish (default after ACC-001 pass), or **GMAIL-002C** only if owner explicitly chooses draft capability next.

Receipt: `docs/ui/reviews/acc-001-account-mail-organization-ux-receipt.md`
