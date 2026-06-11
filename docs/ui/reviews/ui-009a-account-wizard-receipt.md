# UI-009A Account Wizard Receipt

## Date

2026-06-10

## Scope

Remove fake fixture accounts from user-facing UI. Add Gmail queue + Connect instructions wired to GMAIL-001C CLI.

## Changes

- `allPreviewAccounts()` returns connected list only (no fixture fallback)
- Add Gmail form: email → queue → Connect Gmail shows CLI steps
- Mail nav empty state when no accounts

## Excluded

- In-browser OAuth (tokens stay in tools/gmail)
- Live sync into preview UI (GMAIL-001C smoke pending)

## Validation

| Check | Result |
| --- | --- |
| `npm run check` | pass |
| Fixture accounts in user card | removed |
| Connect instructions | pass |
