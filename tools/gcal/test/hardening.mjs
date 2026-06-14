import assert from 'node:assert/strict';
import { guardMethod } from '../lib/adapter.js';

const blocked = guardMethod('calendar.events.insert');
assert.equal(blocked.success, false);
assert.equal(blocked.blocked, true);

const allowed = guardMethod('calendar.events.list');
assert.equal(allowed, null);

console.log('hardening: pass');
