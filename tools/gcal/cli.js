#!/usr/bin/env node
import {
  providerStatus,
  providerConnectStart,
  providerDisconnect,
  providerWipeLocalData,
  calendarProfileGet,
  calendarList,
  calendarEventsList,
  exportCalendarSnapshot,
  invokeBlocked,
} from './lib/adapter.js';

const HELP = `Google Calendar read-only adapter (GCAL-001)
Scope: calendar.readonly only. No event write, calendar mutation, or browser OAuth in preview.

Commands:
  status
  connect
  disconnect
  wipe [--dry-run]
  profile
  list-calendars [--max N]
  list-events [--calendar ID] [--max N]
  export-calendar-snapshot [--calendar ID] [--max N] [--out PATH]
  blocked <method>   (test blocked escalation)
`;

async function main() {
  const [,, cmd, ...rest] = process.argv;
  if (!cmd || cmd === 'help' || cmd === '--help') {
    console.log(HELP);
    return;
  }

  const flags = { _: null };
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i] === '--max') flags.max = Number(rest[++i]);
    else if (rest[i] === '--calendar') flags.calendar = rest[++i];
    else if (rest[i] === '--out') flags.out = rest[++i];
    else if (rest[i] === '--dry-run') flags.dryRun = true;
    else if (!flags._) flags._ = rest[i];
  }

  let result;
  try {
    switch (cmd) {
      case 'status':
        result = await providerStatus();
        break;
      case 'connect':
        result = await providerConnectStart();
        break;
      case 'disconnect':
        result = await providerDisconnect();
        break;
      case 'wipe':
        result = await providerWipeLocalData({ dryRun: Boolean(flags.dryRun) || rest.includes('--dry-run') });
        break;
      case 'profile':
        result = await calendarProfileGet();
        break;
      case 'list-calendars':
        result = await calendarList({ maxResults: flags.max || 10 });
        break;
      case 'list-events':
        result = await calendarEventsList({
          calendarId: flags.calendar || 'primary',
          maxResults: flags.max || 25,
        });
        break;
      case 'export-calendar-snapshot':
        result = await exportCalendarSnapshot({
          calendarId: flags.calendar || 'primary',
          maxResults: flags.max || 25,
          outputPath: flags.out,
        });
        break;
      case 'blocked':
        result = await invokeBlocked(flags._ || 'calendar.events.insert');
        break;
      default:
        console.error(`Unknown command: ${cmd}`);
        console.log(HELP);
        process.exit(1);
    }
  } catch (err) {
    result = { success: false, blocked: false, error: err.message || String(err) };
    process.exitCode = 1;
  }

  console.log(JSON.stringify(result, null, 2));
}

main();
