# UI-011A Product Capability Gap Matrix

## Purpose

Reconcile **user product expectations** against **implemented evidence** in `public/inbox-preview.*`, fixtures, and receipts. Stops guessing before owner visual proof or merge.

## Baseline

| Field | Value |
| --- | --- |
| Branch | `ui-002/framework-derived-static-preview` |
| Commit SHA | `bca8e99` (matrix authored) |
| Tier | Static preview (Tier 1) — provider/runtime blocked by design |
| Prior owner verdict | `UI_003E_FAIL_PRODUCT_UX_NOT_USER_FACING` |
| UI-009/010 | Closed named gap slices; **did not** close full product capability bar |

## Mental model gap (diagnosis)

| User model | Current implementation bias |
| --- | --- |
| Mail → draft → approval → send → activity → outcomes | Lanes → fixtures → gates → receipts → proof |
| Work planning (epic/story/bug/evidence) | Kanban task cards with source links only |
| Familiar mail/calendar surfaces | Improved shells over fixture data |
| Visual automations + action library | Text rule form + dry-run copy |

## Status legend

| Status | Meaning |
| --- | --- |
| implemented | Meets Tier-1 preview bar with evidence |
| partial | Shell or local-only; incomplete vs product bar |
| missing | No user-facing implementation |
| blocked | Requires provider/runtime (ARCH-004, GMAIL, etc.) |
| not planned | Out of current slice scope |

| Quality | Meaning |
| --- | --- |
| production-like | Would pass casual user comparison |
| scaffold | Structure visible; content/behavior thin |
| fixture-only | Driven by static JSON only |
| developer-facing | Reads as audit/dev tool |
| absent | Not present |

---

## 1. Mail / Inbox baseline

| ID | Capability | Expected | Evidence | Status | Quality | Risk | Next slice | Acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-MAIL-001 | Unified inbox | All accounts in one thread list | `accountFilter`, fixture threads | partial | fixture-only | High | UI-011B | Multi-account threads visible with switcher |
| CAP-MAIL-002 | Per-account inbox | Filter threads by account | `state.inbox.accountFilter` | partial | scaffold | Med | UI-011B | Account filter in nav + list |
| CAP-MAIL-003 | Folders (Sent/Archive/Trash/Spam) | Standard folder nav | Smart views only; no sent/archive/trash mailboxes | missing | absent | High | UI-011B | Folder list + empty states |
| CAP-MAIL-004 | Labels | User labels on threads | Fixture `thread.labels`; display only | partial | fixture-only | Med | UI-011B | Label chips + filter |
| CAP-MAIL-005 | Search | Search mail | Topbar search input → Ibal command | partial | scaffold | High | UI-011B | Search results list (local index) |
| CAP-MAIL-006 | Thread list | Scannable list | 3-pane mail workspace | partial | scaffold | High | UI-011B | Density, unread, selection |
| CAP-MAIL-007 | Reading pane | Read selected thread | `renderMailReadingPane` | partial | scaffold | High | UI-011B | Product copy; no fixture jargon |
| CAP-MAIL-008 | Compose | New message draft | Compose form + local draft object | partial | production-like | Med | UI-011B | Polish + attachment UX |
| CAP-MAIL-009 | Reply | Reply draft per thread | `draftForThread`, reply form | partial | production-like | Med | UI-011B | Thread-linked reply flow |
| CAP-MAIL-010 | Drafts mailbox | Drafts folder | `mailboxView: drafts` | implemented | production-like | Low | — | List + editor |
| CAP-MAIL-011 | Sent mailbox | Sent messages view | Simulated send events only | missing | absent | Med | UI-011B | Sent list (local/simulated) |
| CAP-MAIL-012 | Archive/trash/spam visibility | Folder states | Blocked in egress copy only | missing | absent | Med | UI-011B | UI states + blocked actions |
| CAP-MAIL-013 | Account switcher | Switch active account | `renderEmailAccountsBlock`, switch | partial | scaffold | High | UI-011B | Real queue + connect status |
| CAP-MAIL-014 | Attachments | View/attach files | Fixture attachment list; provider blocked | partial | fixture-only | Med | UI-011B | Attach UX + blocked gate |
| CAP-MAIL-015 | Empty/loading/error | Graceful states | Some `lane-empty-state` | partial | scaffold | Med | UI-011B | Per-view empty states |
| CAP-MAIL-016 | Keyboard navigation | Operable without mouse | Inspector focus, some shortcuts | partial | scaffold | Med | UI-011B | Mail list/pane tab order |
| CAP-MAIL-017 | User terminology | No dev jargon primary | UI-010 demotion helpers | partial | scaffold | High | UI-011B | Primary pane audit pass |

