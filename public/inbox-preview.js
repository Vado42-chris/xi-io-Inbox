const DATA_URL = './data/inbox-events.preview.json';
const STORAGE_KEY = 'xiio-inbox-preview-state-v2';

const ROUTE_PREFIX = '#/';
const DEFAULT_LANE = 'home';

const state = {
  payload: null,
  laneId: DEFAULT_LANE,
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
  if (['available', 'preview_ready', 'draft_only', 'local_only'].includes(normalized)) return 'pill pill-ok';
  if (['blocked', 'runtime_blocked', 'send_blocked', 'provider_blocked', 'failed'].includes(normalized)) return 'pill pill-danger';
  if (['preview_only', 'undecided', 'pending', 'needs_review', 'not_started', 'direct_export_blocked'].includes(normalized)) return 'pill pill-warning';
  return 'pill pill-neutral';
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

function getPayload() {
  return state.payload || {
    workspace: {},
    lanes: [],
    laneContent: {},
    providerGates: [],
    egressPolicy: {},
    inspector: {},
  };
}

function getLanes() {
  return getPayload().lanes || [];
}

function laneIds() {
  return new Set(getLanes().map((lane) => lane.id));
}

function laneFromHash() {
  const raw = String(window.location.hash || '').replace(ROUTE_PREFIX, '').trim();
  if (laneIds().has(raw)) return raw;
  return DEFAULT_LANE;
}

function activeLane() {
  return getLanes().find((lane) => lane.id === state.laneId) || getLanes()[0] || {
    id: DEFAULT_LANE,
    label: 'Home',
    route: '#/home',
    description: 'Preview lane unavailable.',
    status: 'preview_only',
  };
}

function activeLaneContent() {
  return getPayload().laneContent?.[state.laneId] || {
    eyebrow: 'preview lane',
    title: activeLane().label,
    summary: activeLane().description,
    primary: [],
    secondary: [],
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ laneId: state.laneId }));
}

