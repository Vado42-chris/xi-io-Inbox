#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createRuntimeRefreshLoop } from '../../public/src/runtime/gmail-runtime-refresh-loop.js';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function testManualRefreshWhenActive() {
  const calls = [];
  const loop = createRuntimeRefreshLoop({
    isActive: () => true,
    onRefresh: async ({ reason }) => {
      calls.push(reason);
      return { ok: true };
    },
    intervalMs: 10_000,
  });
  const result = await loop.refreshNow();
  assert.equal(result.ok, true);
  assert.equal(calls[0], 'manual');
  loop.stop();
}

async function testSkipWhenInactive() {
  const loop = createRuntimeRefreshLoop({
    isActive: () => false,
    onRefresh: async () => ({ ok: true }),
    intervalMs: 10_000,
  });
  const result = await loop.refreshNow();
  assert.equal(result.skipped, true);
  assert.equal(loop.start(), false);
  assert.equal(loop.isRunning(), false);
  loop.stop();
}

async function testIntervalStartAndStop() {
  const calls = [];
  const loop = createRuntimeRefreshLoop({
    isActive: () => true,
    onRefresh: async ({ reason }) => {
      calls.push(reason);
      return { ok: true };
    },
    intervalMs: 30,
  });
  assert.equal(loop.start(), true);
  assert.equal(loop.isRunning(), true);
  await sleep(90);
  loop.stop();
  assert.equal(loop.isRunning(), false);
  assert.ok(calls.includes('start'), 'expected start tick');
  assert.ok(calls.includes('interval'), 'expected interval tick');
}

async function testSkipWhenBusy() {
  let resolveRefresh;
  const loop = createRuntimeRefreshLoop({
    isActive: () => true,
    onRefresh: () => new Promise((resolve) => {
      resolveRefresh = resolve;
    }),
    intervalMs: 10_000,
  });
  const first = loop.refreshNow();
  const second = await loop.refreshNow();
  assert.equal(second.skipped, true);
  assert.equal(second.reason, 'busy');
  resolveRefresh({ ok: true });
  await first;
  loop.stop();
}

async function testRecordsError() {
  const loop = createRuntimeRefreshLoop({
    isActive: () => true,
    onRefresh: async () => {
      throw new Error('boom');
    },
    intervalMs: 10_000,
  });
  const result = await loop.refreshNow();
  assert.equal(result.ok, false);
  assert.match(result.error, /boom/);
  assert.match(loop.getStatus().lastError, /boom/);
  loop.stop();
}

async function main() {
  await testManualRefreshWhenActive();
  await testSkipWhenInactive();
  await testIntervalStartAndStop();
  await testSkipWhenBusy();
  await testRecordsError();
  console.log('runtime-002c-refresh-loop.test: pass');
}

main().catch((error) => {
  console.error(`runtime-002c-refresh-loop.test: fail — ${error.message}`);
  process.exit(1);
});