---

## 2. Drafts and Approval Queue

| ID | Capability | Expected | Evidence | Status | Quality | Risk | Next slice | Acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-DRAFT-001 | Draft list | First-class drafts | UI-007B-R2 `drafts.items` | implemented | production-like | Low | — | Drafts view |
| CAP-DRAFT-002 | Draft detail/editor | Edit draft fields | Draft form in mail workspace | implemented | production-like | Low | — | Save locally |
| CAP-DRAFT-003 | Draft status | drafting/sent/etc. | `draft.status` | partial | scaffold | Med | UI-011C | Status badges |
| CAP-DRAFT-004 | Approval state | queued/approved/none | `approval_state` | implemented | production-like | Low | — | Queue filters |
| CAP-DRAFT-005 | Approval queue view | Queue mailbox | `mailboxView: approval-queue` | implemented | production-like | Low | — | List queued/approved |
| CAP-DRAFT-006 | Batch approval | Multi-select approve | `batch` mode hint only | missing | absent | Med | UI-011C | Select N + approve |
| CAP-DRAFT-007 | Blocked send | Send disabled Tier 1 | Blocked buttons + receipts | implemented | production-like | Low | — | Visible blocked |
| CAP-DRAFT-008 | Pre-send checks | Validation before approve | Partial copy in dry-run | partial | scaffold | Med | UI-011C | Checklist UI |
| CAP-DRAFT-009 | Post-send preview | Consequences preview | UI-007C dry-run send event | partial | scaffold | Med | UI-011C | Consequence panel |
| CAP-DRAFT-010 | Reusable templates | Draft templates | None | missing | absent | Med | UI-011C | Template picker |
| CAP-DRAFT-011 | Draft history | Version/history | None | missing | absent | Low | UI-011C | History list |
| CAP-DRAFT-012 | Source thread link | Draft ↔ thread | `source_thread_id` | implemented | production-like | Low | — | Open thread |
| CAP-DRAFT-013 | Activity linkage | Draft events in Activity | Activity drill-down to draft | partial | scaffold | Med | UI-011H | Open draft from row |

---

## 3. Calendar

| ID | Capability | Expected | Evidence | Status | Quality | Risk | Next slice | Acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-CAL-001 | Month grid | Month calendar grid | `renderCalendarMonthGrid` UI-009B | partial | scaffold | High | UI-011D | Events on dates |
| CAP-CAL-002 | Week grid | Week view | `renderCalendarWeekStrip` UI-010J | partial | scaffold | High | UI-011D | Week cells + events |
| CAP-CAL-003 | Day agenda | Day schedule | None | missing | absent | Med | UI-011D | Day list view |
| CAP-CAL-004 | Events on dates | Click date → events | Fixture proposals on grid | partial | fixture-only | Med | UI-011D | Interaction proof |
| CAP-CAL-005 | Event proposal from mail | Draft/thread → event | Proposal form + source refs | partial | scaffold | Med | UI-011D | Source link visible |
| CAP-CAL-006 | Edit proposal | Local proposal CRUD | `renderCalendarProposalForm` | partial | production-like | Low | UI-011D | Save proposal |
| CAP-CAL-007 | Conflict preview | Overlap warning | None | missing | absent | Low | UI-011D | Conflict banner |
| CAP-CAL-008 | Reminder proposal | Reminder UX | None | missing | absent | Low | UI-011D | Reminder field |
| CAP-CAL-009 | Provider sync blocked | Honest blocked state | Copy in fixtures/meta | partial | developer-facing | Med | UI-011D | User-facing banner |
| CAP-CAL-010 | Activity linkage | Calendar receipts | Local receipts in details | partial | scaffold | Low | UI-011H | Filter calendar events |

---

## 4. Tasks / planning