function loadState() {
  const stored = safeParse(localStorage.getItem(STORAGE_KEY) || '{}', {});
  if (stored.laneId) state.laneId = stored.laneId;
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

function syncRoute() {
  const nextLane = laneFromHash();
  if (state.laneId !== nextLane) {
    state.laneId = nextLane;
    saveState();
  }
}

function ensureRoute() {
  if (!window.location.hash || !laneIds().has(laneFromHash())) {
    window.location.hash = `${ROUTE_PREFIX}${DEFAULT_LANE}`;
    state.laneId = DEFAULT_LANE;
    saveState();
  }
}

function renderTopBar() {
  const workspace = getPayload().workspace || {};
  return `
    <header class="app-topbar" role="banner">
      <section class="brand-block" aria-label="Product identity">
        <p class="eyebrow">xi-io Inbox</p>
        <h1>Unified ingress operations</h1>
      </section>

      <section class="topbar-context" aria-label="Active workspace and system state">
        <div>
          <span class="context-label">Workspace</span>
          <strong>${escapeHtml(workspace.displayName || 'Preview workspace')}</strong>
        </div>
        <div>
          <span class="context-label">Account</span>
          <strong>${escapeHtml(workspace.activeAccount || 'Preview account')}</strong>
        </div>
        <div class="pill-row compact-row">
          ${renderPill(workspace.providerStatus || 'preview_only')}
          ${renderPill(workspace.privacyMode || 'local_only')}
          ${renderPill(workspace.ibalStatus || 'preview_only')}
        </div>
      </section>

      <label class="command-box" aria-label="Search and command placeholder">
        <span>Search / command</span>
        <input type="search" placeholder="${escapeHtml(workspace.commandPlaceholder || 'Preview only')}" disabled />
      </label>
    </header>
  `;
}

function renderSafetyBanner() {
  const policy = getPayload().egressPolicy || {};
  const statements = policy.safetyStatements || [];
  return `
    <section class="safety-banner" role="status" aria-live="polite">
      <div>
        <p class="eyebrow">preview safety gate</p>
        <h2>Static shell only. Product runtime is not decided.</h2>
      </div>
      <ul>
        ${statements.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </section>
  `;
}

function renderNavigation() {
  return `
    <nav class="lane-nav" aria-label="Primary xi-io Inbox lanes">
      ${getLanes().map((lane) => `
        <a class="lane-link ${lane.id === state.laneId ? 'is-active' : ''}" href="${escapeHtml(lane.route)}" aria-current="${lane.id === state.laneId ? 'page' : 'false'}">
          <span>${escapeHtml(lane.label)}</span>
          ${renderPill(lane.status || 'preview_only')}
        </a>
      `).join('')}
    </nav>
  `;
}

function renderMetricCard(item) {
  return `
    <article class="metric-card">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
      <p>${escapeHtml(item.note || '')}</p>
    </article>
  `;
}

function renderLaneItem(item) {
  return `
    <article class="lane-item">
      <header>
        <strong>${escapeHtml(item.title)}</strong>
        ${renderPill(item.state || 'preview_only')}
      </header>
      <p>${escapeHtml(item.summary)}</p>
    </article>
  `;
}

function renderMainLane() {
  const lane = activeLane();
  const content = activeLaneContent();
  return `
    <main class="lane-surface" aria-label="${escapeHtml(lane.label)} lane">
      <header class="lane-header">
        <div>
          <p class="eyebrow">${escapeHtml(content.eyebrow || lane.id)}</p>
          <h2>${escapeHtml(content.title || lane.label)}</h2>
          <p>${escapeHtml(content.summary || lane.description || '')}</p>
        </div>
        <div class="pill-row compact-row">
          ${renderPill(lane.status || 'preview_only')}
          ${renderPill(content.proofState || 'not_started')}
        </div>
      </header>

      <section class="metric-grid" aria-label="${escapeHtml(lane.label)} preview metrics">
        ${(content.primary || []).map(renderMetricCard).join('')}
      </section>

      <section class="lane-section" aria-label="${escapeHtml(lane.label)} preview workpath">
        <div class="section-heading">
          <p class="eyebrow">lane placeholder</p>
          <h3>${escapeHtml(content.placeholderTitle || 'Preview workpath')}</h3>
        </div>
        <div class="lane-item-list">
          ${(content.secondary || []).map(renderLaneItem).join('')}
        </div>
      </section>
    </main>
  `;
}

function renderInspectorSection(title, body, stateValue = 'preview_only') {
  return `
    <section class="inspector-section">
      <header>
        <h3>${escapeHtml(title)}</h3>
        ${renderPill(stateValue)}
      </header>
      <p>${escapeHtml(body)}</p>
    </section>
  `;
}

function renderDisabledActions() {
  const actions = getPayload().egressPolicy?.blockedActions || [];
  return `
    <div class="disabled-action-list" aria-label="Blocked egress actions">
      ${actions.map((action) => `
        <button class="disabled-action" type="button" disabled>
          ${escapeHtml(label(action))} blocked
        </button>
      `).join('')}
    </div>
  `;
}

function renderInspector() {
  const inspector = getPayload().inspector || {};
  return `
    <aside class="right-inspector" aria-label="Context, evidence, Ibal, and receipts">
      ${renderInspectorSection('Selected item context', inspector.context || 'Lane-level placeholder only. No provider item is selected.', 'preview_only')}
      ${renderInspectorSection('Evidence', inspector.evidence || 'Evidence references remain preview-only until provider gates are decided.', 'preview_only')}
      <section class="inspector-section">
        <header>
          <h3>Draft / egress state</h3>
          ${renderPill('draft_only')}
        </header>
        <p>${escapeHtml(inspector.egressState || 'Draft creation may be previewed. Send, forward, delete, disclose, publish, deploy, and provider mutation remain blocked.')}</p>
        ${renderDisabledActions()}
      </section>
      ${renderInspectorSection('Ibal proposal', inspector.ibalProposal || 'Ibal is a first-class lane and contextual proposal source. It proposes only in this preview.', 'pending')}
      ${renderInspectorSection('Receipts', inspector.receipts || 'Receipts are first-class audit placeholders. No confirmed runtime action exists.', 'preview_only')}
    </aside>
  `;
}

function renderShell() {
  const mount = document.getElementById('inboxPreviewMount');
  if (!mount) return;

  mount.innerHTML = `
    <section class="app-shell" aria-label="xi-io Inbox unified app shell">
      ${renderTopBar()}
      ${renderSafetyBanner()}
      <section class="app-frame">
        ${renderNavigation()}
        ${renderMainLane()}
        ${renderInspector()}
      </section>
    </section>
  `;
}

function bindEvents() {
  window.addEventListener('hashchange', () => {
    syncRoute();
    renderShell();
  });
}

async function init() {
  loadState();
  state.payload = await fetchJson(DATA_URL, {});
  ensureRoute();
  syncRoute();
  renderShell();
}

bindEvents();
init();

window.xiioInboxPreview = { state, renderShell, init };
