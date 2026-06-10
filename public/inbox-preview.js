const DATA_URL = './data/inbox-events.preview.json';
const STORAGE_KEY = 'xiio-inbox-preview-state-v2';

const ROUTE_PREFIX = '#/';
const DEFAULT_LANE = 'home';

const state = {
  payload: null,
  laneId: DEFAULT_LANE,
  threadId: null,
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
  if (['available', 'preview_ready', 'draft_only', 'local_only', 'documented', 'confirmed'].includes(normalized)) return 'pill pill-ok';
  if (['blocked', 'runtime_blocked', 'send_blocked', 'provider_blocked', 'failed', 'action_blocked'].includes(normalized)) return 'pill pill-danger';
  if (['preview_only', 'undecided', 'pending', 'needs_review', 'not_started', 'direct_export_blocked', 'proposal_only', 'dry_run_only', 'credentials_absent'].includes(normalized)) return 'pill pill-warning';
  return 'pill pill-neutral';
}

function renderPill(value) {
  return `<span class="${pillClass(value)}">${escapeHtml(label(value))}</span>`;
}

function renderPillRow(items) {
  return `
    <div class="pill-row compact-row">
      ${(items || []).map((item) => renderPill(item)).join('')}
    </div>
  `;
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

function routeIdFromHash() {
  return String(window.location.hash || '').replace(ROUTE_PREFIX, '').trim();
}

function laneFromHash() {
  const raw = routeIdFromHash();
  return laneIds().has(raw) ? raw : DEFAULT_LANE;
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

function sectionByType(content, type) {
  return (content.sections || []).find((section) => section.type === type);
}

function inboxThreads() {
  const inbox = getPayload().laneContent?.inbox || {};
  return sectionByType(inbox, 'inbox-layout')?.threads || [];
}

function selectedInboxThread() {
  const threads = inboxThreads();
  return threads.find((thread) => thread.id === state.threadId) || threads.find((thread) => thread.selected) || threads[0] || null;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ laneId: state.laneId, threadId: state.threadId }));
}

function loadState() {
  const stored = safeParse(localStorage.getItem(STORAGE_KEY) || '{}', {});
  if (stored.laneId) state.laneId = stored.laneId;
  if (stored.threadId) state.threadId = stored.threadId;
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
  if (!state.threadId && inboxThreads().length) {
    state.threadId = selectedInboxThread()?.id || null;
    saveState();
  }
}

function ensureRoute() {
  if (!window.location.hash || !laneIds().has(routeIdFromHash())) {
    window.location.hash = `${ROUTE_PREFIX}${DEFAULT_LANE}`;
    state.laneId = DEFAULT_LANE;
    saveState();
  }
}

function selectInboxThread(threadId) {
  if (!threadId || !inboxThreads().some((thread) => thread.id === threadId)) return;
  state.threadId = threadId;
  saveState();
  renderShell();
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

function renderDetailList(items) {
  if (!items?.length) return '';
  return `
    <ul class="detail-list">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
    </ul>
  `;
}

function renderLaneItem(item, className = 'lane-item') {
  return `
    <article class="${className}">
      <header>
        <strong>${escapeHtml(item.title)}</strong>
        ${renderPill(item.state || 'preview_only')}
      </header>
      <p>${escapeHtml(item.summary)}</p>
      ${item.meta ? `<small>${escapeHtml(item.meta)}</small>` : ''}
      ${renderDetailList(item.details)}
    </article>
  `;
}

function renderSectionHeader(section) {
  return `
    <header class="section-heading">
      <div>
        <p class="eyebrow">${escapeHtml(section.eyebrow || section.type || 'preview')}</p>
        <h3>${escapeHtml(section.title || 'Preview section')}</h3>
      </div>
      ${section.state ? renderPill(section.state) : ''}
    </header>
  `;
}

function renderPriorityStack(section) {
  return `
    <section class="lane-section priority-stack" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <ol class="ranked-list">
        ${(section.items || []).map((item) => `
          <li>
            <span class="rank-token">${escapeHtml(item.rank)}</span>
            <div>
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.summary)}</p>
              ${renderPillRow(item.tags || [])}
            </div>
          </li>
        `).join('')}
      </ol>
    </section>
  `;
}

