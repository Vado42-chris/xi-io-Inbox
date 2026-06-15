/**
 * Canonical route-table contract (NAV-002 / CONVERGE-001).
 * Primary nav, lane hashes, scope lens, and mail workbench sub-views derive from here.
 */

export const ROUTE_TABLE_VERSION = 1;
export const ROUTE_PREFIX = '#/';
export const DEFAULT_LANE = 'home';
export const IBAL_LEGACY_LANE = 'ibal';
export const SCOPE_ALL_ACCOUNTS = 'all';

/** @typedef {import('./route-table.types.js').PrimaryNavRoute} PrimaryNavRoute */

/** @type {PrimaryNavRoute[]} */
export const PRIMARY_NAV = [
  {
    id: 'home',
    label: 'Home',
    lane: 'home',
    hash: '#/home',
    scopeLens: false,
    contextNavOwner: 'renderHomeContextNav',
    moduleOwner: 'capabilities/home',
  },
  {
    id: 'mail',
    label: 'Mail',
    lane: 'inbox',
    hash: '#/inbox',
    scopeLens: true,
    contextNavOwner: 'renderMailContextNav',
    moduleOwner: 'workbench/mail',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    lane: 'calendar',
    hash: '#/calendar',
    scopeLens: true,
    contextNavOwner: 'renderCalendarContextNav',
    moduleOwner: 'capabilities/calendar',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    lane: 'tasks',
    hash: '#/tasks',
    scopeLens: true,
    contextNavOwner: 'renderTasksContextNav',
    moduleOwner: 'capabilities/tasks',
  },
  {
    id: 'automations',
    label: 'Automations',
    lane: 'automations',
    hash: '#/automations',
    scopeLens: false,
    contextNavOwner: 'renderAutomationsContextNav',
    moduleOwner: 'capabilities/automations',
  },
  {
    id: 'activity',
    label: 'Activity',
    lane: 'receipts',
    hash: '#/receipts',
    scopeLens: true,
    contextNavOwner: 'renderActivityContextNav',
    moduleOwner: 'capabilities/activity',
  },
  {
    id: 'integrations',
    label: 'Integrations',
    lane: 'extensions',
    hash: '#/extensions',
    scopeLens: false,
    contextNavOwner: 'renderIntegrationsContextNav',
    moduleOwner: 'capabilities/integrations',
  },
];

/** Mail workbench inner views — same lane/hash; not primary nav destinations. */
export const MAIL_WORKBENCH_VIEWS = [
  { id: 'inbox', label: 'Inbox', lane: 'inbox', hash: '#/inbox', mailboxView: 'inbox' },
  { id: 'drafts', label: 'Drafts', lane: 'inbox', hash: '#/inbox', mailboxView: 'drafts' },
  { id: 'approvals', label: 'Approvals', lane: 'inbox', hash: '#/inbox', mailboxView: 'approvals' },
  { id: 'sent', label: 'Sent', lane: 'inbox', hash: '#/inbox', mailboxView: 'sent' },
];

export const UTILITY_LANES = [
  { id: 'settings', label: 'Settings', lane: 'settings', hash: '#/settings', scopeLens: false, moduleOwner: 'shell/settings' },
];

const primaryById = new Map(PRIMARY_NAV.map((entry) => [entry.id, entry]));
const primaryByLane = new Map(PRIMARY_NAV.map((entry) => [entry.lane, entry]));

export function primaryNavIds() {
  return PRIMARY_NAV.map((entry) => entry.id);
}

export function getPrimaryNavRoute(workspaceId) {
  return primaryById.get(workspaceId) || null;
}

export function workspaceForLane(laneId) {
  if (laneId === IBAL_LEGACY_LANE) return 'home';
  const match = primaryByLane.get(laneId);
  if (match) return match.id;
  if (laneId === 'settings') return 'settings';
  return null;
}

export function laneForWorkspace(workspaceId) {
  const route = getPrimaryNavRoute(workspaceId);
  return route?.lane || (workspaceId === 'settings' ? 'settings' : null);
}

export function hashForWorkspace(workspaceId) {
  const route = getPrimaryNavRoute(workspaceId);
  if (route) return route.hash;
  if (workspaceId === 'settings') return '#/settings';
  return `${ROUTE_PREFIX}${DEFAULT_LANE}`;
}

export function hashForLane(laneId) {
  const workspace = workspaceForLane(laneId);
  if (workspace === 'settings') return '#/settings';
  const route = workspace ? getPrimaryNavRoute(workspace) : null;
  return route?.hash || `${ROUTE_PREFIX}${laneId || DEFAULT_LANE}`;
}

export function scopeLensLanes() {
  return PRIMARY_NAV.filter((entry) => entry.scopeLens).map((entry) => entry.lane);
}

export function parseRouteIdFromHash(hash = '') {
  return String(hash || '').replace(ROUTE_PREFIX, '').trim();
}

export function laneFromRouteId(routeId, validLaneIds) {
  if (routeId === IBAL_LEGACY_LANE) return DEFAULT_LANE;
  if (validLaneIds?.has?.(routeId)) return routeId;
  if (validLaneIds instanceof Set && validLaneIds.has(routeId)) return routeId;
  if (Array.isArray(validLaneIds) && validLaneIds.includes(routeId)) return routeId;
  return DEFAULT_LANE;
}

/** @deprecated Use PRIMARY_NAV — kept for strangler bridge in inbox-preview.js */
export const PRODUCT_LEVEL_NAV = PRIMARY_NAV.map(({ id, label }) => ({ id, label }));
