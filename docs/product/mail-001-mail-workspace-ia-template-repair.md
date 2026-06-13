# MAIL-001: Mail Workspace IA and Template Repair

## Why inserted before UI-012D

Real Gmail metadata import exposed structural mail-client problems: cramped card-like thread rows, weak reading pane for metadata-only mode, duplicated account navigation, and an oversized empty right rail. UI-012D interaction polish cannot fix incorrect column/row templates.

## Column model

| Col | Role |
| --- | --- |
| 1 | Account / mailbox / label accordion (context left rail) |
| 2 | Conversation thread list |
| 3 | Reading pane / selected thread |
| 4 | Contextual Ibal/action rail (compact when nothing selected) |

## Account accordion

Each mail account is self-contained:

- Inbox · Unread · Needs reply · Draft-linked · Sent · Archive · Trash · Spam
- Labels (collapsible; from metadata snapshot when applicable)
- Imported snapshot status line

Fixture accounts and local snapshot accounts are labeled separately (`Fixture preview` vs `Local snapshot`).

## Thread row template

Compact list rows (not tall cards):

- sender · subject · snippet · date
- source chip · unread/meta/state chips

## Reading pane

**Metadata-only:** subject, from, date, labels, body-unavailable banner, blocked actions explained.

**Read-only body (when imported):** existing sanitized body path preserved; send/draft still blocked.

## Fixture vs snapshot

When metadata bridge active, `inboxThreads()` uses snapshot threads only. Thread/account badges distinguish fixture vs local snapshot. Metadata account auto-selected on import.

## Responsive rules

- Desktop: four-column shell with narrower action rail
- ≤1280px: narrower rails
- ≤980px: stack shell columns; list + reading stack

## Remaining blockers

- GMAIL-002B-LIVE-PROOF body phase (optional, selected message)
- UI-012D after owner accepts mail workspace
- UI-012E–F · UI-003E · xi-io.net backfeed

## Related

- `docs/ui/reviews/mail-001-mail-workspace-ia-template-repair-receipt.md`
- `VAL-EXT-001` — post-ingress divorce catalog validation (blocked)