function renderHomePreviewGrid(section) {
  return `
    <section class="lane-section home-preview-grid" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="preview-grid">
        ${(section.groups || []).map((group) => `
          <article class="preview-group">
            <header>
              <strong>${escapeHtml(group.label)}</strong>
              ${renderPill(group.state || 'preview_only')}
            </header>
            ${(group.items || []).map((item) => `
              <div class="compact-preview-row">
                <span>${escapeHtml(item.title)}</span>
                <small>${escapeHtml(item.meta || '')}</small>
              </div>
            `).join('')}
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderNextSafeAction(section) {
  const action = section.action || {};
  return `
    <section class="lane-section next-safe-action" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <article class="callout-panel">
        <strong>${escapeHtml(action.title || 'No proposal loaded')}</strong>
        <p>${escapeHtml(action.summary || '')}</p>
        ${renderDetailList(action.criteria)}
        ${renderPillRow(action.tags || ['proposal_only'])}
      </article>
    </section>
  `;
}

function renderInboxLayout(section) {
  const selected = selectedInboxThread();
  return `
    <section class="lane-section inbox-layout" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="inbox-grid">
        <aside class="mailbox-panel">
          <h4>Accounts</h4>
          ${(section.accounts || []).map((account) => `
            <article>
              <strong>${escapeHtml(account.name)}</strong>
              <p>${escapeHtml(account.meta)}</p>
              ${renderPill(account.state || 'provider_blocked')}
            </article>
          `).join('')}
          <h4>Smart views</h4>
          ${(section.views || []).map((view) => `
            <div class="folder-row">
              <span>${escapeHtml(view.label)}</span>
              <strong>${escapeHtml(view.count)}</strong>
            </div>
          `).join('')}
        </aside>
        <div class="thread-list">
          ${(section.threads || []).map((thread) => `
            <button class="thread-row ${selected?.id === thread.id ? 'is-selected' : ''}" type="button" data-thread-id="${escapeHtml(thread.id)}" aria-pressed="${selected?.id === thread.id ? 'true' : 'false'}">
              <header>
                <span>
                  <strong>${escapeHtml(thread.sender || thread.title)}</strong>
                  <small>${escapeHtml(thread.receivedAt || '')}</small>
                </span>
                ${renderPill(thread.state || 'preview_only')}
              </header>
              <span class="thread-subject">${escapeHtml(thread.title)}</span>
              <p>${escapeHtml(thread.summary)}</p>
              ${renderPillRow(thread.labels || [])}
            </button>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderThreadDetail(section) {
  const thread = section.thread || selectedInboxThread() || {};
  return `
    <section class="lane-section thread-detail-panel" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <article class="detail-panel">
        <header>
          <div>
            <strong>${escapeHtml(thread.title || 'Selected thread preview')}</strong>
            <p>${escapeHtml(thread.summary || '')}</p>
          </div>
          ${renderPill(thread.state || 'needs_review')}
        </header>
        <dl class="detail-grid">
          ${(thread.fields || thread.detailFields || []).map((field) => `
            <div>
              <dt>${escapeHtml(field.label)}</dt>
              <dd>${escapeHtml(field.value)}</dd>
            </div>
          `).join('')}
        </dl>
        ${renderPillRow(thread.tags || [])}
      </article>
    </section>
  `;
}

function renderMessageTimeline(section) {
  const thread = selectedInboxThread() || {};
  const messages = thread.messages || section.messages || [];
  return `
    <section class="lane-section message-timeline-panel" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="message-stack">
        ${messages.map((message) => `
          <article class="message-row">
            <header>
              <div>
                <strong>${escapeHtml(message.from)}</strong>
                <small>${escapeHtml(message.meta)}</small>
              </div>
              ${renderPill(message.state || 'preview_only')}
            </header>
            <p>${escapeHtml(message.summary)}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderEvidenceTray(section) {
  const thread = selectedInboxThread() || {};
  const evidence = thread.evidence || section.evidence || [];
  const attachments = thread.attachments || section.attachments || [];
  return `
    <section class="lane-section evidence-tray-panel" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="split-panel">
        <article class="lane-item evidence-list">
          <header>
            <strong>Evidence refs</strong>
            ${renderPill('preview_only')}
          </header>
          ${renderDetailList(evidence.map((item) => `${item.label}: ${item.summary}`))}
        </article>
        <article class="lane-item attachment-list">
          <header>
            <strong>Attachments</strong>
            ${renderPill('provider_blocked')}
          </header>
          ${renderDetailList(attachments.map((item) => `${item.label}: ${item.state}`))}
        </article>
      </div>
    </section>
  `;
}

function renderDraftEgress(section) {
  const thread = selectedInboxThread() || {};
  const draft = thread.draft || section.draft || {};
  return `
    <section class="lane-section draft-egress-panel" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="split-panel">
        ${renderLaneItem(draft, 'lane-item draft-preview')}
        <article class="lane-item">
          <header>
            <strong>Blocked gates</strong>
            ${renderPill('action_blocked')}
          </header>
          <div class="disabled-action-list inline-actions">
            ${(section.blockedActions || getPayload().egressPolicy?.blockedActions || []).map((action) => `
              <button class="disabled-action" type="button" disabled>${escapeHtml(label(action))} blocked</button>
            `).join('')}
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderAgenda(section) {
  return `
    <section class="lane-section agenda-preview" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="timeline-list">
        ${(section.items || []).map((item) => `
          <article class="timeline-row">
            <time>${escapeHtml(item.time)}</time>
            <div>
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.summary)}</p>
              ${renderPillRow(item.tags || [])}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderProposalList(section) {
  return `
    <section class="lane-section proposal-list" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="lane-item-list">
        ${(section.items || []).map((item) => renderLaneItem(item, 'lane-item proposal-card')).join('')}
      </div>
    </section>
  `;
}

function renderConflictPanel(section) {
  return `
    <section class="lane-section conflict-panel" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="split-panel">
        ${(section.items || []).map((item) => renderLaneItem(item, 'lane-item conflict-card')).join('')}
      </div>
    </section>
  `;
}

function renderTaskBoard(section) {
  return `
    <section class="lane-section task-board" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="board-columns">
        ${(section.columns || []).map((column) => `
          <section class="board-column">
            <header>
              <strong>${escapeHtml(column.label)}</strong>
              ${renderPill(column.state || 'preview_only')}
            </header>
            ${(column.items || []).map((item) => renderLaneItem(item, 'lane-item task-card')).join('')}
          </section>
        `).join('')}
      </div>
    </section>
  `;
}

function renderTaskLinks(section) {
  return `
    <section class="lane-section task-links" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="source-link-grid">
        ${(section.links || []).map((linkItem) => `
          <article>
            <span>${escapeHtml(linkItem.source)}</span>
            <strong>${escapeHtml(linkItem.title)}</strong>
            <p>${escapeHtml(linkItem.summary)}</p>
            ${renderPill(linkItem.state || 'preview_only')}
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderAutomationStudio(section) {
  return `
    <section class="lane-section automation-studio" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="automation-grid">
        ${(section.templates || []).map((template) => `
          <article class="automation-template">
            <header>
              <strong>${escapeHtml(template.title)}</strong>
              ${renderPill(template.state || 'dry_run_only')}
            </header>
            <p>${escapeHtml(template.summary)}</p>
            <dl class="mini-dl">
              <div><dt>Trigger</dt><dd>${escapeHtml(template.trigger)}</dd></div>
              <div><dt>Gate</dt><dd>${escapeHtml(template.gate)}</dd></div>
              <div><dt>Receipt</dt><dd>${escapeHtml(template.receipt)}</dd></div>
            </dl>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderDryRun(section) {
  return `
    <section class="lane-section dry-run-preview" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="dry-run-steps">
        ${(section.steps || []).map((step, index) => `
          <article>
            <span>${escapeHtml(index + 1)}</span>
            <div>
              <strong>${escapeHtml(step.title)}</strong>
              <p>${escapeHtml(step.summary)}</p>
              ${renderPill(step.state || 'preview_only')}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderExtensionMatrix(section) {
  return `
    <section class="lane-section extension-matrix" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="integration-grid">
        ${(section.providers || []).map((provider) => `
          <article>
            <header>
              <strong>${escapeHtml(provider.label)}</strong>
              ${renderPill(provider.state || 'provider_blocked')}
            </header>
            <p>${escapeHtml(provider.summary)}</p>
            <small>${escapeHtml(provider.permissions)}</small>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderSecretBoundary(section) {
  return `
    <section class="lane-section secret-boundary" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="boundary-list">
        ${(section.items || []).map((item) => renderLaneItem(item, 'lane-item boundary-card')).join('')}
      </div>
    </section>
  `;
}

function renderReceiptLedger(section) {
  return `
    <section class="lane-section receipt-ledger" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="ledger-table" role="table" aria-label="${escapeHtml(section.title)}">
        ${(section.rows || []).map((row) => `
          <article class="ledger-row" role="row">
            <span role="cell">${escapeHtml(row.kind)}</span>
            <strong role="cell">${escapeHtml(row.title)}</strong>
            <span role="cell">${escapeHtml(row.source)}</span>
            <span role="cell">${renderPill(row.state || 'preview_only')}</span>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderReceiptGroups(section) {
  return `
    <section class="lane-section receipt-groups" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="preview-grid">
        ${(section.groups || []).map((group) => `
          <article class="preview-group">
            <header>
              <strong>${escapeHtml(group.label)}</strong>
              ${renderPill(group.state || 'preview_only')}
            </header>
            <p>${escapeHtml(group.summary)}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderIbalBoard(section) {
  return `
    <section class="lane-section ibal-board" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="ibal-grid">
        ${(section.groups || []).map((group) => `
          <article class="ibal-panel">
            <header>
              <strong>${escapeHtml(group.label)}</strong>
              ${renderPill(group.state || 'proposal_only')}
            </header>
            ${(group.items || []).map((item) => renderLaneItem(item, 'lane-item ibal-card')).join('')}
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderIbalChanges(section) {
  return `
    <section class="lane-section ibal-changes" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <article class="callout-panel">
        <strong>${escapeHtml(section.summaryTitle)}</strong>
        <p>${escapeHtml(section.summary)}</p>
        ${renderDetailList(section.changes || [])}
        ${renderPill('proposal_only')}
      </article>
    </section>
  `;
}

function renderSettingsGates(section) {
  return `
    <section class="lane-section settings-gates" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="settings-grid">
        ${(section.gates || []).map((gate) => `
          <article>
            <header>
              <strong>${escapeHtml(gate.label)}</strong>
              ${renderPill(gate.state || 'runtime_blocked')}
            </header>
            <p>${escapeHtml(gate.summary)}</p>
            <small>${escapeHtml(gate.control)}</small>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderPolicyList(section) {
  return `
    <section class="lane-section policy-list" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="policy-list-grid">
        ${(section.policies || []).map((policy) => `
          <article>
            <span>${escapeHtml(policy.label)}</span>
            <strong>${escapeHtml(policy.value)}</strong>
            <p>${escapeHtml(policy.summary)}</p>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderStructuredSection(section) {
  return `
    <section class="lane-section structured-section" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="lane-item-list">
        ${(section.items || []).map((item) => renderLaneItem(item)).join('')}
      </div>
    </section>
  `;
}

function renderLaneSection(section) {
  const renderers = {
    'priority-stack': renderPriorityStack,
    'home-preview-grid': renderHomePreviewGrid,
    'next-safe-action': renderNextSafeAction,
    'inbox-layout': renderInboxLayout,
    'thread-detail': renderThreadDetail,
    'message-timeline': renderMessageTimeline,
    'evidence-tray': renderEvidenceTray,
    'draft-egress': renderDraftEgress,
    'agenda': renderAgenda,
    'calendar-proposals': renderProposalList,
    'conflict-panel': renderConflictPanel,
    'task-board': renderTaskBoard,
    'task-links': renderTaskLinks,
    'automation-studio': renderAutomationStudio,
    'dry-run': renderDryRun,
    'extension-matrix': renderExtensionMatrix,
    'secret-boundary': renderSecretBoundary,
    'receipt-ledger': renderReceiptLedger,
    'receipt-groups': renderReceiptGroups,
    'ibal-board': renderIbalBoard,
    'ibal-changes': renderIbalChanges,
    'settings-gates': renderSettingsGates,
    'policy-list': renderPolicyList,
  };
  return (renderers[section.type] || renderStructuredSection)(section);
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
        ${(content.metrics || content.primary || []).map(renderMetricCard).join('')}
      </section>

      <div class="lane-content ${escapeHtml(content.layout || `${lane.id}-layout`)}">
        ${(content.sections || []).map(renderLaneSection).join('')}
      </div>
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

function activeInspector() {
  if (state.laneId === 'inbox') {
    const thread = selectedInboxThread();
    if (thread?.inspector) return thread.inspector;
  }
  return activeLaneContent().inspector || getPayload().inspector || {};
}

function renderInspector() {
  const lane = activeLane();
  const inspector = activeInspector();
  return `
    <aside class="right-inspector" aria-label="Context, evidence, Ibal, and receipts">
      <header class="inspector-title">
        <p class="eyebrow">right inspector</p>
        <h2>${escapeHtml(lane.label)}</h2>
      </header>
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

  document.addEventListener('click', (event) => {
    const threadButton = event.target.closest?.('[data-thread-id]');
    if (!threadButton) return;
    selectInboxThread(threadButton.dataset.threadId);
  });
}

async function init() {
  loadState();
  state.payload = await fetchJson(DATA_URL, {});
  state.threadId = selectedInboxThread()?.id || state.threadId;
  ensureRoute();
  syncRoute();
  renderShell();
}

bindEvents();
init();

window.xiioInboxPreview = { state, renderShell, init };
