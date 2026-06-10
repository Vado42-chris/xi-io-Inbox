# Settings / Provider Gates Polish Plan

## Goal

Make Settings / Provider Gates feel like a serious policy and permission control surface.

## Current Problems

- Gate cards are useful but visually repetitive.
- Policy defaults need stronger grouping and scan order.
- Dangerous actions need clearer governance treatment.
- ARCH-004 and provider identity blockers should be prominent without overwhelming the page.

## Required Updates

- Group settings into Account, Provider Permissions, AI Routing, Data Boundary, Egress Policy, Receipts.
- Use compact policy rows instead of broad cards.
- Add disabled controls only where a future user action is plausible.
- Add a clear “cannot continue until” blocker summary.
- Use inspector for selected policy detail.

## Component Pattern

- `PolicySection`
- `ProviderGateRow`
- `PermissionScopeRow`
- `DataBoundaryNotice`
- `EgressPolicyMatrix`
- `BlockerSummary`

## Acceptance Checks

- User can tell which gates block provider work.
- Dangerous actions are disabled or absent.
- No final runtime/cloud/platform decision is implied.
- Policy state is legible without reading every card.
