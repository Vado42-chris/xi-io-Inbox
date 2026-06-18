const REQUIRED_FIELDS = [
  'accountEmail',
  'generatedAt',
  'source',
  'mode',
  'calendars',
  'events',
  'warnings',
  'blockedCapabilities',
];

const FORBIDDEN_KEYS = new Set([
  'access_token',
  'refresh_token',
  'credentials',
  'attendees',
  'attendee',
  'organizer',
  'creator',
  'conferenceData',
  'hangoutLink',
]);

const ALLOWED_EVENT_FIELDS = new Set([
  'id',
  'calendarId',
  'summary',
  'description',
  'location',
  'start',
  'end',
  'status',
  'allDay',
  'provider',
]);

function collectForbiddenKeys(value, pathPrefix = '', hits = []) {
  if (!value || typeof value !== 'object') return hits;
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectForbiddenKeys(entry, `${pathPrefix}[${index}]`, hits));
    return hits;
  }
  for (const [key, nested] of Object.entries(value)) {
    const nextPath = pathPrefix ? `${pathPrefix}.${key}` : key;
    if (FORBIDDEN_KEYS.has(key)) hits.push(nextPath);
    collectForbiddenKeys(nested, nextPath, hits);
  }
  return hits;
}

function validateEventFields(event, path, errors) {
  for (const key of Object.keys(event || {})) {
    if (!ALLOWED_EVENT_FIELDS.has(key)) errors.push(`${path} field not allowed: ${key}`);
  }
}

export function validateCalendarSnapshot(snapshot) {
  const errors = [];
  if (!snapshot || typeof snapshot !== 'object') {
    return { ok: false, errors: ['snapshot must be an object'] };
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in snapshot)) errors.push(`missing required field: ${field}`);
  }

  if (snapshot.mode !== 'read-only-metadata') errors.push('mode must be read-only-metadata');
  if (snapshot.source !== 'local-gcal-cli') errors.push('source must be local-gcal-cli');
  if (!Array.isArray(snapshot.calendars)) errors.push('calendars must be an array');
  if (!Array.isArray(snapshot.events)) errors.push('events must be an array');
  if (!Array.isArray(snapshot.warnings)) errors.push('warnings must be an array');
  if (!Array.isArray(snapshot.blockedCapabilities)) errors.push('blockedCapabilities must be an array');

  snapshot.events.forEach((event, index) => validateEventFields(event, `events[${index}]`, errors));

  for (const hit of collectForbiddenKeys(snapshot)) {
    errors.push(`forbidden key present: ${hit}`);
  }

  return { ok: errors.length === 0, errors };
}

export { validateCalendarSnapshot as validateMetadataSnapshot };
