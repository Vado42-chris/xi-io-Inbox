/**
 * FIX-BATCH-005 Calendar owner-mode overlay.
 *
 * Patches only the rendered Calendar workspace. Keeps provider writes blocked and
 * preserves scaffold recovery when showWorkflowScaffold is enabled.
 */
const OWNER_CALENDAR_UX = true;
const CALENDAR_OWNER_PATCH_ATTR = 'data-owner-calendar-patched';

function calendarScaffoldEnabled() {
  try {
    const raw = window.localStorage.getItem('xiioInbox.preview.state');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.settings?.userPrefs?.showWorkflowScaffold === true;
  } catch {
    return false;
  }
}

function calendarOwnerText(root, selector) {
  return root.querySelector(selector)?.textContent?.trim() || '';
}

function calendarOwnerCount(root, selector) {
  return root.querySelectorAll(selector).length;
}

function calendarOwnerStatusCard(root) {
  const dayCount = calendarOwnerCount(root, '.calendar-day-cell:not(.is-pad)');
  const visibleEventCount = calendarOwnerCount(root, '.calendar-day-chip');
  const selectedDay = calendarOwnerText(root, '.calendar-day-agenda-head h4') || 'No day selected';
  return `
    <section class="calendar-owner-status-card" aria-label="Calendar status">
      <div>
        <p class="calendar-owner-eyebrow">Owner calendar</p>
        <h3>Month first, details only when you choose a day</h3>
        <p>This preview may include fixture or read-only calendar data. Calendar writes, invites, and provider sync remain blocked.</p>
      </div>
      <dl class="calendar-owner-status-grid" aria-label="Calendar preview summary">
        <div><dt>View</dt><dd>${dayCount ? `${dayCount} days` : 'Month'}</dd></div>
        <div><dt>Visible items</dt><dd>${visibleEventCount}</dd></div>
        <div><dt>Selected</dt><dd>${selectedDay}</dd></div>
      </dl>
    </section>
  `;
}

function calendarOwnerSetupCard(root) {
  const imported = calendarOwnerText(root, '.calendar-provider-banner strong');
  const copy = imported
    ? imported.replace(/\s+/g, ' ')
    : 'Calendar preview data only';
  return `
    <aside class="calendar-owner-setup-card" role="note" aria-label="Calendar provider status">
      <strong>${copy}</strong>
      <p>Use Calendar to review dates and local proposals. Provider calendar writes stay blocked until a later approved runtime gate.</p>
    </aside>
  `;
}

function moveCalendarAdvanced(root) {
  const existing = root.querySelector('.calendar-owner-advanced');
  if (existing) return;

  const readingPane = root.querySelector('.calendar-workspace-grid > .lane-reading-pane, .calendar-workspace-grid > .calendar-event-detail, .calendar-workspace-grid > .calendar-day-summary');
  const provider = root.querySelector('.calendar-provider-banner');
  const week = root.querySelector('.calendar-week-strip');
  const agenda = root.querySelector('.calendar-day-agenda');

  const advanced = document.createElement('details');
  advanced.className = 'calendar-owner-advanced';
  advanced.innerHTML = '<summary>Advanced calendar details</summary><div class="calendar-owner-advanced-body"></div>';
  const body = advanced.querySelector('.calendar-owner-advanced-body');

  if (readingPane) body.appendChild(readingPane);
  if (provider) {
    root.insertAdjacentHTML('afterbegin', calendarOwnerSetupCard(root));
    body.appendChild(provider);
  }
  if (week) body.appendChild(week);
  if (agenda) body.appendChild(agenda);

  const toolbar = root.querySelector('.lane-toolbar');
  if (toolbar) {
    toolbar.insertAdjacentElement('afterend', advanced);
  } else {
    root.appendChild(advanced);
  }
}

function patchCalendarWorkspace() {
  if (!OWNER_CALENDAR_UX || calendarScaffoldEnabled()) return;
  const calendar = document.querySelector('.calendar-workspace');
  if (!calendar || calendar.getAttribute(CALENDAR_OWNER_PATCH_ATTR) === 'true') return;

  calendar.setAttribute(CALENDAR_OWNER_PATCH_ATTR, 'true');
  calendar.classList.add('owner-calendar-workspace');

  const toolbar = calendar.querySelector('.lane-toolbar');
  if (toolbar) {
    toolbar.classList.add('calendar-owner-toolbar');
    const primary = toolbar.querySelector('[data-calendar-action="new-event"]');
    if (primary) primary.textContent = 'New local event';
    const more = toolbar.querySelector('.lane-toolbar-overflow');
    if (more) more.classList.add('calendar-owner-toolbar-advanced');
  }

  const grid = calendar.querySelector('.calendar-workspace-grid');
  if (grid) {
    grid.classList.add('calendar-owner-grid');
    grid.insertAdjacentHTML('beforebegin', calendarOwnerStatusCard(calendar));
  }

  moveCalendarAdvanced(calendar);
}

const calendarOwnerObserver = new MutationObserver(() => patchCalendarWorkspace());

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', patchCalendarWorkspace, { once: true });
} else {
  patchCalendarWorkspace();
}

calendarOwnerObserver.observe(document.body, { childList: true, subtree: true });
