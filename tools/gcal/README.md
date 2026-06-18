# Google Calendar Local Adapter (GCAL-001)

Local-only Google Calendar read-only adapter. No event write, no calendar mutation.

## Setup

```bash
cd tools/gcal
npm install
```

Place OAuth client JSON at `secrets/gcal-oauth-client.json` (repo gitignored). Redirect URI must include `http://127.0.0.1:8788/oauth2callback`.

## Commands

```bash
npm run check
node cli.js status
node cli.js connect
node cli.js profile
node cli.js list-calendars
node cli.js list-events --max 25
node cli.js export-calendar-snapshot --max 25
node cli.js wipe
node cli.js blocked calendar.events.insert
```

## Preview import

```bash
cp tools/gcal/data/calendar-snapshot.json public/data/gcal-events.local.json
# Settings → Accounts → Import calendar snapshot
```

## Rules

- Scope: `calendar.readonly` only
- Tokens: `tools/gcal/data/token.json` (gitignored)
- Snapshots exclude attendees, conference links, and tokens
- Browser preview import is local-only — not live Calendar sync
