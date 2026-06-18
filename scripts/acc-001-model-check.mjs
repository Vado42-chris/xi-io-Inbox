import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsPath = path.join(root, 'public/inbox-preview.js');
const jsonPath = path.join(root, 'public/data/inbox-events.preview.json');

const js = fs.readFileSync(jsPath, 'utf8');
const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const mailProviders = new Set(['gmail', 'imap', 'outlook', 'microsoft', 'exchange', 'fixture']);
const integrationProviders = new Set(['github', 'slack', 'discord', 'jira', 'linear', 'zapier', 'make', 'n8n', 'calendar', 'drive']);

assert.match(js, /const STORAGE_KEY = 'xiioInbox\.preview\.state';/);
assert.match(js, /const STORAGE_SCHEMA_VERSION = 11;/);
assert.match(js, /const MAIL_PROVIDER_IDS/);
assert.match(js, /const INTEGRATION_PROVIDER_IDS/);
assert.match(js, /function allMailAccounts\(/);
assert.match(js, /function renderMailAccountAccordion\(/);
assert.match(js, /function renderGroupedMailThreadList\(/);
assert.match(js, /function integrationAccountCards\(/);
assert.match(js, /draftWriteState: 'blocked'/);
assert.match(js, /sendState: 'blocked'/);
assert.match(js, /mutationState: 'blocked'/);
assert.match(js, /function renderAccountMailboxButton\(/);
assert.match(js, /view: 'sent'/);
assert.match(js, /view: 'archive'/);
assert.match(js, /view: 'trash'/);
assert.match(js, /view: 'spam'/);
assert.match(js, /function ibalMailContextLabel\(/);
assert.match(js, /wipe-gmail-local-hint/);

for (const account of payload.accounts || []) {
  const provider = String(account.providerId || '').toLowerCase();
  assert.ok(mailProviders.has(provider) || provider.includes('gmail') || provider.includes('mail'), `fixture account ${account.accountId} must be mail provider, got ${provider}`);
  assert.ok(!integrationProviders.has(provider), `fixture account ${account.accountId} must not be integration provider ${provider}`);
}

const inboxSection = payload.laneContent?.inbox?.sections?.find((entry) => entry.type === 'inbox-layout');
assert.ok(inboxSection, 'inbox-layout section required');
for (const account of inboxSection.accounts || []) {
  const name = String(account.name || '').toLowerCase();
  assert.ok(!name.includes('github'), 'inbox-layout accounts must not list GitHub as mail account');
}

const githubThread = inboxSection.threads?.find((entry) => entry.id === 'thread-github-review-preview');
assert.ok(githubThread, 'github review thread fixture required');
assert.equal(githubThread.accountId, 'personal-gmail-preview');
assert.equal(githubThread.integrationSource, 'github');

const serialized = JSON.stringify(payload).toLowerCase();
assert.ok(!serialized.includes('github-notifications-preview'), 'removed github mail account id must not appear in fixture');

console.log('acc-001-model-check: pass');
