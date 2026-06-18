/**
 * FIX-BATCH-003 Home owner-mode overlay.
 *
 * This file intentionally patches only the rendered Home workspace. It avoids touching
 * provider/runtime paths and leaves scaffold mode recoverable through the main preview.
 */
const OWNER_HOME_UX = true;
const HOME_OWNER_PATCH_ATTR = 'data-owner-home-patched';

function textForSelector(root, selector) {
  return root.querySelector(selector)?.textContent?.trim() || '';
}

function statValueByLabel(root, labelText) {
  const cards = Array.from(root.querySelectorAll('.home-stat-card'));
  const card = cards.find((entry) => textForSelector(entry, 'span').toLowerCase() === labelText.toLowerCase());
  return textForSelector(card || document.createElement('div'), 'strong') || '0';
}

function ownerStatusCard(root) {
  const unread = statValueByLabel(root, 'Unread conversations');
  const tasks = statValueByLabel(root, 'Open tasks');
  const events = statValueByLabel(root, 'Upcoming events');
  return `
    <section class="owner-home-status-card" aria-label="Home status">
      <div>
        <p class="owner-home-eyebrow">Owner preview</p>
        <h3>Start from your real inbox state</h3>
        <p>This Home screen is using local preview data. Connect or sync Gmail in the desktop app before treating counts or attention items as live priorities.</p>
      </div>
      <dl class="owner-home-status-grid" aria-label="Preview counts">
        <div><dt>Mail shown</dt><dd>${unread}</dd></div>
        <div><dt>Tasks</dt><dd>${tasks}</dd></div>
        <div><dt>Calendar</dt><dd>${events}</dd></div>
      </dl>
    </section>
  `;
}

function ownerPrimaryActions() {
  return `
    <div class="owner-home-actions" role="toolbar" aria-label="Home actions">
      <button class="inbox-action-btn is-primary" type="button" data-home-action="open-lane" data-lane-id="inbox">Open Mail</button>
      <button class="inbox-action-btn" type="button" data-home-action="open-lane" data-lane-id="settings" data-settings-key="user:accounts">Account settings</button>
      <button class="inbox-action-btn" type="button" data-home-action="open-lane" data-lane-id="tasks">Tasks</button>
      <button class="inbox-action-btn" type="button" data-home-action="open-lane" data-lane-id="calendar">Calendar</button>
    </div>
  `;
}

function patchHomeWorkspace() {
  if (!OWNER_HOME_UX) return;
  const home = document.querySelector('.home-workspace');
  if (!home || home.getAttribute(HOME_OWNER_PATCH_ATTR) === 'true') return;

  home.setAttribute(HOME_OWNER_PATCH_ATTR, 'true');
  home.classList.add('owner-home-workspace');

  const stats = home.querySelector('.home-stats-grid');
  if (stats) {
    stats.insertAdjacentHTML('beforebegin', ownerStatusCard(home));
    stats.setAttribute('aria-label', 'Preview counts, not live priority ranking');
    stats.classList.add('is-owner-secondary');
  }

  const priority = home.querySelector('.home-priority-panel');
  if (priority) {
    priority.classList.add('owner-home-start-panel');
    priority.innerHTML = `
      <h3>What to do next</h3>
      <article class="home-priority-card owner-home-priority-card">
        <div>
          <strong>Review Mail and Account status first</strong>
          <p>FIX-BATCH-001 and FIX-BATCH-002 are ready for owner retest. This Home card no longer promotes fixture mail as a real urgent item.</p>
        </div>
        <button class="inbox-action-btn is-primary" type="button" data-home-action="open-lane" data-lane-id="inbox">Open Mail</button>
      </article>
      ${ownerPrimaryActions()}
    `;
  }

  const advanced = home.querySelector('.home-advanced');
  if (advanced) {
    advanced.classList.add('owner-home-advanced');
    const summary = advanced.querySelector('summary');
    if (summary) summary.textContent = 'Advanced preview details';
  }
}

const observer = new MutationObserver(() => patchHomeWorkspace());

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', patchHomeWorkspace, { once: true });
} else {
  patchHomeWorkspace();
}

observer.observe(document.body, { childList: true, subtree: true });