| ID | Capability | Expected | Evidence | Status | Quality | Risk | Next slice | Acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-TASK-001 | Project | Project container | None in UI | missing | absent | High | UI-011E | Project selector |
| CAP-TASK-002 | Epic | Epic object | PLAN-001 docs only | missing | absent | High | UI-011E | Epic row/card |
| CAP-TASK-003 | User story | Story object | None in UI | missing | absent | High | UI-011E | Story type + fields |
| CAP-TASK-004 | Bug | Bug work item | None in UI | missing | absent | High | UI-011E | Bug type + severity |
| CAP-TASK-005 | Requirement | REQ link | Docs IDs only | missing | absent | Med | UI-011E | REQ field on item |
| CAP-TASK-006 | Acceptance criteria | AC checklist | None | missing | absent | High | UI-011E | AC list per story |
| CAP-TASK-007 | Backlog | Backlog view | Kanban columns only | missing | absent | High | UI-011E | Backlog lane |
| CAP-TASK-008 | Sprint/waterfall phase | Phase tag | None in UI | missing | absent | Med | UI-011E | Phase filter |
| CAP-TASK-009 | Status/priority | Task fields | Kanban status columns | partial | scaffold | Med | UI-011E | Priority + status |
| CAP-TASK-010 | Source mail/draft link | Ingress from mail | `sourceRef` on tasks UI-009C | partial | scaffold | Med | UI-011E | Open source |
| CAP-TASK-011 | Evidence/artifact link | Link artifacts | Fixture evidence refs only | missing | absent | High | UI-011E | Artifact chip |
| CAP-TASK-012 | Kanban board | Board view | `renderTasksKanbanBoard` | partial | scaffold | Med | UI-011E | Board + planning fields |
| CAP-TASK-013 | Activity linkage | Task receipts | Local receipts in details | partial | scaffold | Low | UI-011H | Drill-down |

---

## 5. Automations

| ID | Capability | Expected | Evidence | Status | Quality | Risk | Next slice | Acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-AUTO-001 | Visual rule builder | When→If→Then UI | Text inputs in rule form | partial | scaffold | High | UI-011F | Visual flow blocks |
| CAP-AUTO-002 | Triggers | Trigger picker | Free-text trigger field | partial | scaffold | Med | UI-011F | Trigger catalog |
| CAP-AUTO-003 | Conditions | Condition builder | Free-text condition | partial | scaffold | Med | UI-011F | Condition rows |
| CAP-AUTO-004 | Actions | Action picker | Free-text proposal field | partial | scaffold | High | UI-011F | Action library pick |
| CAP-AUTO-005 | Dry-run preview | Preview output | `renderAutomationsDryRunOutput` | partial | scaffold | Med | UI-011F | Structured preview |
| CAP-AUTO-006 | Reusable action library | Saved actions | None | missing | absent | High | UI-011F | Action list object |
| CAP-AUTO-007 | System default examples | Starter rules enabled | Templates collapsed in details | partial | fixture-only | Med | UI-011F | Primary examples |
| CAP-AUTO-008 | User-created actions | Save custom actions | Local rules only | partial | scaffold | Med | UI-011F | Save as action |
| CAP-AUTO-009 | Blocked execution | No runtime run | Enable blocked; dry-run copy | implemented | production-like | Low | — | Block visible |
| CAP-AUTO-010 | Activity linkage | Automation receipts | Local receipts | partial | scaffold | Low | UI-011H | Activity rows |

---

## 6. Extensions / Integrations

| ID | Capability | Expected | Evidence | Status | Quality | Risk | Next slice | Acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-EXT-001 | Internal xi-io extensions | First-party badge | Marketplace cards UI-010D | partial | scaffold | Med | UI-011G | Internal badge type |
| CAP-EXT-002 | External providers | Provider cards | Gmail/Outlook fixture cards | partial | scaffold | Med | UI-011G | Provider badge |
| CAP-EXT-003 | Gmail connect | OAuth connect | Queue + CLI hint UI-009A; GMAIL-001C CLI | partial | blocked | Med | GMAIL smoke + UI-011G | Connect flow proof |
| CAP-EXT-004 | Outlook/Microsoft | Provider card | Fixture blocked card | partial | fixture-only | Low | UI-011G | Blocked state |
| CAP-EXT-005 | Cloud storage | Drive/OneDrive cards | Fixture references | missing | absent | Med | UI-011G | Storage section |
| CAP-EXT-006 | Discord/Slack | Comms connectors | Not in UI | missing | absent | Low | not planned | — |
| CAP-EXT-007 | Zapier/Make/n8n | Automation externals | Not in UI | missing | absent | Low | not planned | — |
| CAP-EXT-008 | Local tools | Export/local index | Partial in Activity export copy | partial | scaffold | Med | UI-011G | Local badge |
| CAP-EXT-009 | Permission/blocked states | Clear gates | Blocked pills on cards | partial | scaffold | Med | UI-011G | Type-specific copy |
| CAP-EXT-010 | Visual type distinction | IA by extension type | Single marketplace grid | missing | absent | High | UI-011G | Sections/badges |

