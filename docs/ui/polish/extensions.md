# Extensions Polish Plan

## Goal

Make Extensions feel like a provider/integration control center with clear permission boundaries.

## Current Problems

- Provider blocks look repetitive.
- Permissions and secret boundary lack a strong hierarchy.
- Local cloud/home server placeholder could be mistaken for planned implementation.
- Framework export blocker needs clearer separation from user-facing integrations.

## Required Updates

- Group integrations by category: Providers, Source Tools, Local/Runtime, Framework.
- Add provider cards only where connection metadata matters.
- Show permission summaries as short scope tables.
- Make secret boundary a first-class security panel.
- Clearly label local cloud/home server as undecided by ARCH-004.

## Component Pattern

- `IntegrationCategory`
- `ProviderGateCard`
- `PermissionScopeTable`
- `SecretBoundaryPanel`
- `RuntimeBoundaryNotice`
- `FrameworkExportBackfeed`

## Acceptance Checks

- User can tell nothing is connected.
- Credentials absence is obvious.
- Local/cloud behavior is not implied.
- Framework blocker is visible but not confused with user provider setup.
