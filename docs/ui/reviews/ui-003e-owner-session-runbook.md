# UI-003E Owner Session Runbook

## Purpose

One low-friction owner session at `http://localhost:4488`. Designed for a single focused pass — like reviewing evidence in order, not re-reading the whole case file.

## Before you start (2 minutes)

```bash
cd "/media/chrishallberg/Storage 22/999_Work/003_Projects/017_xi-io_inbox"
npm run check    # expect: pass
npm run dev      # opens static preview on port 4488
```

Open: **http://localhost:4488**

Optional (not required for UI-003E): import sample sync status in Settings → Accounts → **Import sync status**.

## Session order (15–20 minutes)

Do these in order. Stop if something breaks trust or readability — note FAIL and stop.

### 1. Shell (3 min)

- Primary nav: Home, Mail, Calendar, Tasks, Activity, Integrations, Settings
- Ibal is **not** in left lane list; `#/ibal` should land on Home with concierge drawer
- Trust/blocked egress messaging visible somewhere on Mail or Settings

### 2. Mail workbench (5 min)

- 4-column feel: folders | list | reading | command rail
- Open a thread; reading pane shows metadata/body-unavailable honestly
- Compose or reply draft → appears in Drafts (blocked send is OK)
- Mail accounts nav: connected vs demo fixture separation (ACC-SYNC-UI-001)

### 3. Calendar + Tasks (3 min)

- Calendar shows month grid with events (fixture or imported sample)
- Tasks shows kanban columns; at least one task links back to mail context

### 4. Settings + accounts (3 min)

- Settings opens Preferences first; Advanced collapsed
- Email accounts: add Gmail queue works; no surprise fake accounts in **connected** list
- Import sync status (optional): account row + status chip appear

### 5. Activity + Integrations (2 min)

- Activity uses human labels (not agent jargon)
- Integrations: marketplace cards; Connect honestly blocked

### 6. Safety unchanged (1 min)

- Send, provider connect, mutation still blocked in preview

## How to record your result

**If anything fails visually or feels wrong:** reply with `UI_003E_FAIL` + which step + one sentence.

**If all steps pass:** reply with exactly:

```text
UI_003E_PASS_OWNER_VISUAL_PROOF_COMPLETE
Reviewer: Chris
Date: YYYY-MM-DD
```

Only **you** may send that string. Agents must not pre-fill it.

## What happens next

| Your result | Next agent pass |
| --- | --- |
| PASS | MERGE-PREP-001 final docs + PR ready-for-review prep (~1 pass) |
| FAIL | Scoped fix slice from your notes (~1–2 passes) then re-review |

## Reference

Full checklist: `docs/ui/reviews/ui-003e-owner-visual-proof-packet.md`
