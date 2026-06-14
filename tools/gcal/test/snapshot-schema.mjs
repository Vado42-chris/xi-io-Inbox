import assert from 'node:assert/strict';
import { validateCalendarSnapshot } from '../lib/snapshot-schema.js';

const valid = {
  schemaVersion: 1,
  accountEmail: 'sample@example.com',
  generatedAt: '2026-06-10T12:00:00.000Z',
  source: 'local-gcal-cli',
  mode: 'read-only-metadata',
  calendars: [{ id: 'primary', summary: 'Primary', primary: true, accessRole: 'owner', timeZone: 'UTC' }],
  events: [{
    id: 'evt1',
    calendarId: 'primary',
    summary: 'Sample event',
    description: 'Read-only metadata only',
    location: 'Remote',
    start: '2026-06-15T10:00:00.000Z',
    end: '2026-06-15T11:00:00.000Z',
    status: 'confirmed',
    allDay: false,
    provider: 'gcal-readonly',
  }],
  warnings: ['sample'],
  blockedCapabilities: ['event_write', 'calendar_mutation', 'browser_oauth'],
};

assert.equal(validateCalendarSnapshot(valid).ok, true);

const invalid = { ...valid, mode: 'write-enabled' };
assert.equal(validateCalendarSnapshot(invalid).ok, false);

const withAttendees = {
  ...valid,
  events: [{ ...valid.events[0], attendees: [{ email: 'secret@example.com' }] }],
};
assert.equal(validateCalendarSnapshot(withAttendees).ok, false);

console.log('snapshot-schema: pass');
