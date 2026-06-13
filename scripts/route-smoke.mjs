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
