# Ibal Cross-Repo Peer-Review Request & Design Contract

## Status

```text
Type: cross-repo design contract and coordination brief.
Origin: xi-io:inbox (017_xi-io_inbox)
Target: xi-io:ibal (016_Rabbit_r1)
Decision token: UI_013C_CROSS_REPO_DESIGN_CONTRACT_ESTABLISHED
```

---

## 1. Context and Objectives

To satisfy **GATE-UI-VISUAL-001** and prepare both applications for the final **UI-003E** owner visual proof, this document establishes a formal visual design contract between `xi-io:inbox` and `xi-io:ibal`. 

Our goal is to ensure a cohesive **Private Operations Cockpit** aesthetic across the entire product suite without duplicating code or creating inconsistent component behaviors.

---

## 2. Shared Visual Tokens

Both repositories agree to use the following token values, mapped to the framework standard in `xi-io.net`:

### Typography
*   **Sans Font**: `'Outfit', 'Inter', system-ui, sans-serif` (clean, high-legibility UI sans stack).
*   **Mono Font**: `'VT323', 'SFMono-Regular', monospace` (for metadata, technical identifiers, and logs).
*   **Display Typography**: Serif stack (`Iowan Old Style`, `Palatino`, `Georgia`) for lane headers and branding marks.

### Geometry
*   **Chrome Radius**: `--radius-chrome: 3px` (sharp, confident corners for primary shell layout elements: topbars, nav containers, input boxes, brand marks).
*   **Content Card Radius**: `--radius-card: 12px` (softer, comfortable container radius for dashboard panels, detail cards, and modal dialogs).

### Accessibility Comfort Scale
*   **Default Scale**: `--ui-scale: 1.25` (Comfort Scale).
*   **HTML Base**: `font-size: calc(16px * var(--ui-scale))` to ensure all grid elements, line heights, and spacings scale proportionally.

---

## 3. Standardized UI Patterns

### Navigation and Selection Focus
1.  **Selection (Active State)**: Element selection must never rely on color alone. All active items (navigation tabs, mail folders, inbox rows, calendar cells) must display:
    *   An accent border highlight (orange `#ff5722` in Ibal, cyan `#7cd9ff` in Inbox).
    *   A subtle background tint (e.g., `rgba(255, 87, 34, 0.1)` or `rgba(124, 217, 255, 0.1)`).
    *   A left-inset indicator bar (2px width min) to denote structural focus.
2.  **Focus Indicator**: All interactive elements must show a distinct, high-contrast `:focus-visible` outline. Outline size: `2px solid var(--accent)` with a `2px` offset.

### Pill and Status Badges
Semantic statuses must align to the following naming conventions:
*   `.pill-ok` / `.pill-healthy`: Green tint (`#6fd6ad`), indicating active/connected/healthy status.
*   `.pill-warning` / `.pill-degraded`: Amber/yellow tint (`#d9b15d`), indicating warnings, pending actions, or metadata-only modes.
*   `.pill-danger` / `.pill-offline`: Red tint (`#db7272`), indicating error, blocked, or offline status.
*   `.pill-neutral`: Muted grey (`#96a5aa`), for general metadata.

---

## 4. Responsive Grid & Layout Conventions

*   **App Shell Grid**: 2-row layout with a persistent topbar and a main workspace area.
*   **Main workspace area layout**:
    *   Desktop width layout uses a 3-zone grid: `[sidebar] [content-pane] [context-rail/preview-pane]`.
    *   The middle content pane is primary; the right context rail is secondary.
*   **Breakpoints**: At viewport widths `< 980px`, the layout must transition gracefully:
    *   Topbar breadcrumbs collapse or hide.
    *   The sidebar collapses to icons (`--sidebar-collapsed-w: 60px`).
    *   The right context/preview drawer is toggleable or hidden by default.

---

## 5. Security and Action Gates (Egress Policy)

To maintain absolute local security, both repos must visually and functionally gate all unsafe data-modifying mutations:
*   **Mutations Allowed**: None. Sending, deleting, forwarding, or connecting to external live API sockets is forbidden.
*   **Blocked State Styling**: Dashed border (`1px dashed`), low opacity (`0.5`), and clear explanatory text adjacent to the control indicating that the action is blocked (e.g., *"Calendar writes locked until you connect a provider"*).

---

## 6. Feedback & Coordination Checklist for Ibal Agent

The `xi-io:ibal` team is requested to review their local stylesheet (`public/style.css`) and markup to align with:
- [ ] Incorporate the `--radius-chrome: 3px` variable for the topbar, navigation buttons, and identity badges.
- [ ] Align status dot / health pill classes with the semantic status colors listed in Section 3.
- [ ] Support dynamic accessibility comfort scale adjustments (`--ui-scale`).
- [ ] Confirm no external font CDNs or asset networks are queried during preview loads.
