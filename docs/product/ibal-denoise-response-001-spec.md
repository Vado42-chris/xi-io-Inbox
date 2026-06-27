# IBAL-DENOISE-RESPONSE-001 — Message de-noising, risk triage, and point-by-point response interview

## Status

**Capture only — do not implement.**

Blocked until:

- `LOCAL_WEB_RUNTIME_001_OWNER_PROOF: PASS` (live metadata sync + selected body hydration + labels)
- Stable local message metadata model on hydrated bodies
- Explicit provider write gates for draft creation (separate slice)

Does **not** interrupt `LOCAL-WEB-RUNTIME-001H` or Gmail runtime proof work.

Working names (owner TBD): **IBAL-DENOISE-RESPONSE-001**, **IBAL-RESPONSE-INTERVIEW-001**, **POINT-BY-POINT-DENOISE-001**. Spec id uses `IBAL-DENOISE-RESPONSE-001` until renamed.

## Owner point of order (2026-06-27)

Ibal should not merely “write a reply.” For noisy, fluffy, manipulative, spammy, or risky messages, Ibal should **distill substance from style**, surface decision points, optionally triage safety signals, interview the user point-by-point, then draft only from approved answers — with ledger metadata for search and audit.

This is a **core Ibal primitive** (attention firewall / preamble de-noiser), not a side feature. It also applies beyond Mail (GitHub comments, support docs, AFG, Seeds) as a reusable xi-io framework pattern.

## Product primitive

```text
message → de-noise → extract points → classify risk/intent → interview user → draft / ledger / task / evidence
```

Not: “AI writes emails.”

Yes: **Ibal turns noisy communication into auditable decisions.**

## Three layers

| Layer | Purpose |
| --- | --- |
| **Clarity** | Distill fluff into points, asks, claims, deadlines, obligations, decisions |
| **Safety** | Flag suspicious links, attachments, urgency, credential/payment pressure, impersonation patterns — without overclaiming |
| **Response** | Point-by-point interview; draft only from user-approved answers; track unresolved items |

## Safe Ibal authority model

```text
Ibal may analyze.
Ibal may ask.
Ibal may draft (local preview).
Ibal may record a receipt / ledger entry.
Ibal may create a local draft only after explicit user approval.
Ibal may not send without explicit user action.
Ibal may not mutate providers by default.
```

## Core workflow (target)

1. User opens a **hydrated** message (read-only body available).
2. User clicks **Ask Ibal → Help me process / respond**.
3. Ibal extracts a **point map**:
   - main ask
   - claims
   - questions
   - deadlines
   - requested actions
   - payment / credential / link / attachment prompts
   - emotional pressure / urgency (fluff separated from substance)
   - evidence provided / missing
   - possible spam / phishing / malware **risk signals** (pattern-based, not certainty claims)
4. User reviews de-noised point map.
5. Ibal runs a **response interview** per point:
   - answer · dispute · ignore · defer · ask for evidence · turn into task · mark suspicious
6. Ibal generates draft **only from user-approved answers**.
7. User edits / approves draft.
8. Draft saved **locally** or to Gmail Drafts **only after explicit approval** and when write gate allows.
9. **Ledger** records: extracted points, risk signals, user decisions, draft version, unresolved points, evidence/task refs, send status.

## Conceptual metadata model

```text
message_point {
  id
  source_message_id
  type: claim | request | question | deadline | accusation | offer | instruction | evidence | fluff | action_item
  text_original
  text_distilled
  confidence
  user_position: agree | disagree | clarify | ignore | defer | unknown
  response_status: answered | skipped | needs_evidence | deferred | not_applicable
  evidence_refs[]
  task_refs[]
  draft_refs[]
}

risk_signal {
  id
  source_message_id
  kind: suspicious_link | credential_request | payment_pressure | urgency_pressure | domain_mismatch | attachment_blocked | spoof_pattern
  severity: low | medium | high
  evidence: pattern_description
  user_action: verify | ignore | block | defer
}

ledger_entry {
  source_message_id
  points[]
  risk_signals[]
  user_decisions[]
  draft_version
  unanswered_points[]
  send_status: not_sent | draft_local | draft_provider | blocked
}
```

## Framing rules (avoid overclaim)

- Do **not** present as “AI detector” or “this was AI-generated” unless explicitly framed as uncertain heuristic.
- Do **not** claim “this is malware/phishing” unless backed by scanner or authoritative provider result.
- Prefer: *Suspicious pattern detected. Do not click yet. Verify sender through another channel.*

Distill messaging:

```text
Distill message into actionable points.
Separate substance from style.
Identify claims, asks, deadlines, and response obligations.
```

## Safety / egress stop lines

- No provider **send** without owner approval and egress policy.
- No Gmail **draft write** until provider write gate is approved (separate slice).
- Links and attachments remain **blocked by default** in product; Ibal advises, does not execute.
- No legal conclusions; support/decision aid only.
- No automatic send, archive, delete, label mutation.

## Value (why this is “banger”)

- Reduces cognitive load on long / fluffy / engagement-bait mail
- Makes spam and phishing triage actionable (attention firewall, not just filtering)
- Searchable metadata: unanswered claims, deferred responses, payment asks, suspicious urgency
- Audit trail for support, legal-adjacent, project, and family logistics workflows
- Reusable xi-io preamble before action (Inbox, GitHub, AFG, Seeds, framework review)

## Cross-surface reuse (future)

| Surface | Use |
| --- | --- |
| Mail | Point-by-point response interview |
| GitHub | PR/comment review interview |
| Legal/support docs | Claim / evidence / response ledger |
| AFG | Cognitive decompression before action |
| Framework | Premortem / de-noise before execution |

## Dependencies (hard)

| Prerequisite | Why |
| --- | --- |
| Selected read-only **body hydration** | Cannot de-noise from subject/snippet alone |
| Live metadata + **labels** sync | Folder/label context for triage |
| Local ledger / receipt patterns | Point and decision persistence |
| Model provider abstraction | AI-agnostic; see `docs/ai/provider-settings-contract.md` |
| Draft write gate (future) | Provider draft save is separate egress slice |

## Relation to current work

| Slice | Relationship |
| --- | --- |
| `LOCAL-WEB-RUNTIME-001H` | **Must complete first** — body + labels |
| `MOTION-SYSTEM-001` | Unrelated polish; separate commit |
| `QWEN-AGENTWORLD-PROVIDER-001` | Future simulator provider; not this feature |
| `UI-005` Ibal concierge | Entry surface exists; this spec extends proposal/draft behavior |

## Implementation gate (when opened)

Open as **`IBAL-DENOISE-RESPONSE-001A`** (spec + UX wireframes) only after runtime PASS. Implementation slices thereafter:

- 001B: point extraction + local-only preview (no provider write)
- 001C: response interview UI + ledger writes
- 001D: draft local save
- 001E: provider draft write (blocked until egress policy)

## Agent stop line

```text
Do not implement IBAL-DENOISE-RESPONSE-001 during LOCAL-WEB-RUNTIME-001 proof.
Do not interrupt Gmail runtime hydration.
Capture and reference this spec only until owner opens the slice.
```
