# Extensions Polish Plan

## Page Purpose

Show provider, integration, permission, local/cloud, framework export, and secret boundary state.

## Primary User Job

Understand what can connect later, what is blocked now, and why credentials or permissions are absent.

## Emotional / Visual Target

Permission and control center. It should feel secure, inspectable, and organized.

## Information Hierarchy

1. Connection and credential state.
2. Provider categories.
3. Permission scopes.
4. Secret/local/cloud/framework boundaries.

## Primary Object Model

Integration/provider with connection state, permission scope, data boundary, blocker, and receipt requirement.

## Secondary Object Model

Secret boundary, local/cloud placeholder, framework export blocker, and permission review notes.

## Navigation Behavior

Provider category selection should update inspector. No connection flow is active in UI-004.

## Right Inspector Behavior

Inspector explains selected provider/tool, permission implications, credential absence, blocker, and expected receipt if later connected.

## Empty / Loading / Blocked States

Empty provider state says no provider connection. Secret absence is a positive safety state, not an error.

## Status And Badge Usage

Use provider blocked and credentials absent at provider/category level. Avoid repeated red badges on every line.

## Primary Actions

- Inspect provider gate.
- Review permissions.
- Review secret boundary.

## Secondary Actions

- Inspect local/cloud placeholder.
- Inspect framework export blocker.
- Inspect receipt requirement.

## Disabled / Dangerous Action Behavior

No OAuth, provider connection, credential storage, local cloud enablement, or framework import occurs.

## Keyboard / Focus Behavior

Provider rows/cards are selectable and update inspector. Disabled connect actions remain absent or clearly disabled.

## Responsive Behavior

Desktop may show category matrix plus permission detail. Mobile shows grouped provider list, then detail.

## Visual Polish Requirements

- Group providers by domain: email, calendar, tasks, source, local/cloud, framework.
- Use permission tables or compact scope rows.
- Make credential absence calm and explicit.

## Component Reuse Requirements

Reuse provider card, permission row, secret boundary panel, gate panel, and inspector grammar.

## Page-Specific Visual Distinction

Extensions must feel like trust and connection management.

## What Currently Fails

The current page shows status, but not enough permission/control-center hierarchy.

## Required Improvements

- Add stronger provider grouping.
- Make permissions and data boundaries the primary content.
- Separate framework blocker from user provider gates.

## Acceptance Checklist

- Credentials absence is obvious.
- Local/cloud behavior is not implied.
- Framework blocker is visible but not confused with provider setup.
- No connection path executes.
