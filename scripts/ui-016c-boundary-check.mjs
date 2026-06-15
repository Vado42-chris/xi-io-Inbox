import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { primaryNavIds } from '../public/src/shell/route-table.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const js = fs.readFileSync(path.join(root, 'public/inbox-preview.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'public/inbox-preview.css'), 'utf8');
const ui016 = fs.readFileSync(path.join(root, 'docs/ui/ui-016-level-5-componentization-consistency-index.md'), 'utf8');
const ui016b = fs.readFileSync(path.join(root, 'docs/ui/ui-016b-component-anatomy-and-boundary-checks.md'), 'utf8');
const todo = fs.readFileSync(path.join(root, 'TODO.md'), 'utf8');

const expectedPrimaryNav = ['home', 'mail', 'calendar', 'tasks', 'automations', 'activity', 'integrations'];
const knownReceiptRenderers = [
  'renderCalendarLocalReceipts',
  'renderTasksLocalReceipts',
  'renderAutomationsLocalReceipts',
  'renderExtensionsLocalReceipts',
  'renderSettingsLocalReceipts',
];
const knownProviderBanners = ['renderCalendarProviderBanner', 'renderTasksProviderBanner'];
const knownDetailGridClasses = ['extensions-detail-grid', 'settings-detail-grid', 'activity-detail-grid'];
const knownContextNavRenderers = [
  'renderMailContextNav',
  'renderDraftsContextNav',
  'renderApprovalsContextNav',
  'renderCalendarContextNav',
  'renderTasksContextNav',
  'renderAutomationsContextNav',
  'renderActivityContextNav',
  'renderIntegrationsContextNav',
  'renderSettingsContextNav',
];

function uniqueMatches(pattern, source) {
  return [...source.matchAll(pattern)].map((match) => match[1]).filter((value, index, all) => all.indexOf(value) === index);
}

function assertNoUnknown(actual, known, label) {
  const unknown = actual.filter((entry) => !known.includes(entry));
  assert.deepEqual(unknown, [], `${label} contains undocumented entries: ${unknown.join(', ')}`);
}

function assertDocMentions(doc, terms, label) {
  for (const term of terms) {
    assert.ok(doc.includes(term), `${label} missing ${term}`);
  }
}

const navIds = primaryNavIds();
assert.deepEqual(navIds, expectedPrimaryNav, 'primary nav must match NAV-002 route contract');
assert.ok(!navIds.includes('plan'), 'Plan must not be primary nav');
assert.ok(!navIds.includes('drafts'), 'Drafts must remain a Mail sub-view');
assert.ok(!navIds.includes('approvals'), 'Approvals must remain a Mail sub-view');

assert.match(js, /from '\.\/src\/shell\/route-table\.js'/);
assert.match(js, /workspaceForLane\(/);
assert.doesNotMatch(js, /const PRODUCT_LEVEL_NAV = \[/);

const receiptRenderers = uniqueMatches(/function (render[A-Za-z]+LocalReceipts)\(/g, js);
assertNoUnknown(receiptRenderers, knownReceiptRenderers, 'local receipt renderers');
assertDocMentions(ui016, receiptRenderers, 'UI-016 duplicated receipt renderer audit');

const providerBanners = uniqueMatches(/function (render[A-Za-z]+ProviderBanner)\(/g, js);
assertNoUnknown(providerBanners, knownProviderBanners, 'provider banners');
assertDocMentions(ui016, providerBanners, 'UI-016 provider banner audit');

const detailGridClasses = uniqueMatches(/class="([a-z-]+detail-grid)"/g, js);
assertNoUnknown(detailGridClasses, knownDetailGridClasses, 'detail grid classes');
assertDocMentions(ui016, detailGridClasses, 'UI-016 detail grid audit');

const contextNavRenderers = uniqueMatches(/function (render[A-Za-z]+ContextNav)\(/g, js);
assertNoUnknown(contextNavRenderers, knownContextNavRenderers, 'context nav renderers');
assertDocMentions(ui016, ['Context nav arrays', 'route/context table'], 'UI-016 context nav audit');

assert.match(js, /function renderDisabledActions\(/);
assert.match(js, /Send blocked|Send remains blocked/);
assert.match(css, /\.inbox-action-btn\.is-blocked/);
assert.match(ui016b, /check:blocked-actions/);

assert.match(js, /accountFilter/);
assert.match(todo, /accountId.*calendar proposals and task\/work items/i);
assert.match(ui016b, /check:scope-lens/);

assertDocMentions(ui016b, [
  'check:route-table',
  'check:receipt-renderers',
  'check:detail-grid',
  'check:blocked-actions',
  'check:scope-lens',
  'check:component-ownership',
  'check:visual-proof',
], 'UI-016B boundary check plan');

assertDocMentions(ui016, [
  'Framework with repo config',
  'framework',
  'This repo',
  'Split',
  'Template + repo',
], 'UI-016 ownership index');

console.log('ui-016c-boundary-check: pass');
console.log(`ui-016c-boundary-check: tracked debt — ${receiptRenderers.length} receipt renderers, ${providerBanners.length} provider banners, ${detailGridClasses.length} detail grid classes`);