---

## 7. Files / evidence / artifacts

| ID | Capability | Expected | Evidence | Status | Quality | Risk | Next slice | Acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-EVD-001 | Local artifact path | Safe local storage | localStorage preview state only | partial | developer-facing | High | UI-011E/F | Artifact model doc+UI |
| CAP-EVD-002 | Cloud storage gate | Provider file access | Blocked in copy | blocked | absent | Med | ARCH-004 | Gate only |
| CAP-EVD-003 | Attach/link to draft | File on draft | Attachment list fixture | partial | fixture-only | Med | UI-011C | Link artifact |
| CAP-EVD-004 | Evidence packet | Export packet | Activity export copy | partial | scaffold | Med | UI-011H | Export UI |
| CAP-EVD-005 | Backup status | Backup indicator | None | missing | absent | Med | UI-011E | Status field |
| CAP-EVD-006 | Redaction state | Redaction flag | Policy docs only | missing | absent | High | UI-011E | Redaction UI |
| CAP-EVD-007 | Chain of custody | Receipt trail | Activity/receipts partial | partial | scaffold | Med | UI-011H | Custody fields |
| CAP-EVD-008 | Sensitive case note | Legal/divorce handling | Privacy docs only | missing | absent | Med | UI-011E | Sensitivity tag |

---

## 8. Activity / Receipts

| ID | Capability | Expected | Evidence | Status | Quality | Risk | Next slice | Acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-ACT-001 | Activity label | User-facing name | Nav `Activity` UI-009D | implemented | production-like | Low | — | Label in nav |
| CAP-ACT-002 | Audit subtitle | Subtitle copy | Lane description in JSON | partial | scaffold | Low | UI-011H | Subtitle visible |
| CAP-ACT-003 | Action filter | Filter by type | `ACTIVITY_FILTERS` UI-010E | implemented | production-like | Low | — | Filters work |
| CAP-ACT-004 | Account filter | Filter by account | Partial in ledger | partial | scaffold | Med | UI-011H | Account filter |
| CAP-ACT-005 | Source object link | Open mail/draft | `open-source` drill-down | partial | production-like | Med | UI-011H | Links work |
| CAP-ACT-006 | Blocked explanation | Why blocked | Human labels UI-010E | partial | scaffold | Med | UI-011H | Plain language |
| CAP-ACT-007 | Export packet | Export action | Copy only | partial | scaffold | Med | UI-011H | Export button |
| CAP-ACT-008 | Build evidence separated | Dev receipts separate | `build` filter | partial | developer-facing | Med | UI-011I | Advanced only |

---

## 9. Settings

| ID | Capability | Expected | Evidence | Status | Quality | Risk | Next slice | Acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-SET-001 | User profile | Name/preferences | User prefs form UI-009E | partial | production-like | Med | UI-011I | Profile section |
| CAP-SET-002 | Account management | Add/remove accounts | `renderEmailAccountsBlock` | partial | scaffold | High | UI-011I | Connect wizard |
| CAP-SET-003 | Provider settings | Provider prefs | Advanced gates | partial | developer-facing | Med | UI-011I | User vs advanced |
| CAP-SET-004 | Privacy | Privacy controls | Policy fixtures | partial | scaffold | Med | UI-011I | Privacy panel |
| CAP-SET-005 | Storage | Storage prefs | None dedicated | missing | absent | Med | UI-011I | Storage section |
| CAP-SET-006 | Notifications | Notification prefs | None | missing | absent | Low | UI-011I | Notifications |
| CAP-SET-007 | AI/Ibal settings | Ibal prefs | Partial in settings | partial | scaffold | Med | UI-011I | Ibal section |
| CAP-SET-008 | Automation safety | Safety toggles | Gate forms advanced | partial | developer-facing | Med | UI-011I | Safety user panel |
| CAP-SET-009 | Advanced/developer | Collapsed advanced | `settings-advanced-section` UI-009E | partial | production-like | Low | UI-011I | Gates under Advanced |
| CAP-SET-010 | Build evidence split | CI/dev evidence not primary | Partial demotion | partial | scaffold | Med | UI-011I | Advanced only |

