import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.ROUTE_SMOKE_PORT || 4499);
const BASE = `http://127.0.0.1:${PORT}`;

function waitForPort(port, timeoutMs = 15000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = net.connect({ port, host: '127.0.0.1' });
      socket.once('connect', () => {
        socket.end();
        resolve();
      });
      socket.once('error', () => {
        socket.destroy();
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`HTTP server did not start on port ${port}`));
          return;
        }
        setTimeout(attempt, 120);
      });
    };
    attempt();
  });
}

function startServer() {
  return spawn('python3', ['-m', 'http.server', String(PORT), '--directory', 'public'], {
    cwd: root,
    stdio: 'ignore',
  });
}

async function main() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    console.error('route-smoke: fail — install devDependency: npm install');
    process.exit(1);
  }

  const server = startServer();
  let browser;
  try {
    await waitForPort(PORT);
    browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();
    const externalRequests = [];
    page.on('request', (request) => {
      const url = request.url();
      if (!url.startsWith(BASE) && !url.startsWith('data:')) externalRequests.push(url);
    });

    await page.goto(`${BASE}/#/home`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.app-shell', { timeout: 10000 });

    const skipLink = page.locator('a.skip-to-main');
    if (!(await skipLink.count())) throw new Error('missing skip-to-main link');
    if (!(await page.locator('#appMainLane').count())) throw new Error('missing #appMainLane');

    for (const workspace of ['home', 'mail', 'calendar', 'tasks', 'automations', 'activity', 'integrations']) {
      if (!(await page.locator(`[data-product-workspace="${workspace}"]`).count())) {
        throw new Error(`primary nav missing ${workspace}`);
      }
    }
    if (await page.locator('[data-product-workspace="plan"]').count()) {
      throw new Error('Plan must not be a primary nav destination');
    }
    const navRows = await page.locator('.product-nav-item').evaluateAll((nodes) => {
      return [...new Set(nodes.map((node) => Math.round(node.getBoundingClientRect().top)))].length;
    });
    if (navRows !== 1) throw new Error(`primary nav wrapped into ${navRows} rows`);

    for (const [workspace, expectedHash, headingPattern] of [
      ['calendar', '#/calendar', /Calendar/i],
      ['tasks', '#/tasks', /Tasks/i],
      ['home', '#/home', /Home/i],
      ['mail', '#/inbox', /Inbox|Mail/i],
      ['home', '#/home', /Home/i],
    ]) {
      await page.locator(`[data-product-workspace="${workspace}"]`).click();
      await page.waitForSelector('#appMainLane', { timeout: 10000 });
      if (!page.url().includes(expectedHash)) throw new Error(`${workspace} nav did not route to ${expectedHash}`);
      const activeLabel = await page.locator('.product-nav-item.is-active').innerText();
      if (activeLabel.toLowerCase() !== workspace) throw new Error(`${workspace} nav active label mismatch: ${activeLabel}`);
      const heading = await page.locator('#appMainLane h1, #appMainLane h2').first().innerText();
      if (!headingPattern.test(heading)) throw new Error(`${workspace} nav heading mismatch: ${heading}`);
    }

    for (const [workspace, shouldClickHandoff] of [
      ['home', true],
      ['mail', true],
      ['calendar', true],
      ['tasks', true],
      ['automations', false],
      ['activity', false],
      ['integrations', false],
    ]) {
      await page.locator(`[data-product-workspace="${workspace}"]`).click();
      await page.waitForSelector('.related-suite-zone', { timeout: 10000 });
      const cards = page.locator('.related-suite-card');
      const cardCount = await cards.count();
      if (cardCount < 2) throw new Error(`${workspace} related zone needs at least two cards; found ${cardCount}`);
      const relatedText = await page.locator('.related-suite-zone').innerText();
      if (!/Source:/i.test(relatedText) || !/Why now:/i.test(relatedText) || !/Limit:/i.test(relatedText)) {
        throw new Error(`${workspace} related zone missing source/why/limit copy`);
      }
      if (shouldClickHandoff) {
        const before = page.url();
        await page.locator('.related-suite-card [data-related-action="open-target"]').first().click();
        await page.waitForSelector('#appMainLane', { timeout: 10000 });
        if (page.url() === before) throw new Error(`${workspace} related handoff did not change route/focus`);
      }
    }

    for (const workspace of ['mail', 'calendar', 'tasks', 'activity']) {
      await page.locator(`[data-product-workspace="${workspace}"]`).click();
      await page.waitForSelector('.scope-lens', { timeout: 10000 });
      const options = page.locator('.scope-lens-option');
      const optionCount = await options.count();
      if (optionCount < 2) throw new Error(`${workspace} scope lens missing account options`);
      const accountOption = page.locator('.scope-lens-option[data-scope-account-id]:not([data-scope-account-id="all"])').first();
      const accountLabel = await accountOption.innerText();
      await accountOption.click();
      const activeAccountScope = page.locator('.scope-lens-option.is-active').filter({ hasText: accountLabel }).first();
      await activeAccountScope.waitFor({ timeout: 10000 }).catch(async () => {
        const buttons = await page.evaluate(() => [...document.querySelectorAll('.scope-lens-option')].map((button) => ({
          text: button.textContent?.trim(),
          classes: button.className,
          account: button.getAttribute('data-scope-account-id'),
        })));
        const scopeState = await page.evaluate(() => ({
          laneId: window.xiioInboxPreview?.state?.laneId,
          activity: window.xiioInboxPreview?.state?.activity?.accountFilter,
        }));
        throw new Error(`${workspace} active account scope not rendered for ${accountLabel}; state ${JSON.stringify(scopeState)} buttons ${JSON.stringify(buttons)}`);
      });
      const activeScope = await activeAccountScope.innerText();
      if (activeScope !== accountLabel) {
        const scopeState = await page.evaluate(() => ({
          laneId: window.xiioInboxPreview?.state?.laneId,
          inbox: window.xiioInboxPreview?.state?.inbox?.accountFilter,
          calendar: window.xiioInboxPreview?.state?.calendar?.scopeFilter,
          tasks: window.xiioInboxPreview?.state?.tasks?.scopeFilter,
          activity: window.xiioInboxPreview?.state?.activity?.accountFilter,
        }));
        throw new Error(`${workspace} scope lens did not switch to account scope (${activeScope} vs ${accountLabel}; state ${JSON.stringify(scopeState)})`);
      }
      await page.locator('.scope-lens-option').filter({ hasText: 'All accounts' }).click();
    }

    await page.locator('[data-product-workspace="mail"]').click();
    await page.waitForSelector('.is-mail-workbench', { timeout: 10000 });
    await page.waitForSelector('.mail-list-pane .thread-row', { timeout: 10000 });

    const threadCount = await page.locator('.mail-list-pane .thread-row').count();
    if (threadCount < 1) throw new Error('mail thread list empty');

    await page.locator('.mail-list-pane .thread-row').first().click();
    const readingText = await page.locator('.mail-reading-stack').innerText();
    if (!/Body not imported|Read-only body snapshot|Select a conversation/i.test(readingText)) {
      throw new Error('mail reading pane missing expected metadata/body honesty copy');
    }

    const blockedCopy = await page.locator('body').innerText();
    if (!/Send blocked|Send remains blocked|blocked/i.test(blockedCopy)) {
      throw new Error('blocked send copy not found on mail workspace');
    }

    for (const lane of ['home', 'inbox', 'calendar', 'tasks', 'settings', 'receipts']) {
      await page.goto(`${BASE}/#/${lane}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('#appMainLane', { timeout: 10000 });
      await page.waitForSelector('.lane-surface', { timeout: 10000 });
    }

    if (externalRequests.length) {
      throw new Error(`external requests during route smoke: ${externalRequests.join(', ')}`);
    }

    console.log(`route-smoke: pass (${threadCount} mail threads, ${['home', 'inbox', 'calendar', 'tasks', 'settings', 'receipts'].length} lanes)`);
  } finally {
    if (browser) await browser.close().catch(() => {});
    server.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(`route-smoke: fail — ${error.message}`);
  process.exit(1);
});
