import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PRIMARY_NAV,
  MAIL_WORKBENCH_VIEWS,
  ROUTE_TABLE_VERSION,
  workspaceForLane,
  laneForWorkspace,
  hashForWorkspace,
  hashForLane,
  scopeLensLanes,
  primaryNavIds,
  parseRouteIdFromHash,
  laneFromRouteId,
  PRODUCT_LEVEL_NAV,
} from '../public/src/shell/route-table.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsPath = path.join(root, 'public/inbox-preview.js');

const expectedPrimaryNav = ['home', 'mail', 'calendar', 'tasks', 'automations', 'activity', 'integrations'];

assert.equal(ROUTE_TABLE_VERSION, 1);
assert.deepEqual(primaryNavIds(), expectedPrimaryNav);
assert.deepEqual(PRODUCT_LEVEL_NAV.map((entry) => entry.id), expectedPrimaryNav);
assert.ok(!primaryNavIds().includes('plan'));
assert.ok(!primaryNavIds().includes('drafts'));
assert.ok(!primaryNavIds().includes('approvals'));

for (const entry of PRIMARY_NAV) {
  assert.ok(entry.label, `${entry.id} missing label`);
  assert.ok(entry.lane, `${entry.id} missing lane`);
  assert.match(entry.hash, /^#\//, `${entry.id} hash must start with #/`);
  assert.ok(entry.contextNavOwner?.startsWith('render'), `${entry.id} missing contextNavOwner`);
  assert.ok(entry.moduleOwner, `${entry.id} missing moduleOwner`);
}

assert.deepEqual(scopeLensLanes().sort(), ['calendar', 'inbox', 'receipts', 'tasks'].sort());

assert.equal(workspaceForLane('inbox'), 'mail');
assert.equal(workspaceForLane('receipts'), 'activity');
assert.equal(workspaceForLane('extensions'), 'integrations');
assert.equal(workspaceForLane('settings'), 'settings');
assert.equal(laneForWorkspace('mail'), 'inbox');
assert.equal(laneForWorkspace('activity'), 'receipts');
assert.equal(hashForWorkspace('mail'), '#/inbox');
assert.equal(hashForWorkspace('calendar'), '#/calendar');
assert.equal(hashForLane('receipts'), '#/receipts');

assert.ok(MAIL_WORKBENCH_VIEWS.every((entry) => entry.lane === 'inbox'));
assert.ok(MAIL_WORKBENCH_VIEWS.every((entry) => entry.hash === '#/inbox'));
assert.ok(MAIL_WORKBENCH_VIEWS.some((entry) => entry.mailboxView === 'drafts'));
assert.ok(MAIL_WORKBENCH_VIEWS.some((entry) => entry.mailboxView === 'approvals'));

assert.equal(parseRouteIdFromHash('#/calendar'), 'calendar');
assert.equal(laneFromRouteId('calendar', new Set(['home', 'calendar'])), 'calendar');
assert.equal(laneFromRouteId('ibal', new Set(['home'])), 'home');
assert.equal(laneFromRouteId('unknown', new Set(['home'])), 'home');

const js = fs.readFileSync(jsPath, 'utf8');
assert.match(js, /from '\.\/src\/shell\/route-table\.js'/);
assert.match(js, /workspaceForLane\(/);
assert.doesNotMatch(js, /const PRODUCT_LEVEL_NAV = \[/);

console.log('route-table-check: pass');
