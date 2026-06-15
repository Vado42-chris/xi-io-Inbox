# GMAIL-001B: Real Account Read-Only Metadata Spike

## Purpose

Define the first safe use of a **real Gmail account** in xi-io Inbox development: read-only metadata inventory to expose real failure points that fixtures cannot simulate.

## Why real account metadata testing is needed

Fixture-only testing misses:

- label volume and taxonomy (system, user, nested, color, visibility)
- draft count, age, and stale-draft patterns
- sent volume and thread depth
- search complexity across years of history
- attachment metadata volume (not bodies)
- folder/label chaos and project-mapping ambiguity
- organization patterns that break naive inbox/calendar/task models

Owner correction (2026-06-10): the real Gmail account **should be used**, but first for metadata inventory — not write/send.

## Test account policy

| Policy | Rule |
| --- | --- |
| Primary account | Owner primary Gmail allowed for metadata inventory after GATE-GMAIL-METADATA-001 and owner approval |
| Malformed addresses | Reject addresses with invalid syntax (e.g. multiple `@`); use provider-returned identity only |
| Hard-coded email | Forbidden in adapter, docs, fixtures, or UI |
| Throwaway account | Preferred for first OAuth implementation smoke before primary account |
| Legal/sensitive searches | Separate evidence-handling policy; not in GMAIL-001B default scope |

## Primary account — allowed in GMAIL-001B

- account identity (from provider profile)
- label list
- label counts (messages, threads, unread where API permits)
- draft counts and draft metadata samples (no bodies by default)
- sent counts
- thread metadata samples (ids redacted before commit)
- message metadata samples (subject/snippet/date/label ids — no bodies by default)

## Primary account — forbidden in GMAIL-001B

- message body export
- attachment download
- draft create/update
- send
- delete / archive / modify
- filter or rule changes
- bulk historical body mining
- committing private content to repo

## Expected discovery questions

| Area | Questions |
| --- | --- |
| Labels | How many labels? System vs user vs nested? Which map to projects? |
| Drafts | Volume, age distribution, orphans, reply chains? |
| Sent | Volume, thread depth, label overlap with inbox? |
| Threads | Depth patterns, participants metadata, stale branches? |
| Organization | Label/folder chaos, duplicate semantics, automation candidates? |
| Product UX | What breaks draft-first workbench, approval queue, Activity ledger? |
| Performance | Pagination needs, rate limits, cache boundaries? |

## Evidence artifacts

- `docs/providers/gmail/gmail-001b-local-oauth-adapter-plan.md`
- `docs/providers/gmail/gmail-001b-real-account-test-policy.md`
- `docs/providers/gmail/gmail-001b-redaction-and-fixture-policy.md`
- `docs/providers/gmail/gmail-001b-receipt.md`
- `tools/gmail/provider-contract.md`
- Future: `docs/providers/gmail/gmail-001c-metadata-adapter-receipt.md` (implementation)

## Pass / fail criteria

| Criterion | Pass |
| --- | --- |
| Scope plan complete | All GMAIL-001B docs + gate + compliance |
| OAuth implemented | No (plan only) |
| Send enabled | No |
| Draft write enabled | No |
| Body export default | Blocked |
| Token storage boundary | Documented (not localStorage/repo) |
| Owner approval before primary metadata test | Required |

```text
GMAIL_001B_PASS_WHEN_PLAN_DOCS_AND_GATE_COMPLETE
```