---

## 10. Ibal / contextual engine

| ID | Capability | Expected | Evidence | Status | Quality | Risk | Next slice | Acceptance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CAP-IBAL-001 | Compose assist | Propose compose | Concierge copy UI-010J | partial | scaffold | Med | UI-011B | Compose proposals |
| CAP-IBAL-002 | Propose reply | Reply suggestions | Thread Ibal proposals in fixtures | partial | fixture-only | Med | UI-011B | Reply panel |
| CAP-IBAL-003 | Create task | Task proposal | Cross-lane proposals | partial | scaffold | Med | UI-011E | Task proposal CTA |
| CAP-IBAL-004 | Calendar proposal | Event proposal | Calendar proposal form | partial | scaffold | Med | UI-011D | From mail context |
| CAP-IBAL-005 | Explain blocked | Blocker explanation | Inspector + help | partial | scaffold | Med | UI-011H | Plain blockers |
| CAP-IBAL-006 | Surface automation | Suggest rules | None contextual | missing | absent | Med | UI-011F | Context suggestions |
| CAP-IBAL-007 | Evidence display | Show evidence refs | Fixture evidence trays | partial | developer-facing | Med | UI-011E | User evidence view |
| CAP-IBAL-008 | Proposal-only | No execute | Blocked egress enforced | implemented | production-like | Low | — | No auto-run |

---

## Summary counts

| Status | Count |
| --- | --- |
| implemented | 12 |
| partial | 58 |
| missing | 28 |
| blocked | 2 |
| not planned | 2 |

| Quality | Count |
| --- | --- |
| production-like | 14 |
| scaffold | 52 |
| fixture-only | 12 |
| developer-facing | 8 |
| absent | 28 |

---

## Top 10 product gaps

1. **Mail baseline parity** — no sent/archive/trash/spam folders; search not a mail results UX
2. **Tasks as work management** — no epic/story/bug/requirement/AC/backlog/sprint in UI
3. **Evidence/artifact workflow** — no user-facing artifact model or backup/redaction
4. **Reusable action library** — automations lack first-class saved actions
5. **Visual automation builder** — text fields, not When→If→Then blocks + catalog
6. **Extension type taxonomy** — single marketplace; no internal vs provider vs local IA
7. **Calendar day agenda** — month/week strips exist; day view missing
8. **Draft batch approval + templates/history** — queue exists; batch/templates/history missing
9. **Live Gmail in product** — CLI adapter only; preview still fixture-heavy for mail
10. **Owner visual proof timing** — UI-003E must follow UI-011B–I repairs, not precede them

---

## Recommended repair sequence

```text
UI-011A Product Capability Gap Matrix (this doc) ✓
UI-011B Mail baseline parity repair
UI-011C Drafts + Approval Queue proof
UI-011D Calendar grid and event proposal proof
UI-011E Tasks / Epics / Stories / Bugs / Backlog proof
UI-011F Automations visual builder + reusable action library
UI-011G Extensions taxonomy and provider cards
UI-011H Activity / Receipts user-facing repair
UI-011I Settings user-vs-advanced split (residual)
UI-003E owner visual proof re-run
```

GMAIL-001C smoke remains **parallel optional** (local CLI only; ChatGPT connector ≠ product connect).

---

## What we missed (planning)

| Miss | Impact |
| --- | --- |
| Declared UI-010 “complete” vs product bar | Over-stated readiness |
| Scheduled UI-003E before capability matrix | Owner pass would fail again |
| No UI-011A matrix until now | Repairs were slice-driven, not capability-driven |
| UI-011 naming used for merge-prep receipt | Clarified: merge-prep ≠ capability matrix |
| Tasks planning layer in PLAN-001 docs only | Never mapped to preview UI |

---

## Decision

```text
UI_011A_PASS_REPAIR_SEQUENCE_READY
```
