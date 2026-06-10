const DATA_URL = './data/inbox-events.preview.json';
const STORAGE_KEY = 'xiio-inbox-preview-state-v2';

const ROUTE_PREFIX = '#/';
const DEFAULT_LANE = 'home';

const state = {
  payload: null,
  laneId: DEFAULT_LANE,
  threadId: null,
  focusId: null,
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

function renderThreadStatusChip(state) {
  const normalized = String(state || 'preview_only');
  const tone = ['needs_review', 'human_required', 'urgent_thread'].includes(normalized) ? 'is-urgent' : 'is-neutral';
  return `<span class="thread-status-chip ${tone}">${escapeHtml(label(normalized))}</span>`;
}

function renderCompactLabelLine(labels) {
  if (!labels?.length) return '';
  return `<p class="thread-label-line">${labels.map((item) => escapeHtml(label(item))).join(' · ')}</p>`;
}

function renderEgressPolicyModule(actions) {
  const blocked = actions || getPayload().egressPolicy?.blockedActions || [];
  return `
    <section class="egress-policy-module" aria-label="Blocked egress policy">
      <header>
        <strong>Draft-only egress</strong>
        <span class="egress-policy-mode">no runtime writes</span>
      </header>
      <ul class="egress-policy-list">
        ${blocked.map((action) => `<li><span>${escapeHtml(label(action))}</span><em>blocked</em></li>`).join('')}
      </ul>
    </section>
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    laneId: state.laneId,
    threadId: state.threadId,
    focusId: state.focusId,
  }));
}

function loadState() {
  const stored = safeParse(localStorage.getItem(STORAGE_KEY) || '{}', {});
  if (stored.laneId) state.laneId = stored.laneId;
  if (stored.threadId) state.threadId = stored.threadId;
  if (stored.focusId) state.focusId = stored.focusId;
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
    state.focusId = defaultFocusIdForLane(nextLane);
    saveState();
  }
  if (!state.threadId && inboxThreads().length) {
    state.threadId = selectedInboxThread()?.id || null;
    saveState();
  }
  if (!state.focusId) {
    state.focusId = defaultFocusIdForLane(state.laneId);
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
  state.focusId = `inbox-thread:${threadId}`;
  saveState();
  renderShell();
  document.querySelector(`[data-thread-id="${CSS.escape(threadId)}"]`)?.focus({ preventScroll: true });
}

function laneNavHint(status) {
  const normalized = String(status || 'preview_only');
  if (['provider_blocked', 'runtime_blocked', 'blocked'].includes(normalized)) return 'gated';
  if (['proposal_only', 'dry_run_only'].includes(normalized)) return 'proposal';
  return '';
}

function trustTokenClass(status) {
  const normalized = String(status || 'preview_only');
  if (['provider_blocked', 'runtime_blocked', 'blocked', 'send_blocked', 'action_blocked'].includes(normalized)) return 'is-blocked';
  if (['draft_only', 'local_only', 'documented', 'available'].includes(normalized)) return 'is-safe';
  return 'is-preview';
}

function renderTrustToken(labelText, status) {
  return `<span class="trust-token ${trustTokenClass(status)}">${escapeHtml(labelText)}</span>`;
}

function defaultFocusIdForLane(laneId) {
  if (laneId === 'inbox') {
    const thread = selectedInboxThread();
    return thread ? `inbox-thread:${thread.id}` : 'lane:inbox';
  }
  return `lane:${laneId}`;
}

function inspectableItemsForLane(laneId) {
  const content = getPayload().laneContent?.[laneId] || {};
  const items = [{ id: `lane:${laneId}`, kind: 'lane', title: content.title || activeLane().label, summary: content.summary || activeLane().description }];

  if (laneId === 'inbox') {
    inboxThreads().forEach((thread) => {
      items.push({
        id: `inbox-thread:${thread.id}`,
        kind: 'inbox thread',
        title: thread.title,
        summary: thread.summary,
        inspector: thread.inspector,
        state: thread.state,
        safeNext: thread.draft?.title || 'Review thread metadata and draft proposal only.',
        blocked: 'Send, forward, delete, archive, disclose, publish, provider mutation, and repository mutation remain blocked.',
        receipt: 'A future confirmed draft or triage action would require a receipt.',
      });
    });
    return items;
  }

  (content.sections || []).forEach((section, sectionIndex) => {
    const pushItem = (suffix, kind, source) => {
      items.push({
        id: `${laneId}:${section.type}:${sectionIndex}:${suffix}`,
        kind,
        title: source.title,
        summary: source.summary,
        state: source.state,
        meta: source.meta,
        tags: source.tags,
        safeNext: source.action?.title || source.draft?.title || `Review ${kind} in ${content.title || laneId} without runtime action.`,
        blocked: 'Provider writes, automation execution, and dangerous egress remain blocked in this preview.',
        receipt: 'Receipt would be created only after a future confirmed action.',
      });
    };

    if (section.type === 'priority-stack') {
      (section.items || []).forEach((item, index) => pushItem(index, 'priority item', item));
    }
    if (section.type === 'agenda') {
      (section.items || []).forEach((item, index) => pushItem(index, 'agenda item', item));
    }
    if (section.type === 'calendar-proposals' || section.type === 'proposal-list') {
      (section.items || []).forEach((item, index) => pushItem(index, 'calendar proposal', {
        ...item,
        safeNext: 'Review proposal without provider calendar write.',
        blocked: 'Provider calendar writes remain blocked.',
      }));
    }
    if (section.type === 'conflict-panel') {
      (section.items || []).forEach((item, index) => pushItem(index, 'calendar conflict', item));
    }
    if (section.type === 'task-links') {
      (section.links || []).forEach((linkItem, index) => pushItem(index, 'task source link', {
        title: linkItem.title,
        summary: linkItem.summary,
        state: linkItem.state,
        meta: linkItem.source,
      }));
    }
    if (section.type === 'task-board') {
      (section.columns || []).forEach((column, columnIndex) => {
        (column.items || []).forEach((item, index) => pushItem(`${columnIndex}-${index}`, 'task', { ...item, meta: item.meta || column.label }));
      });
    }
    if (section.type === 'receipt-ledger') {
      (section.rows || []).forEach((row, index) => pushItem(index, 'receipt row', {
        title: row.title,
        summary: row.source,
        state: row.state,
        meta: row.kind,
        safeNext: 'Inspect receipt evidence and linked source without runtime confirmation.',
        receipt: 'Receipt row is planning evidence until a future confirmed action exists.',
      }));
    }
    if (section.type === 'ibal-board') {
      (section.groups || []).forEach((group, groupIndex) => {
        (group.items || []).forEach((item, index) => pushItem(`${groupIndex}-${index}`, 'ibal recommendation', {
          ...item,
          meta: group.label,
          safeNext: item.summary,
          blocked: 'Ibal cannot execute actions or connect providers in this preview.',
        }));
      });
    }
    if (section.type === 'settings-gates') {
      (section.gates || []).forEach((gate, index) => pushItem(index, 'policy gate', {
        title: gate.label,
        summary: gate.summary,
        state: gate.state,
        meta: gate.control,
        safeNext: 'Review gate policy before any future provider or runtime action.',
        blocked: gate.control,
      }));
    }
    if (section.type === 'policy-list') {
      (section.policies || []).forEach((policy, index) => pushItem(index, 'policy default', {
        title: policy.label,
        summary: policy.summary,
        state: policy.value,
        meta: policy.value,
        safeNext: 'Policy default remains fixture-only in static preview.',
        blocked: 'No policy write path exists in this preview.',
      }));
    }
    if (section.type === 'next-safe-action' && section.action) {
      pushItem('action', 'safe action', section.action);
    }
  });

  return items;
}

function activeInspectableItem() {
  const items = inspectableItemsForLane(state.laneId);
  return items.find((item) => item.id === state.focusId) || items[0] || null;
}

function selectInspectorFocus(focusId) {
  if (!focusId) return;
  const laneItems = inspectableItemsForLane(state.laneId);
  if (!laneItems.some((item) => item.id === focusId)) return;
  state.focusId = focusId;
  if (focusId.startsWith('inbox-thread:')) {
    state.threadId = focusId.replace('inbox-thread:', '');
  }
  saveState();
  renderShell();
  document.querySelector(`[data-inspector-focus="${CSS.escape(focusId)}"]`)?.focus({ preventScroll: true });
}

function renderTrustRail() {
  const policy = getPayload().egressPolicy || {};
  const statements = policy.safetyStatements || [];
  return `
    <section class="trust-rail" role="status" aria-live="polite" aria-label="Preview trust and safety state">
      <strong>Preview shell</strong>
      <span>Draft-only egress</span>
      <span>No provider connection</span>
      <span>Runtime undecided</span>
      <details>
        <summary>Trust details</summary>
        <ul>
          ${statements.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </details>
    </section>
  `;
}

function renderTopBar() {
  const workspace = getPayload().workspace || {};
  return `
    <header class="app-topbar" role="banner">
      <section class="brand-block" aria-label="Product identity">
        <p class="eyebrow">xi-io Inbox</p>
        <h1>Unified ingress operations</h1>
      </section>

      <section class="topbar-context trust-cluster" aria-label="Active workspace and trust state">
        <div class="trust-cluster-line">
          <span><strong>${escapeHtml(workspace.displayName || 'Preview workspace')}</strong></span>
          <span>${escapeHtml(workspace.activeAccount || 'Preview account')}</span>
        </div>
        <div class="trust-cluster-line" aria-label="Global trust tokens">
          ${renderTrustToken('provider gated', workspace.providerStatus || 'provider_blocked')}
          ${renderTrustToken('privacy local only', workspace.privacyMode || 'local_only')}
          ${renderTrustToken('ibal proposal only', workspace.ibalStatus || 'proposal_only')}
        </div>
      </section>

      <label class="command-box" aria-label="Search and command placeholder">
        <span>Search / command</span>
        <input type="search" placeholder="${escapeHtml(workspace.commandPlaceholder || 'Preview only')}" disabled />
      </label>

      ${renderTrustRail()}
    </header>
  `;
}

function renderNavigation() {
  return `
    <nav class="lane-nav" aria-label="Primary xi-io Inbox lanes">
      <p class="lane-nav-label">Lanes</p>
      ${getLanes().map((lane) => {
        const hint = laneNavHint(lane.status);
        return `
          <a class="lane-link ${lane.id === state.laneId ? 'is-active' : ''}" href="${escapeHtml(lane.route)}" aria-current="${lane.id === state.laneId ? 'page' : 'false'}">
            <span>${escapeHtml(lane.label)}</span>
            ${hint ? `<span class="lane-nav-hint">${escapeHtml(hint)}</span>` : ''}
          </a>
        `;
      }).join('')}
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

function inspectorFocusAttrs(id) {
  const focused = state.focusId === id;
  return `data-inspector-focus="${escapeHtml(id)}" class="is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" tabindex="0" aria-selected="${focused ? 'true' : 'false'}"`;
}

function renderPriorityStack(section) {
  const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
  return `
    <section class="lane-section priority-stack" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <ol class="ranked-list">
        ${(section.items || []).map((item, index) => {
          const focusId = `${state.laneId}:priority-stack:${sectionIndex}:${index}`;
          return `
            <li ${inspectorFocusAttrs(focusId)} role="option">
              <span class="rank-token">${escapeHtml(item.rank)}</span>
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.summary)}</p>
              </div>
            </li>
          `;
        }).join('')}
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
        <aside class="mailbox-panel" aria-label="Mailbox and account context">
          <h4>Accounts</h4>
          ${(section.accounts || []).map((account) => `
            <article class="account-gate-row">
              <strong>${escapeHtml(account.name)}</strong>
              <p>${escapeHtml(account.meta)}</p>
              <span class="account-gate-state">${escapeHtml(label(account.state || 'provider_blocked'))}</span>
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
        <div class="thread-list-panel" aria-label="Thread list">
          ${(section.threads || []).map((thread) => `
            <button class="thread-row ${selected?.id === thread.id ? 'is-selected' : ''}" type="button" data-thread-id="${escapeHtml(thread.id)}" data-inspector-focus="${escapeHtml(`inbox-thread:${thread.id}`)}" aria-pressed="${selected?.id === thread.id ? 'true' : 'false'}">
              <div class="thread-row-main">
                <div class="thread-row-top">
                  <strong class="thread-sender">${escapeHtml(thread.sender || thread.title)}</strong>
                  <time class="thread-time">${escapeHtml(thread.receivedAt || '')}</time>
                </div>
                <span class="thread-subject">${escapeHtml(thread.title)}</span>
                <p class="thread-snippet">${escapeHtml(thread.summary)}</p>
              </div>
              <div class="thread-row-meta">
                ${renderThreadStatusChip(thread.state || 'preview_only')}
                ${renderCompactLabelLine((thread.labels || []).slice(0, 2))}
              </div>
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
      <article class="selected-thread-hero">
        <header class="selected-thread-head">
          <div>
            <p class="selected-thread-eyebrow">${escapeHtml(thread.sender || 'Selected thread')}</p>
            <h3>${escapeHtml(thread.title || 'Selected thread preview')}</h3>
            <p>${escapeHtml(thread.summary || '')}</p>
          </div>
          ${renderThreadStatusChip(thread.state || 'needs_review')}
        </header>
        <dl class="thread-metadata-grid">
          ${(thread.fields || thread.detailFields || []).map((field) => `
            <div>
              <dt>${escapeHtml(field.label)}</dt>
              <dd>${escapeHtml(field.value)}</dd>
            </div>
          `).join('')}
        </dl>
        ${renderCompactLabelLine(thread.tags || [])}
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
            <header class="message-row-head">
              <div>
                <strong>${escapeHtml(message.from)}</strong>
                <small>${escapeHtml(message.meta)}</small>
              </div>
              <span class="message-state">${escapeHtml(label(message.state || 'preview_only'))}</span>
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
      <div class="inbox-evidence-grid">
        <article class="inbox-evidence-block">
          <header><strong>Evidence refs</strong><span>preview only</span></header>
          ${renderDetailList(evidence.map((item) => `${item.label}: ${item.summary}`))}
        </article>
        <article class="inbox-evidence-block is-blocked">
          <header><strong>Attachments</strong><span>provider blocked</span></header>
          ${renderDetailList(attachments.map((item) => `${item.label}: ${item.state}`))}
        </article>
      </div>
    </section>
  `;
}

function renderDraftEgress(section) {
  const thread = selectedInboxThread() || {};
  const draft = thread.draft || section.draft || {};
  const actions = section.blockedActions || getPayload().egressPolicy?.blockedActions || [];
  return `
    <section class="lane-section draft-egress-panel" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="inbox-draft-grid">
        <article class="draft-proposal-panel">
          <header>
            <strong>${escapeHtml(draft.title || 'Draft proposal')}</strong>
            <span class="draft-proposal-state">${escapeHtml(label(draft.state || 'draft_only'))}</span>
          </header>
          <p>${escapeHtml(draft.summary || '')}</p>
          ${renderDetailList(draft.details)}
        </article>
        ${renderEgressPolicyModule(actions)}
      </div>
    </section>
  `;
}

function renderAgenda(section) {
  const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
  return `
    <section class="lane-section agenda-preview" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="calendar-agenda-rail">
        ${(section.items || []).map((item, index) => {
          const focusId = `${state.laneId}:agenda:${sectionIndex}:${index}`;
          return `
            <article class="calendar-agenda-row is-inspector-focusable ${state.focusId === focusId ? 'is-inspector-focused' : ''}" data-inspector-focus="${escapeHtml(focusId)}" tabindex="0" aria-selected="${state.focusId === focusId ? 'true' : 'false'}">
              <time>${escapeHtml(item.time)}</time>
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.summary)}</p>
                ${item.tags?.length ? `<span class="calendar-source-line">${item.tags.map((tag) => escapeHtml(label(tag))).join(' · ')}</span>` : ''}
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderProposalList(section) {
  const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
  return `
    <section class="lane-section proposal-list" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="calendar-proposal-list">
        ${(section.items || []).map((item, index) => {
          const focusId = `${state.laneId}:calendar-proposals:${sectionIndex}:${index}`;
          const focused = state.focusId === focusId;
          return `
            <button class="calendar-proposal-row is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(focusId)}" aria-selected="${focused ? 'true' : 'false'}">
              <div>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.summary)}</p>
              </div>
              <div class="calendar-proposal-meta">
                <span>${escapeHtml(item.meta || 'source pending')}</span>
                <em>${escapeHtml(label(item.state || 'proposal_only'))}</em>
              </div>
            </button>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderConflictPanel(section) {
  const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
  return `
    <section class="lane-section conflict-panel" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="calendar-conflict-list">
        ${(section.items || []).map((item, index) => {
          const focusId = `${state.laneId}:conflict-panel:${sectionIndex}:${index}`;
          const focused = state.focusId === focusId;
          return `
            <button class="calendar-conflict-row is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(focusId)}" aria-selected="${focused ? 'true' : 'false'}">
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.summary)}</p>
              <span>${escapeHtml(label(item.state || 'preview_only'))}</span>
            </button>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderTaskBoard(section) {
  return `
    <section class="lane-section task-board" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="task-kanban-board">
        ${(section.columns || []).map((column) => `
          <section class="task-kanban-column">
            <header>
              <strong>${escapeHtml(column.label)}</strong>
              <span>${escapeHtml(label(column.state || 'preview_only'))}</span>
            </header>
            ${(column.items || []).map((item, index) => {
              const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
              const columnIndex = (section.columns || []).findIndex((entry) => entry === column);
              const focusId = `${state.laneId}:task-board:${sectionIndex}:${columnIndex}-${index}`;
              const focused = state.focusId === focusId;
              return `
                <button class="task-kanban-card is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(focusId)}" aria-selected="${focused ? 'true' : 'false'}">
                  <strong>${escapeHtml(item.title)}</strong>
                  <p>${escapeHtml(item.summary)}</p>
                  ${item.meta ? `<span class="task-source-line">${escapeHtml(item.meta)}</span>` : ''}
                </button>
              `;
            }).join('')}
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
      <div class="task-source-list">
        ${(section.links || []).map((linkItem, index) => {
          const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
          const focusId = `${state.laneId}:task-links:${sectionIndex}:${index}`;
          const focused = state.focusId === focusId;
          return `
            <button class="task-source-row is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(focusId)}" aria-selected="${focused ? 'true' : 'false'}">
              <span class="task-source-lane">${escapeHtml(linkItem.source)}</span>
              <div>
                <strong>${escapeHtml(linkItem.title)}</strong>
                <p>${escapeHtml(linkItem.summary)}</p>
              </div>
              <em>${escapeHtml(label(linkItem.state || 'preview_only'))}</em>
            </button>
          `;
        }).join('')}
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
  const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
  return `
    <section class="lane-section receipt-ledger" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="receipt-ledger-table" role="table" aria-label="${escapeHtml(section.title)}">
        <div class="receipt-ledger-head" role="row">
          <span role="columnheader">Type</span>
          <span role="columnheader">Entry</span>
          <span role="columnheader">Source</span>
          <span role="columnheader">State</span>
        </div>
        ${(section.rows || []).map((row, index) => {
          const focusId = `${state.laneId}:receipt-ledger:${sectionIndex}:${index}`;
          const focused = state.focusId === focusId;
          return `
            <button class="receipt-ledger-row is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" type="button" role="row" data-inspector-focus="${escapeHtml(focusId)}" aria-selected="${focused ? 'true' : 'false'}">
              <span class="receipt-kind receipt-kind-${escapeHtml(row.kind || 'proof')}" role="cell">${escapeHtml(row.kind)}</span>
              <strong role="cell">${escapeHtml(row.title)}</strong>
              <span role="cell">${escapeHtml(row.source)}</span>
              <span class="receipt-state" role="cell">${escapeHtml(label(row.state || 'preview_only'))}</span>
            </button>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderReceiptGroups(section) {
  return `
    <section class="lane-section receipt-groups" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="receipt-class-list">
        ${(section.groups || []).map((group) => `
          <article class="receipt-class-row">
            <div>
              <strong>${escapeHtml(group.label)}</strong>
              <p>${escapeHtml(group.summary)}</p>
            </div>
            <span class="receipt-class-state">${escapeHtml(label(group.state || 'preview_only'))}</span>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderIbalBoard(section) {
  const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
  return `
    <section class="lane-section ibal-board" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="ibal-conductor-grid">
        ${(section.groups || []).map((group, groupIndex) => `
          <section class="ibal-conductor-group">
            <header>
              <h4>${escapeHtml(group.label)}</h4>
              <span>${escapeHtml(label(group.state || 'proposal_only'))}</span>
            </header>
            <div class="ibal-recommendation-list">
              ${(group.items || []).map((item, index) => {
                const focusId = `${state.laneId}:ibal-board:${sectionIndex}:${groupIndex}-${index}`;
                const focused = state.focusId === focusId;
                return `
                  <button class="ibal-recommendation is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(focusId)}" aria-selected="${focused ? 'true' : 'false'}">
                    <strong>${escapeHtml(item.title)}</strong>
                    <p>${escapeHtml(item.summary)}</p>
                    <span class="ibal-recommendation-state">${escapeHtml(label(item.state || 'proposal_only'))}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </section>
        `).join('')}
      </div>
    </section>
  `;
}

function renderIbalChanges(section) {
  return `
    <section class="lane-section ibal-changes" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <article class="ibal-synthesis-panel">
        <header>
          <strong>${escapeHtml(section.summaryTitle)}</strong>
          <span>proposal only</span>
        </header>
        <p>${escapeHtml(section.summary)}</p>
        <ul class="ibal-change-list">
          ${(section.changes || []).map((change) => `<li>${escapeHtml(change)}</li>`).join('')}
        </ul>
      </article>
    </section>
  `;
}

function renderSettingsGates(section) {
  const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
  return `
    <section class="lane-section settings-gates" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="policy-gate-list">
        ${(section.gates || []).map((gate, index) => {
          const focusId = `${state.laneId}:settings-gates:${sectionIndex}:${index}`;
          const focused = state.focusId === focusId;
          return `
            <button class="policy-gate-row is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(focusId)}" aria-selected="${focused ? 'true' : 'false'}">
              <div class="policy-gate-copy">
                <strong>${escapeHtml(gate.label)}</strong>
                <p>${escapeHtml(gate.summary)}</p>
              </div>
              <div class="policy-gate-meta">
                <span class="policy-gate-control">${escapeHtml(gate.control)}</span>
                <span class="policy-gate-state">${escapeHtml(label(gate.state || 'runtime_blocked'))}</span>
              </div>
            </button>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderPolicyList(section) {
  const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
  return `
    <section class="lane-section policy-list" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="policy-default-table">
        <div class="policy-default-head">
          <span>Policy</span><span>Value</span><span>Reason</span>
        </div>
        ${(section.policies || []).map((policy, index) => {
          const focusId = `${state.laneId}:policy-list:${sectionIndex}:${index}`;
          const focused = state.focusId === focusId;
          return `
            <button class="policy-default-row is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(focusId)}" aria-selected="${focused ? 'true' : 'false'}">
              <span>${escapeHtml(policy.label)}</span>
              <strong>${escapeHtml(policy.value)}</strong>
              <span>${escapeHtml(policy.summary)}</span>
            </button>
          `;
        }).join('')}
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
        <div class="lane-status-line">
          <span>${escapeHtml(label(content.proofState || lane.status || 'preview_only'))}</span>
          <span>${escapeHtml(label(lane.status || 'preview_only'))}</span>
        </div>
      </header>

      <section class="metric-grid" aria-label="${escapeHtml(lane.label)} preview metrics">
        ${(content.metrics || content.primary || []).map(renderMetricCard).join('')}
      </section>

      <div class="lane-content ${escapeHtml(content.layout || `${lane.id}-layout`)}${lane.id === 'inbox' ? ' is-inbox-lane' : ''}${lane.id === 'receipts' ? ' is-receipts-lane' : ''}${lane.id === 'ibal' ? ' is-ibal-lane' : ''}${lane.id === 'settings' ? ' is-settings-lane' : ''}${lane.id === 'calendar' ? ' is-calendar-lane' : ''}${lane.id === 'tasks' ? ' is-tasks-lane' : ''}">
        ${(content.sections || []).map(renderLaneSection).join('')}
      </div>
    </main>
  `;
}

function renderInspectorBlock(title, body, listItems = []) {
  return `
    <section class="inspector-block">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body)}</p>
      ${listItems.length ? `<ul>${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
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

function activeInspectorModel() {
  const focusItem = activeInspectableItem();
  const laneInspector = activeLaneContent().inspector || getPayload().inspector || {};
  const focusInspector = focusItem?.inspector || {};

  if (focusItem?.id?.startsWith('inbox-thread:') && focusInspector.context) {
    return {
      kind: focusItem.kind,
      title: focusItem.title,
      summary: focusItem.summary,
      context: focusInspector.context,
      why: focusItem.summary,
      evidence: focusInspector.evidence,
      safeNext: focusItem.safeNext,
      blocked: focusInspector.egressState || focusItem.blocked,
      ibalProposal: focusInspector.ibalProposal,
      receipts: focusInspector.receipts || focusItem.receipt,
    };
  }

  if (focusItem && focusItem.id !== `lane:${state.laneId}`) {
    return {
      kind: focusItem.kind,
      title: focusItem.title,
      summary: focusItem.summary,
      context: `${label(focusItem.kind)} selected in ${activeLane().label}. Fixture metadata only.`,
      why: focusItem.summary || laneInspector.context,
      evidence: focusItem.meta ? `Source/meta: ${focusItem.meta}` : laneInspector.evidence,
      safeNext: focusItem.safeNext || laneInspector.ibalProposal,
      blocked: focusItem.blocked || laneInspector.egressState,
      ibalProposal: laneInspector.ibalProposal,
      receipts: focusItem.receipt || laneInspector.receipts,
    };
  }

  return {
    kind: 'lane',
    title: activeLaneContent().title || activeLane().label,
    summary: activeLaneContent().summary || activeLane().description,
    context: laneInspector.context,
    why: activeLaneContent().summary || activeLane().description,
    evidence: laneInspector.evidence,
    safeNext: laneInspector.ibalProposal,
    blocked: laneInspector.egressState,
    ibalProposal: laneInspector.ibalProposal,
    receipts: laneInspector.receipts,
  };
}

function renderInspector() {
  const lane = activeLane();
  const inspector = activeInspectorModel();
  return `
    <aside class="right-inspector" aria-label="Selected object intelligence">
      <header class="inspector-title">
        <p class="inspector-object-kind">${escapeHtml(inspector.kind || 'lane')}</p>
        <h2 class="inspector-selected-title">${escapeHtml(inspector.title || lane.label)}</h2>
        <p>${escapeHtml(inspector.summary || '')}</p>
      </header>
      ${renderInspectorBlock('What is selected', inspector.context || 'Lane-level context only. No provider record is loaded.')}
      ${renderInspectorBlock('Why it matters', inspector.why || 'Context helps determine the next safe action without runtime writes.')}
      ${renderInspectorBlock('Evidence', inspector.evidence || 'Evidence references remain preview-only until provider gates are decided.')}
      ${renderInspectorBlock('Safe next action', inspector.safeNext || 'Review fixture context and keep actions in draft or proposal mode.')}
      <section class="inspector-block">
        <h3>Blocked actions</h3>
        <p>${escapeHtml(inspector.blocked || 'Draft creation may be previewed. Send, forward, delete, disclose, publish, deploy, and provider mutation remain blocked.')}</p>
        ${renderDisabledActions()}
      </section>
      ${renderInspectorBlock('Ibal proposal', inspector.ibalProposal || 'Ibal proposes only in this preview and cannot execute actions.')}
      ${renderInspectorBlock('Receipt expectation', inspector.receipts || 'Receipts are first-class audit placeholders. No confirmed runtime action exists.')}
    </aside>
  `;
}

function renderShell() {
  const mount = document.getElementById('inboxPreviewMount');
  if (!mount) return;

  mount.innerHTML = `
    <section class="app-shell" aria-label="xi-io Inbox unified app shell">
      ${renderTopBar()}
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
    const focusTarget = event.target.closest?.('[data-inspector-focus]');
    if (focusTarget?.dataset.inspectorFocus) {
      selectInspectorFocus(focusTarget.dataset.inspectorFocus);
      return;
    }

    const threadButton = event.target.closest?.('[data-thread-id]');
    if (!threadButton) return;
    selectInboxThread(threadButton.dataset.threadId);
  });

  document.addEventListener('keydown', (event) => {
    const focusTarget = event.target.closest?.('[data-inspector-focus]');
    if (!focusTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectInspectorFocus(focusTarget.dataset.inspectorFocus);
    }
  });
}

async function init() {
  loadState();
  state.payload = await fetchJson(DATA_URL, {});
  state.threadId = selectedInboxThread()?.id || state.threadId;
  state.focusId = state.focusId || defaultFocusIdForLane(state.laneId);
  ensureRoute();
  syncRoute();
  renderShell();
}

bindEvents();
init();

window.xiioInboxPreview = { state, renderShell, init };
