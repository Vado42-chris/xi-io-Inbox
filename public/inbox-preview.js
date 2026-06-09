const DATA_URL = './data/inbox-events.preview.json';
const STORAGE_KEY = 'xiio-inbox-preview-state-v1';

const state = {
  payload: null,
  accountId: null,
  view: 'inbox',
  selectedEventId: null,
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function label(value) {
  return String(value || 'unknown').replaceAll('_', ' ');
}

function pillClass(value) {
  const normalized = String(value || 'unknown');
  if (['verified', 'complete', 'ready', 'preview_enabled'].includes(normalized)) return 'pill pill-ok';
  if (['blocked', 'critical', 'danger', 'human_required'].includes(normalized)) return 'pill pill-danger';
  if (['needs_review', 'in_progress', 'draft_only', 'preview_only', 'medium', 'high'].includes(normalized)) return 'pill pill-warning';
  return 'pill';
}

function renderPill(value) {
  return `<span class="${pillClass(value)}">${escapeHtml(label(value))}</span>`;
}

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadState() {
  const stored = safeParse(localStorage.getItem(STORAGE_KEY) || '{}', {});
  if (stored.accountId) state.accountId = stored.accountId;
  if (stored.view) state.view = stored.view;
  if (stored.selectedEventId) state.selectedEventId = stored.selectedEventId;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    accountId: state.accountId,
    view: state.view,
    selectedEventId: state.selectedEventId,
  }));
}

async function fetchJson(url, fallback) {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) return fallback;
    return await response.json();
  } catch {
    return fallback;
  }
}

function getPayload() {
  return state.payload || { accounts: [], views: [], events: [] };
}

function getActiveAccount() {
  const payload = getPayload();
  return payload.accounts.find((account) => account.accountId === state.accountId) || payload.accounts[0] || null;
}

function getVisibleEvents() {
  const account = getActiveAccount();
  return getPayload().events.filter((event) => {
    const matchesAccount = !account || event.accountId === account.accountId;
    const matchesView = (event.viewTags || []).includes(state.view);
    return matchesAccount && matchesView;
  });
}

function getSelectedEvent() {
  const visible = getVisibleEvents();
  return visible.find((event) => event.eventId === state.selectedEventId) || visible[0] || null;
}

function renderAccountRail() {
  const payload = getPayload();
  const active = getActiveAccount();
  return `
    <aside class="left-rail" aria-label="Accounts, providers, and filters">
      <section class="zone">
        <p class="eyebrow">account lens</p>
        <h3>${escapeHtml(active?.displayName || 'No account')}</h3>
        <p class="muted">Provider: ${escapeHtml(active?.providerId || 'unknown')}</p>
        <div class="pill-row">
          ${renderPill(active?.syncState || 'unknown')}
          ${renderPill(active?.privacyProfile || 'unknown')}
        </div>
      </section>

      <section class="zone stack">
        <p class="eyebrow">accounts</p>
        ${(payload.accounts || []).map((account) => `
          <button class="account-button ${account.accountId === active?.accountId ? 'is-selected' : ''}" type="button" data-account-id="${escapeHtml(account.accountId)}">
            <strong>${escapeHtml(account.displayName)}</strong>
            <span class="muted">${escapeHtml(account.providerId)} · ${escapeHtml(label(account.syncState))}</span>
          </button>
        `).join('')}
      </section>

      <section class="zone stack">
        <p class="eyebrow">views</p>
        ${(payload.views || []).map((view) => `
          <button class="view-button ${view.id === state.view ? 'is-selected' : ''}" type="button" data-view-id="${escapeHtml(view.id)}" title="${escapeHtml(view.description)}">
            ${escapeHtml(view.label)}
          </button>
        `).join('')}
      </section>
    </aside>
  `;
}

function renderEventCard(event, selectedId) {
  return `
    <article class="event-card ${event.eventId === selectedId ? 'is-selected' : ''}" data-event-id="${escapeHtml(event.eventId)}" tabindex="0" aria-current="${event.eventId === selectedId ? 'true' : 'false'}">
      <div class="event-meta">
        <div class="pill-row">
          ${renderPill(event.eventType)}
          ${renderPill(event.lifecycleState)}
          ${renderPill(event.reviewState)}
          ${event.privacy?.sensitive ? renderPill('privacy_sensitive') : ''}
        </div>
        <time class="muted">${escapeHtml(new Date(event.timestamp).toLocaleString())}</time>
      </div>
      <h3>${escapeHtml(event.title)}</h3>
      <p>${escapeHtml(event.summary)}</p>
    </article>
  `;
}

function renderStream() {
  const events = getVisibleEvents();
  const selected = getSelectedEvent();
  const view = getPayload().views.find((item) => item.id === state.view);
  return `
    <section class="stream" aria-label="Message and action proposal stream">
      <header class="stream-header">
        <div>
          <p class="eyebrow">${escapeHtml(label(state.view))}</p>
          <h2>${escapeHtml(view?.label || 'Inbox')} stream</h2>
          <p class="muted">${escapeHtml(view?.description || 'Preview stream')}</p>
        </div>
        ${renderPill(`${events.length}_shown`)}
      </header>
      <section class="event-list">
        ${events.length ? events.map((event) => renderEventCard(event, selected?.eventId)).join('') : '<p class="empty-state">No preview events match this view.</p>'}
      </section>
    </section>
  `;
}

function renderEvidence(event) {
  const evidence = event?.evidence || [];
  return `
    <section class="context-section">
      <h4>Evidence and source refs</h4>
      ${evidence.length ? evidence.map((item) => `
        <article class="card">
          <strong>${escapeHtml(item.path)}</strong>
          <p>${escapeHtml(item.finding)}</p>
          <div class="pill-row">${renderPill(item.state)}${renderPill(item.evidenceType)}${renderPill(item.sourceTier)}</div>
        </article>
      `).join('') : '<p class="muted">No evidence attached.</p>'}
    </section>
  `;
}

function renderActions(event) {
  const actions = event?.actions || [];
  return `
    <section class="context-section">
      <h4>Draft-only actions</h4>
      <div class="stack">
        ${actions.map((action) => `
          <button class="action-button ${action.state === 'preview_enabled' ? 'primary' : ''}" type="button" ${action.state === 'blocked' ? 'disabled' : ''} title="${escapeHtml((action.blockedBy || []).join(', ') || action.state)}">
            ${escapeHtml(action.label)} · ${escapeHtml(label(action.state))}
          </button>
        `).join('')}
      </div>
      <p class="muted">External send, forward, delete, and disclosure actions remain blocked in this preview.</p>
    </section>
  `;
}

function renderContext() {
  const event = getSelectedEvent();
  if (!event) {
    return `
      <aside class="context-panel" aria-label="Selected thread context">
        <section class="context-section"><h3>Select an event</h3><p class="muted">Thread context appears here.</p></section>
      </aside>
    `;
  }
  return `
    <aside class="context-panel" aria-label="Selected thread context">
      <section class="context-section">
        <p class="eyebrow">selected thread</p>
        <h3>${escapeHtml(event.title)}</h3>
        <div class="pill-row">
          ${renderPill(event.providerId)}
          ${renderPill(event.lifecycleState)}
          ${renderPill(event.reviewState)}
          ${event.requiresLocalVerification ? renderPill('local_verification_required') : ''}
        </div>
        <p>${escapeHtml(event.summary)}</p>
      </section>
      ${renderEvidence(event)}
      <section class="context-section">
        <h4>Claims checked</h4>
        ${(event.claims || []).map((claim) => `<article class="card"><strong>${escapeHtml(claim.claim)}</strong><p>${escapeHtml(claim.caveat || '')}</p>${renderPill(claim.state)}</article>`).join('')}
      </section>
      ${renderActions(event)}
      <section class="context-section">
        <h4>Closure criteria</h4>
        <ol>${(event.closureCriteria || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>
      </section>
    </aside>
  `;
}

function render() {
  const mount = document.getElementById('inboxPreviewMount');
  if (!mount) return;
  const active = getActiveAccount();
  if (!state.accountId && active) state.accountId = active.accountId;
  const selected = getSelectedEvent();
  if (!state.selectedEventId && selected) state.selectedEventId = selected.eventId;
  mount.innerHTML = `${renderAccountRail()}${renderStream()}${renderContext()}`;
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const accountButton = event.target.closest('[data-account-id]');
    if (accountButton) {
      state.accountId = accountButton.dataset.accountId;
      state.selectedEventId = null;
      saveState();
      render();
      return;
    }

    const viewButton = event.target.closest('[data-view-id]');
    if (viewButton) {
      state.view = viewButton.dataset.viewId;
      state.selectedEventId = null;
      saveState();
      render();
      return;
    }

    const eventCard = event.target.closest('[data-event-id]');
    if (eventCard) {
      state.selectedEventId = eventCard.dataset.eventId;
      saveState();
      render();
    }
  });

  document.addEventListener('keydown', (event) => {
    const eventCard = event.target.closest('[data-event-id]');
    if (!eventCard) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      state.selectedEventId = eventCard.dataset.eventId;
      saveState();
      render();
    }
  });
}

async function init() {
  loadState();
  state.payload = await fetchJson(DATA_URL, { accounts: [], views: [], events: [] });
  render();
}

bindEvents();
init();

window.xiioInboxPreview = { state, render, init };
