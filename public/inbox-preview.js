const DATA_URL = './data/inbox-events.preview.json';
const STORAGE_KEY = 'xiioInbox.preview.state';
const MIGRATION_UI005B_KEY = 'xiioInbox.preview.ui005b';
const LEGACY_STORAGE_KEY = 'xiio-inbox-preview-state-v2';
const STORAGE_SCHEMA_VERSION = 2;

const ROUTE_PREFIX = '#/';
const DEFAULT_LANE = 'home';

const state = {
  payload: null,
  laneId: DEFAULT_LANE,
  threadId: null,
  focusId: null,
  statusMessage: '',
  inbox: defaultInboxOps(),
  calendar: defaultCalendarOps(),
  tasks: defaultTasksOps(),
  automations: defaultAutomationsOps(),
  extensions: defaultExtensionsOps(),
};

const TASK_STATUSES = ['proposed', 'active', 'deferred', 'reviewed', 'done-preview'];

function defaultInboxOps() {
  return {
    composeDraft: null,
    replyDrafts: {},
    triage: {},
    proposals: [],
    receipts: [],
  };
}

function defaultCalendarOps() {
  return {
    selectedProposalId: null,
    proposals: [],
    receipts: [],
  };
}

function defaultTasksOps() {
  return {
    selectedTaskId: null,
    tasks: [],
    receipts: [],
  };
}

function defaultAutomationsOps() {
  return {
    selectedRuleId: null,
    rules: [],
    receipts: [],
    lastDryRun: null,
  };
}

function defaultExtensionsOps() {
  return {
    selectedInstallId: null,
    installs: [],
    receipts: [],
  };
}

function previewStateEnvelope() {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    laneId: state.laneId,
    threadId: state.threadId,
    focusId: state.focusId,
    inbox: state.inbox,
    calendar: state.calendar,
    tasks: state.tasks,
    automations: state.automations,
    extensions: state.extensions,
  };
}

function applyPreviewEnvelope(stored) {
  if (stored.laneId) state.laneId = stored.laneId;
  if (stored.threadId) state.threadId = stored.threadId;
  if (stored.focusId) state.focusId = stored.focusId;
  state.inbox = {
    ...defaultInboxOps(),
    ...(stored.inbox || {}),
    replyDrafts: stored.inbox?.replyDrafts || {},
    triage: stored.inbox?.triage || {},
    proposals: stored.inbox?.proposals || [],
    receipts: stored.inbox?.receipts || [],
  };
  state.calendar = {
    ...defaultCalendarOps(),
    ...(stored.calendar || {}),
    proposals: stored.calendar?.proposals || [],
    receipts: stored.calendar?.receipts || [],
  };
  state.tasks = {
    ...defaultTasksOps(),
    ...(stored.tasks || {}),
    tasks: stored.tasks?.tasks || [],
    receipts: stored.tasks?.receipts || [],
  };
  state.automations = {
    ...defaultAutomationsOps(),
    ...(stored.automations || {}),
    rules: stored.automations?.rules || [],
    receipts: stored.automations?.receipts || [],
    lastDryRun: stored.automations?.lastDryRun || null,
  };
  state.extensions = {
    ...defaultExtensionsOps(),
    ...(stored.extensions || {}),
    installs: stored.extensions?.installs || [],
    receipts: stored.extensions?.receipts || [],
  };
  syncInboxCalendarProposals();
  syncInboxTaskProposals();
}

function migratePreviewStorage() {
  const canonical = safeParse(localStorage.getItem(STORAGE_KEY) || 'null', null);
  if (canonical?.schemaVersion === STORAGE_SCHEMA_VERSION) return canonical;

  const ui005b = safeParse(localStorage.getItem(MIGRATION_UI005B_KEY) || 'null', null);
  if (ui005b) {
    return {
      schemaVersion: STORAGE_SCHEMA_VERSION,
      laneId: ui005b.laneId,
      threadId: ui005b.threadId,
      focusId: ui005b.focusId,
      inbox: ui005b.inbox || defaultInboxOps(),
      calendar: defaultCalendarOps(),
      tasks: defaultTasksOps(),
      automations: defaultAutomationsOps(),
      extensions: defaultExtensionsOps(),
    };
  }

  const legacy = safeParse(localStorage.getItem(LEGACY_STORAGE_KEY) || '{}', {});
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    laneId: legacy.laneId,
    threadId: legacy.threadId,
    focusId: legacy.focusId,
    inbox: defaultInboxOps(),
    calendar: defaultCalendarOps(),
    tasks: defaultTasksOps(),
    automations: defaultAutomationsOps(),
    extensions: defaultExtensionsOps(),
  };
}

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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(previewStateEnvelope()));
}

function loadState() {
  const stored = migratePreviewStorage();
  applyPreviewEnvelope(stored);
  saveState();
}

function setStatusMessage(message, laneId = state.laneId) {
  state.statusMessage = message;
  const regionId = {
    calendar: 'calendarStatusRegion',
    tasks: 'tasksStatusRegion',
    automations: 'automationsStatusRegion',
    extensions: 'extensionsStatusRegion',
    inbox: 'inboxStatusRegion',
  }[laneId] || 'inboxStatusRegion';
  const region = document.getElementById(regionId);
  if (region) region.textContent = message;
}

function syncInboxCalendarProposals() {
  const inboxCalendar = (state.inbox.proposals || []).filter((entry) => entry.type === 'calendar');
  const existing = new Set((state.calendar.proposals || []).map((entry) => entry.id));
  inboxCalendar.forEach((proposal) => {
    if (existing.has(proposal.id)) return;
    state.calendar.proposals = [{
      id: proposal.id,
      title: proposal.title,
      dateTime: proposal.dateTime || '',
      notes: proposal.summary || '',
      sourceRef: proposal.threadId ? `inbox-thread:${proposal.threadId}` : '',
      sourceType: 'inbox_local',
      threadId: proposal.threadId || null,
      createdAt: proposal.createdAt,
      updatedAt: proposal.createdAt,
      state: 'local_preview_proposal',
    }, ...state.calendar.proposals];
  });
}

function allCalendarProposals() {
  syncInboxCalendarProposals();
  return state.calendar.proposals || [];
}

function selectedCalendarProposal() {
  const proposals = allCalendarProposals();
  return proposals.find((entry) => entry.id === state.calendar.selectedProposalId) || proposals[0] || null;
}

function addCalendarReceipt({ type, title, proposalId, summary }) {
  const receipt = {
    id: createLocalId('receipt'),
    type,
    title,
    proposalId: proposalId || null,
    summary,
    createdAt: new Date().toISOString(),
    limitations: 'Local preview only. No provider calendar write, send, or runtime action occurred.',
  };
  state.calendar.receipts = [receipt, ...(state.calendar.receipts || [])].slice(0, 20);
  return receipt;
}

function saveCalendarProposal(formData, proposalId) {
  const payload = {
    title: String(formData.get('title') || '').trim(),
    dateTime: String(formData.get('dateTime') || '').trim(),
    notes: String(formData.get('notes') || '').trim(),
    sourceRef: String(formData.get('sourceRef') || '').trim(),
    sourceType: String(formData.get('sourceType') || 'calendar_local').trim(),
    threadId: String(formData.get('threadId') || '').trim() || null,
    state: 'local_preview_proposal',
  };
  const now = new Date().toISOString();
  if (proposalId) {
    state.calendar.proposals = (state.calendar.proposals || []).map((entry) => (
      entry.id === proposalId ? { ...entry, ...payload, updatedAt: now } : entry
    ));
    addCalendarReceipt({
      type: 'proposal',
      title: 'Local calendar proposal updated',
      proposalId,
      summary: payload.title || '(untitled)',
    });
    state.calendar.selectedProposalId = proposalId;
    setStatusMessage('Local calendar proposal updated. Provider calendar write remains blocked.', 'calendar');
  } else {
    const id = createLocalId('calendar');
    const proposal = { id, ...payload, createdAt: now, updatedAt: now };
    state.calendar.proposals = [proposal, ...(state.calendar.proposals || [])];
    addCalendarReceipt({
      type: 'proposal',
      title: 'Local calendar proposal created',
      proposalId: id,
      summary: payload.title || '(untitled)',
    });
    state.calendar.selectedProposalId = id;
    state.focusId = `calendar:local:${id}`;
    setStatusMessage('Local calendar proposal created. Provider calendar write remains blocked.', 'calendar');
  }
  saveState();
}

function clearCalendarProposal(proposalId) {
  if (!proposalId) return;
  state.calendar.proposals = (state.calendar.proposals || []).filter((entry) => entry.id !== proposalId);
  if (state.calendar.selectedProposalId === proposalId) {
    state.calendar.selectedProposalId = state.calendar.proposals[0]?.id || null;
  }
  saveState();
  setStatusMessage('Local calendar proposal cleared.', 'calendar');
}

function clearCalendarPreviewState() {
  state.calendar = defaultCalendarOps();
  saveState();
  setStatusMessage('All local Calendar preview state cleared. Fixture agenda unchanged.', 'calendar');
}

function syncInboxTaskProposals() {
  const inboxTasks = (state.inbox.proposals || []).filter((entry) => entry.type === 'task');
  const existing = new Set((state.tasks.tasks || []).map((entry) => entry.id));
  inboxTasks.forEach((proposal) => {
    if (existing.has(proposal.id)) return;
    state.tasks.tasks = [{
      id: proposal.id,
      title: proposal.title,
      status: 'proposed',
      dueDate: '',
      notes: proposal.summary || '',
      sourceRef: proposal.threadId ? `inbox-thread:${proposal.threadId}` : '',
      sourceType: 'inbox_local',
      threadId: proposal.threadId || null,
      calendarId: null,
      createdAt: proposal.createdAt,
      updatedAt: proposal.createdAt,
      state: 'local_preview_task',
    }, ...(state.tasks.tasks || [])];
  });
}

function allLocalTasks() {
  syncInboxTaskProposals();
  return state.tasks.tasks || [];
}

function selectedLocalTask() {
  const tasks = allLocalTasks();
  return tasks.find((entry) => entry.id === state.tasks.selectedTaskId) || tasks[0] || null;
}

function addTaskReceipt({ type, title, taskId, summary }) {
  const receipt = {
    id: createLocalId('receipt'),
    type,
    title,
    taskId: taskId || null,
    summary,
    createdAt: new Date().toISOString(),
    limitations: 'Local preview only. No provider task write, send, calendar write, or runtime action occurred.',
  };
  state.tasks.receipts = [receipt, ...(state.tasks.receipts || [])].slice(0, 20);
  return receipt;
}

function saveLocalTask(formData, taskId) {
  const payload = {
    title: String(formData.get('title') || '').trim(),
    status: String(formData.get('status') || 'proposed').trim(),
    dueDate: String(formData.get('dueDate') || '').trim(),
    notes: String(formData.get('notes') || '').trim(),
    sourceRef: String(formData.get('sourceRef') || '').trim(),
    sourceType: String(formData.get('sourceType') || 'tasks_local').trim(),
    threadId: String(formData.get('threadId') || '').trim() || null,
    calendarId: String(formData.get('calendarId') || '').trim() || null,
    state: 'local_preview_task',
  };
  const now = new Date().toISOString();
  if (taskId) {
    state.tasks.tasks = (state.tasks.tasks || []).map((entry) => (
      entry.id === taskId ? { ...entry, ...payload, updatedAt: now } : entry
    ));
    addTaskReceipt({
      type: 'task',
      title: 'Local task updated',
      taskId,
      summary: `${payload.title || '(untitled)'} · status ${label(payload.status)}`,
    });
    state.tasks.selectedTaskId = taskId;
    setStatusMessage(`Local task updated (${label(payload.status)}). Provider task write remains blocked.`, 'tasks');
  } else {
    const id = createLocalId('task');
    const task = { id, ...payload, createdAt: now, updatedAt: now };
    state.tasks.tasks = [task, ...(state.tasks.tasks || [])];
    addTaskReceipt({
      type: 'task',
      title: 'Local task created',
      taskId: id,
      summary: payload.title || '(untitled)',
    });
    state.tasks.selectedTaskId = id;
    state.focusId = `tasks:local:${id}`;
    setStatusMessage('Local task created. Provider task write remains blocked.', 'tasks');
  }
  saveState();
}

function changeTaskStatus(taskId, status) {
  if (!taskId || !TASK_STATUSES.includes(status)) return;
  state.tasks.tasks = (state.tasks.tasks || []).map((entry) => (
    entry.id === taskId ? { ...entry, status, updatedAt: new Date().toISOString() } : entry
  ));
  addTaskReceipt({
    type: 'status',
    title: 'Local task status changed',
    taskId,
    summary: `Status set to ${label(status)} (preview only).`,
  });
  state.tasks.selectedTaskId = taskId;
  saveState();
  setStatusMessage(`Task status changed to ${label(status)} locally.`, 'tasks');
}

function clearLocalTask(taskId) {
  if (!taskId) return;
  state.tasks.tasks = (state.tasks.tasks || []).filter((entry) => entry.id !== taskId);
  if (state.tasks.selectedTaskId === taskId) {
    state.tasks.selectedTaskId = state.tasks.tasks[0]?.id || null;
  }
  saveState();
  setStatusMessage('Local task cleared.', 'tasks');
}

function clearTasksPreviewState() {
  state.tasks = defaultTasksOps();
  saveState();
  setStatusMessage('All local Tasks preview state cleared. Fixture board unchanged.', 'tasks');
}

function allLocalAutomationRules() {
  return state.automations.rules || [];
}

function selectedAutomationRule() {
  const rules = allLocalAutomationRules();
  return rules.find((entry) => entry.id === state.automations.selectedRuleId) || rules[0] || null;
}

function addAutomationReceipt({ type, title, ruleId, summary }) {
  const receipt = {
    id: createLocalId('receipt'),
    type,
    title,
    ruleId: ruleId || null,
    summary,
    createdAt: new Date().toISOString(),
    limitations: 'Local preview only. No automation execution, provider write, or runtime action occurred.',
  };
  state.automations.receipts = [receipt, ...(state.automations.receipts || [])].slice(0, 20);
  return receipt;
}

function saveLocalAutomationRule(formData, ruleId) {
  const payload = {
    title: String(formData.get('title') || '').trim(),
    trigger: String(formData.get('trigger') || '').trim(),
    condition: String(formData.get('condition') || '').trim(),
    proposal: String(formData.get('proposal') || '').trim(),
    gate: String(formData.get('gate') || '').trim(),
    state: 'dry_run_only',
    enabled: false,
  };
  const now = new Date().toISOString();
  if (ruleId) {
    state.automations.rules = (state.automations.rules || []).map((entry) => (
      entry.id === ruleId ? { ...entry, ...payload, updatedAt: now } : entry
    ));
    addAutomationReceipt({ type: 'rule', title: 'Local automation rule updated', ruleId, summary: payload.title || '(untitled)' });
    state.automations.selectedRuleId = ruleId;
    setStatusMessage('Local automation rule updated. Execution remains blocked.', 'automations');
  } else {
    const id = createLocalId('auto');
    const rule = { id, ...payload, createdAt: now, updatedAt: now };
    state.automations.rules = [rule, ...(state.automations.rules || [])];
    addAutomationReceipt({ type: 'rule', title: 'Local automation rule created', ruleId: id, summary: payload.title || '(untitled)' });
    state.automations.selectedRuleId = id;
    state.focusId = `automations:local:${id}`;
    setStatusMessage('Local automation rule created. Execution remains blocked.', 'automations');
  }
  saveState();
}

function runAutomationDryRun(ruleId) {
  const rule = allLocalAutomationRules().find((entry) => entry.id === ruleId);
  if (!rule) return;
  state.automations.lastDryRun = {
    ruleId,
    ranAt: new Date().toISOString(),
    steps: [
      { title: 'Trigger matched (simulated)', summary: rule.trigger || 'No trigger text', state: 'dry_run_only' },
      { title: 'Condition evaluated (simulated)', summary: rule.condition || 'No condition text', state: 'preview_only' },
      { title: 'Proposal prepared (not executed)', summary: rule.proposal || 'No proposal text', state: 'proposal_only' },
      { title: 'Approval gate required', summary: rule.gate || 'Human approval required before any runtime enablement', state: 'blocked' },
      { title: 'Execution blocked', summary: 'Automation execution, provider mutation, and repo writes remain disabled in Tier 1 preview.', state: 'action_blocked' },
    ],
  };
  addAutomationReceipt({
    type: 'dry-run',
    title: 'Automation dry-run simulated',
    ruleId,
    summary: `Dry-run for ${rule.title}. Execution not enabled.`,
  });
  state.automations.selectedRuleId = ruleId;
  state.focusId = `automations:local:${ruleId}`;
  saveState();
  setStatusMessage('Dry-run complete. Rule not enabled; execution blocked.', 'automations');
}

function clearLocalAutomationRule(ruleId) {
  if (!ruleId) return;
  state.automations.rules = (state.automations.rules || []).filter((entry) => entry.id !== ruleId);
  if (state.automations.selectedRuleId === ruleId) {
    state.automations.selectedRuleId = state.automations.rules[0]?.id || null;
    if (state.automations.lastDryRun?.ruleId === ruleId) state.automations.lastDryRun = null;
  }
  saveState();
  setStatusMessage('Local automation rule cleared.', 'automations');
}

function clearAutomationsPreviewState() {
  state.automations = defaultAutomationsOps();
  saveState();
  setStatusMessage('All local Automations preview state cleared. Fixture templates unchanged.', 'automations');
}

function extensionFixtures() {
  const extensions = getPayload().laneContent?.extensions || {};
  const section = sectionByType(extensions, 'extension-matrix');
  return (section?.providers || []).map((provider, index) => ({
    ...provider,
    fixtureId: `ext-fixture:${index}`,
  }));
}

function allExtensionInstalls() {
  return state.extensions.installs || [];
}

function selectedExtensionInstall() {
  const installs = allExtensionInstalls();
  return installs.find((entry) => entry.id === state.extensions.selectedInstallId) || installs[0] || null;
}

function installForFixture(fixtureId) {
  return allExtensionInstalls().find((entry) => entry.fixtureId === fixtureId) || null;
}

function addExtensionReceipt({ type, title, installId, summary }) {
  const receipt = {
    id: createLocalId('receipt'),
    type,
    title,
    installId: installId || null,
    summary,
    createdAt: new Date().toISOString(),
    limitations: 'Local preview only. No OAuth, credentials, provider connection, or runtime write occurred.',
  };
  state.extensions.receipts = [receipt, ...(state.extensions.receipts || [])].slice(0, 20);
  return receipt;
}

function previewInstallExtension(fixtureId) {
  const fixture = extensionFixtures().find((entry) => entry.fixtureId === fixtureId);
  if (!fixture || installForFixture(fixtureId)) return;
  const id = createLocalId('ext');
  const now = new Date().toISOString();
  const install = {
    id,
    fixtureId,
    label: fixture.label,
    permissions: fixture.permissions,
    provisionNotes: '',
    state: 'preview_installed',
    installedAt: now,
    updatedAt: now,
  };
  state.extensions.installs = [install, ...(state.extensions.installs || [])];
  state.extensions.selectedInstallId = id;
  state.focusId = `extensions:local:${id}`;
  addExtensionReceipt({
    type: 'install',
    title: 'Local preview install recorded',
    installId: id,
    summary: `${fixture.label} — preview only, not connected.`,
  });
  saveState();
  setStatusMessage(`Preview install recorded for ${fixture.label}. No provider connection.`, 'extensions');
}

function removeExtensionInstall(installId) {
  if (!installId) return;
  const install = allExtensionInstalls().find((entry) => entry.id === installId);
  state.extensions.installs = (state.extensions.installs || []).filter((entry) => entry.id !== installId);
  if (state.extensions.selectedInstallId === installId) {
    state.extensions.selectedInstallId = state.extensions.installs[0]?.id || null;
  }
  addExtensionReceipt({
    type: 'remove',
    title: 'Local preview install removed',
    installId,
    summary: install ? `${install.label} removed from preview state.` : 'Install removed.',
  });
  saveState();
  setStatusMessage('Local preview install removed. Provider remains disconnected.', 'extensions');
}

function saveExtensionProvision(formData, installId) {
  if (!installId) return;
  const notes = String(formData.get('provisionNotes') || '').trim();
  state.extensions.installs = (state.extensions.installs || []).map((entry) => (
    entry.id === installId
      ? { ...entry, provisionNotes: notes, updatedAt: new Date().toISOString() }
      : entry
  ));
  addExtensionReceipt({
    type: 'provision',
    title: 'Local provision notes updated',
    installId,
    summary: notes || '(empty notes)',
  });
  state.extensions.selectedInstallId = installId;
  saveState();
  setStatusMessage('Local provision notes saved. No credentials stored.', 'extensions');
}

function clearExtensionsPreviewState() {
  state.extensions = defaultExtensionsOps();
  saveState();
  setStatusMessage('All local Extensions preview state cleared. Fixture providers unchanged.', 'extensions');
}

function inboxTriageFor(threadId) {
  return state.inbox.triage[threadId] || { reviewed: false, deferred: false };
}

function replyDraftFor(threadId) {
  return state.inbox.replyDrafts[threadId] || null;
}

function localReceiptsForThread(threadId) {
  return (state.inbox.receipts || []).filter((receipt) => !threadId || receipt.threadId === threadId);
}

function localProposalsForThread(threadId) {
  return (state.inbox.proposals || []).filter((proposal) => proposal.threadId === threadId);
}

function createLocalId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function addLocalReceipt({ type, title, threadId, summary }) {
  const receipt = {
    id: createLocalId('receipt'),
    type,
    title,
    threadId: threadId || null,
    summary,
    createdAt: new Date().toISOString(),
    limitations: 'Local preview only. No provider write, send, forward, delete, archive, or runtime action occurred.',
  };
  state.inbox.receipts = [receipt, ...(state.inbox.receipts || [])].slice(0, 20);
  return receipt;
}

function saveComposeDraft(formData) {
  state.inbox.composeDraft = {
    to: String(formData.get('to') || '').trim(),
    subject: String(formData.get('subject') || '').trim(),
    body: String(formData.get('body') || '').trim(),
    savedAt: new Date().toISOString(),
    state: 'local_preview_draft',
  };
  addLocalReceipt({
    type: 'draft',
    title: 'Local compose draft saved',
    threadId: null,
    summary: `Subject: ${state.inbox.composeDraft.subject || '(none)'}. Preview draft only.`,
  });
  saveState();
  setStatusMessage('Local compose draft saved. Send remains blocked.');
}

function clearComposeDraft() {
  state.inbox.composeDraft = null;
  saveState();
  setStatusMessage('Compose draft cleared.');
}

function saveReplyDraft(threadId, formData) {
  if (!threadId) return;
  state.inbox.replyDrafts[threadId] = {
    to: String(formData.get('to') || '').trim(),
    subject: String(formData.get('subject') || '').trim(),
    body: String(formData.get('body') || '').trim(),
    savedAt: new Date().toISOString(),
    state: 'local_preview_draft',
  };
  addLocalReceipt({
    type: 'draft',
    title: 'Local reply draft saved',
    threadId,
    summary: `Reply draft for fixture thread ${threadId}. Not sent.`,
  });
  saveState();
  setStatusMessage('Local reply draft saved. Send remains blocked.');
}

function clearReplyDraft(threadId) {
  if (!threadId) return;
  delete state.inbox.replyDrafts[threadId];
  saveState();
  setStatusMessage('Reply draft cleared for selected thread.');
}

function markThreadReviewed(threadId) {
  if (!threadId) return;
  state.inbox.triage[threadId] = {
    ...inboxTriageFor(threadId),
    reviewed: true,
    deferred: false,
    reviewedAt: new Date().toISOString(),
  };
  addLocalReceipt({
    type: 'triage',
    title: 'Thread marked reviewed locally',
    threadId,
    summary: 'Local triage only. No provider sync or archive occurred.',
  });
  saveState();
  setStatusMessage('Thread marked reviewed locally.');
}

function deferThread(threadId) {
  if (!threadId) return;
  state.inbox.triage[threadId] = {
    ...inboxTriageFor(threadId),
    reviewed: false,
    deferred: true,
    deferredAt: new Date().toISOString(),
  };
  addLocalReceipt({
    type: 'triage',
    title: 'Thread deferred locally',
    threadId,
    summary: 'Local defer state only. No provider archive or snooze occurred.',
  });
  saveState();
  setStatusMessage('Thread deferred locally.');
}

function createLocalTaskProposal(threadId) {
  const thread = inboxThreads().find((entry) => entry.id === threadId);
  if (!thread) return;
  const id = createLocalId('task');
  const createdAt = new Date().toISOString();
  const proposal = {
    id,
    type: 'task',
    threadId,
    title: `Task from ${thread.title}`,
    summary: thread.summary,
    createdAt,
    state: 'local_proposal',
  };
  state.inbox.proposals = [proposal, ...state.inbox.proposals].slice(0, 20);
  state.tasks.tasks = [{
    id,
    title: proposal.title,
    status: 'proposed',
    dueDate: '',
    notes: proposal.summary,
    sourceRef: `inbox-thread:${threadId}`,
    sourceType: 'inbox_local',
    threadId,
    calendarId: null,
    createdAt,
    updatedAt: createdAt,
    state: 'local_preview_task',
  }, ...(state.tasks.tasks || [])];
  state.tasks.selectedTaskId = id;
  addLocalReceipt({
    type: 'proposal',
    title: 'Local task proposal created',
    threadId,
    summary: proposal.title,
  });
  addTaskReceipt({
    type: 'task',
    title: 'Inbox-linked task created',
    taskId: id,
    summary: `Source inbox-thread:${threadId}`,
  });
  saveState();
  setStatusMessage('Local task proposal created. Provider task write remains blocked.');
}

function createLocalCalendarProposal(threadId) {
  const thread = inboxThreads().find((entry) => entry.id === threadId);
  if (!thread) return;
  const id = createLocalId('calendar');
  const createdAt = new Date().toISOString();
  const inboxProposal = {
    id,
    type: 'calendar',
    threadId,
    title: `Calendar proposal from ${thread.title}`,
    summary: 'Local event proposal from inbox thread context. Not scheduled on provider.',
    createdAt,
    state: 'local_proposal',
  };
  state.inbox.proposals = [inboxProposal, ...state.inbox.proposals].slice(0, 20);
  state.calendar.proposals = [{
    id,
    title: inboxProposal.title,
    dateTime: '',
    notes: inboxProposal.summary,
    sourceRef: `inbox-thread:${threadId}`,
    sourceType: 'inbox_local',
    threadId,
    createdAt,
    updatedAt: createdAt,
    state: 'local_preview_proposal',
  }, ...(state.calendar.proposals || [])];
  state.calendar.selectedProposalId = id;
  addLocalReceipt({
    type: 'proposal',
    title: 'Local calendar proposal created',
    threadId,
    summary: inboxProposal.title,
  });
  addCalendarReceipt({
    type: 'proposal',
    title: 'Inbox-linked calendar proposal',
    proposalId: id,
    summary: `Source inbox-thread:${threadId}`,
  });
  saveState();
  setStatusMessage('Local calendar proposal created. Provider calendar write remains blocked.');
}

function clearInboxPreviewState() {
  state.inbox = defaultInboxOps();
  saveState();
  setStatusMessage('All local Inbox preview state cleared. Fixture threads unchanged.');
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
  if (laneId === 'calendar') {
    const proposal = selectedCalendarProposal();
    return proposal ? `calendar:local:${proposal.id}` : 'lane:calendar';
  }
  if (laneId === 'tasks') {
    const task = selectedLocalTask();
    return task ? `tasks:local:${task.id}` : 'lane:tasks';
  }
  if (laneId === 'automations') {
    const rule = selectedAutomationRule();
    return rule ? `automations:local:${rule.id}` : 'lane:automations';
  }
  if (laneId === 'extensions') {
    const install = selectedExtensionInstall();
    return install ? `extensions:local:${install.id}` : 'lane:extensions';
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

  if (laneId === 'calendar') {
    allCalendarProposals().forEach((proposal) => {
      items.push({
        id: `calendar:local:${proposal.id}`,
        kind: 'local calendar proposal',
        title: proposal.title,
        summary: proposal.notes || 'Local preview proposal only.',
        meta: proposal.sourceRef,
        state: proposal.state,
        safeNext: 'Edit local proposal; provider calendar write remains blocked.',
        blocked: 'Provider calendar write, invite send, and runtime scheduling remain blocked.',
        receipt: 'Local calendar proposal receipt preview available.',
      });
    });
  }

  if (laneId === 'tasks') {
    allLocalTasks().forEach((task) => {
      items.push({
        id: `tasks:local:${task.id}`,
        kind: 'local preview task',
        title: task.title,
        summary: task.notes || 'Local preview task only.',
        meta: task.sourceRef,
        state: task.status,
        safeNext: 'Edit local task or change status; provider task write remains blocked.',
        blocked: 'Provider task write, send, and runtime sync remain blocked.',
        receipt: 'Local task receipt preview available.',
      });
    });
  }

  if (laneId === 'automations') {
    allLocalAutomationRules().forEach((rule) => {
      items.push({
        id: `automations:local:${rule.id}`,
        kind: 'local automation rule',
        title: rule.title,
        summary: rule.proposal || 'Dry-run rule only.',
        meta: `trigger: ${rule.trigger || 'unset'}`,
        state: rule.state,
        safeNext: 'Run dry-run simulation; enable/execute remains blocked.',
        blocked: 'Automation execution, enablement, provider/repo mutation remain blocked.',
        receipt: 'Dry-run receipt preview available.',
      });
    });
  }

  if (laneId === 'extensions') {
    allExtensionInstalls().forEach((install) => {
      items.push({
        id: `extensions:local:${install.id}`,
        kind: 'local preview install',
        title: install.label,
        summary: install.provisionNotes || 'Preview install only.',
        meta: install.permissions,
        state: install.state,
        safeNext: 'Edit local provision notes; OAuth/connect remains blocked.',
        blocked: 'OAuth, credentials, provider read/write, and runtime connection remain blocked.',
        receipt: 'Install/provision receipt preview available.',
      });
    });
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
    if (section.type === 'automation-studio') {
      (section.templates || []).forEach((template, index) => pushItem(index, 'automation rule', {
        ...template,
        title: template.title,
        safeNext: 'Dry-run simulation only; automation execution blocked.',
        blocked: 'No automation execution path exists.',
      }));
    }
    if (section.type === 'dry-run') {
      (section.steps || []).forEach((step, index) => pushItem(index, 'dry-run step', step));
    }
    if (section.type === 'extension-matrix') {
      (section.providers || []).forEach((provider, index) => pushItem(index, 'provider gate', {
        title: provider.label,
        summary: provider.summary,
        state: provider.state,
        meta: provider.permissions,
        blocked: 'Provider connection and credentials remain blocked.',
      }));
    }
    if (section.type === 'secret-boundary') {
      (section.items || []).forEach((item, index) => pushItem(index, 'secret boundary', item));
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
  if (focusId.startsWith('calendar:local:')) {
    state.calendar.selectedProposalId = focusId.replace('calendar:local:', '');
  }
  if (focusId.startsWith('tasks:local:')) {
    state.tasks.selectedTaskId = focusId.replace('tasks:local:', '');
  }
  if (focusId.startsWith('automations:local:')) {
    state.automations.selectedRuleId = focusId.replace('automations:local:', '');
  }
  if (focusId.startsWith('extensions:local:')) {
    state.extensions.selectedInstallId = focusId.replace('extensions:local:', '');
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

function renderLocalTriageChip(threadId) {
  const triage = inboxTriageFor(threadId);
  if (triage.deferred) return '<span class="thread-status-chip is-neutral">deferred locally</span>';
  if (triage.reviewed) return '<span class="thread-status-chip is-neutral">reviewed locally</span>';
  return '';
}

function renderInboxOperabilityPanel() {
  const compose = state.inbox.composeDraft || {};
  return `
    <section class="lane-section inbox-operability-panel" aria-label="Inbox local operability">
      <header class="section-head">
        <div>
          <p class="section-eyebrow">local operability</p>
          <h3>Compose and preview controls</h3>
          <p>Create local preview drafts only. No provider connection or send path exists.</p>
        </div>
        <span class="draft-proposal-state">local preview draft</span>
      </header>
      <div id="inboxStatusRegion" class="inbox-status-region" role="status" aria-live="polite">${escapeHtml(state.statusMessage || 'Ready for local Inbox operability.')}</div>
      <form class="inbox-draft-form" data-inbox-form="compose" aria-label="Local compose draft">
        <h4 id="compose-draft-label">New local compose draft</h4>
        <label for="compose-to">To (preview)</label>
        <input id="compose-to" name="to" type="text" autocomplete="off" value="${escapeHtml(compose.to || '')}" />
        <label for="compose-subject">Subject (preview)</label>
        <input id="compose-subject" name="subject" type="text" autocomplete="off" value="${escapeHtml(compose.subject || '')}" />
        <label for="compose-body">Draft body (local preview only)</label>
        <textarea id="compose-body" name="body" rows="4" aria-describedby="compose-draft-hint">${escapeHtml(compose.body || '')}</textarea>
        <p id="compose-draft-hint" class="form-hint">Local preview draft. Not sent. No provider write.</p>
        <div class="inbox-form-actions">
          <button class="inbox-action-btn is-primary" type="submit" data-inbox-action="compose-save">Save local compose draft</button>
          <button class="inbox-action-btn" type="button" data-inbox-action="compose-clear">Clear compose draft</button>
          <button class="inbox-action-btn is-blocked" type="button" disabled aria-describedby="send-blocked-hint">Send blocked</button>
        </div>
      </form>
      <div class="inbox-clear-control">
        <button class="inbox-action-btn is-danger" type="button" data-inbox-action="clear-all" aria-describedby="clear-all-hint">Clear all local Inbox preview state</button>
        <p id="clear-all-hint" class="form-hint">Removes local drafts, triage, proposals, and receipts from preview storage. Fixture threads are unchanged.</p>
      </div>
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
                ${renderLocalTriageChip(thread.id)}
                ${renderCompactLabelLine((thread.labels || []).slice(0, 2))}
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderInboxTriageBar(threadId) {
  if (!threadId) return '';
  return `
    <div class="inbox-triage-bar" aria-label="Local triage actions">
      <button class="inbox-action-btn" type="button" data-inbox-action="mark-reviewed" data-thread-id="${escapeHtml(threadId)}">Mark reviewed locally</button>
      <button class="inbox-action-btn" type="button" data-inbox-action="defer-thread" data-thread-id="${escapeHtml(threadId)}">Defer locally</button>
      <button class="inbox-action-btn" type="button" data-inbox-action="task-proposal" data-thread-id="${escapeHtml(threadId)}">Create local task proposal</button>
      <button class="inbox-action-btn" type="button" data-inbox-action="calendar-proposal" data-thread-id="${escapeHtml(threadId)}">Create local calendar proposal</button>
    </div>
  `;
}

function renderLocalReceiptsPanel(threadId) {
  const receipts = localReceiptsForThread(threadId);
  const proposals = localProposalsForThread(threadId);
  if (!receipts.length && !proposals.length) {
    return '<p class="form-hint">No local receipts or proposals yet for this thread.</p>';
  }
  return `
    <div class="inbox-local-receipts" aria-label="Local receipt and proposal preview">
      ${proposals.map((proposal) => `
        <article class="local-receipt-row">
          <header>
            <strong>${escapeHtml(proposal.title)}</strong>
            <span>${escapeHtml(label(proposal.type))} · local proposal</span>
          </header>
          <p>${escapeHtml(proposal.summary)}</p>
          <p class="form-hint">Local preview only. Runtime ${escapeHtml(proposal.type)} write remains blocked.</p>
        </article>
      `).join('')}
      ${receipts.map((receipt) => `
        <article class="local-receipt-row">
          <header>
            <strong>${escapeHtml(receipt.title)}</strong>
            <span>${escapeHtml(label(receipt.type))} · local receipt</span>
          </header>
          <p>${escapeHtml(receipt.summary)}</p>
          <p class="form-hint">${escapeHtml(receipt.limitations)}</p>
        </article>
      `).join('')}
    </div>
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
  const threadId = thread.id || state.threadId;
  const reply = replyDraftFor(threadId) || {};
  return `
    <section class="lane-section draft-egress-panel" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      ${renderInboxTriageBar(threadId)}
      <div class="inbox-draft-grid">
        <article class="draft-proposal-panel">
          <header>
            <strong>${escapeHtml(draft.title || 'Fixture draft guidance')}</strong>
            <span class="draft-proposal-state">${escapeHtml(label(draft.state || 'draft_only'))}</span>
          </header>
          <p>${escapeHtml(draft.summary || '')}</p>
          ${renderDetailList(draft.details)}
        </article>
        <form class="inbox-draft-form" data-inbox-form="reply" aria-label="Local reply draft for selected thread">
          <h4 id="reply-draft-label">Reply draft for selected thread</h4>
          <p class="form-hint">Fixture context only: ${escapeHtml(thread.title || 'No thread selected')}</p>
          <label for="reply-to">To (preview)</label>
          <input id="reply-to" name="to" type="text" autocomplete="off" value="${escapeHtml(reply.to || thread.sender || '')}" />
          <label for="reply-subject">Subject (preview)</label>
          <input id="reply-subject" name="subject" type="text" autocomplete="off" value="${escapeHtml(reply.subject || (thread.title ? `Re: ${thread.title}` : ''))}" />
          <label for="reply-body">Reply body (local preview only)</label>
          <textarea id="reply-body" name="body" rows="5" aria-describedby="reply-draft-hint">${escapeHtml(reply.body || '')}</textarea>
          <p id="reply-draft-hint" class="form-hint">Local preview reply draft. Not sent. No message body or provider data loaded.</p>
          <div class="inbox-form-actions">
            <button class="inbox-action-btn is-primary" type="submit" data-inbox-action="reply-save" data-thread-id="${escapeHtml(threadId || '')}">Save local reply draft</button>
            <button class="inbox-action-btn" type="button" data-inbox-action="reply-clear" data-thread-id="${escapeHtml(threadId || '')}">Clear reply draft</button>
            <button class="inbox-action-btn is-blocked" type="button" disabled id="send-blocked-hint" aria-describedby="send-blocked-hint">Send blocked — provider/runtime gated</button>
          </div>
        </form>
        <article class="draft-proposal-panel">
          <header>
            <strong>Local receipt and proposal preview</strong>
            <span class="draft-proposal-state">preview only</span>
          </header>
          ${renderLocalReceiptsPanel(threadId)}
        </article>
        ${renderEgressPolicyModule(actions)}
      </div>
    </section>
  `;
}

function renderCalendarLocalReceipts(proposalId) {
  const receipts = (state.calendar.receipts || []).filter((entry) => !proposalId || entry.proposalId === proposalId);
  if (!receipts.length) return '<p class="form-hint">No local calendar receipts yet.</p>';
  return receipts.map((receipt) => `
    <article class="local-receipt-row">
      <header>
        <strong>${escapeHtml(receipt.title)}</strong>
        <span>${escapeHtml(label(receipt.type))} · local receipt</span>
      </header>
      <p>${escapeHtml(receipt.summary)}</p>
      <p class="form-hint">${escapeHtml(receipt.limitations)}</p>
    </article>
  `).join('');
}

function renderCalendarOperabilityPanel() {
  const selected = selectedCalendarProposal();
  const proposals = allCalendarProposals();
  const proposalId = selected?.id || '';
  return `
    <section class="lane-section calendar-operability-panel" aria-label="Calendar local operability">
      <header class="section-head">
        <div>
          <p class="section-eyebrow">local operability</p>
          <h3>Event proposal controls</h3>
          <p>Create and edit local preview proposals only. No provider calendar write.</p>
        </div>
        <span class="draft-proposal-state">local preview proposal</span>
      </header>
      <div id="calendarStatusRegion" class="inbox-status-region" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'calendar' ? state.statusMessage : 'Ready for local Calendar operability.')}</div>
      <form class="inbox-draft-form" data-calendar-form="proposal" aria-label="Local calendar event proposal">
        <input type="hidden" name="proposalId" value="${escapeHtml(proposalId)}" />
        <h4 id="calendar-proposal-label">${proposalId ? 'Edit local calendar proposal' : 'New local calendar proposal'}</h4>
        <label for="calendar-title">Event title (preview)</label>
        <input id="calendar-title" name="title" type="text" autocomplete="off" value="${escapeHtml(selected?.title || '')}" />
        <label for="calendar-datetime">Date/time text (preview)</label>
        <input id="calendar-datetime" name="dateTime" type="text" autocomplete="off" value="${escapeHtml(selected?.dateTime || '')}" placeholder="e.g. Jun 10, 2:00 PM" />
        <label for="calendar-notes">Notes (local preview only)</label>
        <textarea id="calendar-notes" name="notes" rows="3" aria-describedby="calendar-proposal-hint">${escapeHtml(selected?.notes || '')}</textarea>
        <label for="calendar-source-ref">Source reference (preview)</label>
        <input id="calendar-source-ref" name="sourceRef" type="text" autocomplete="off" value="${escapeHtml(selected?.sourceRef || '')}" placeholder="fixture ref or inbox-thread:id" />
        <input type="hidden" name="sourceType" value="${escapeHtml(selected?.sourceType || 'calendar_local')}" />
        <input type="hidden" name="threadId" value="${escapeHtml(selected?.threadId || '')}" />
        <p id="calendar-proposal-hint" class="form-hint">Local preview proposal. Not scheduled on provider. Source may be fixture or inbox-local.</p>
        <div class="inbox-form-actions">
          <button class="inbox-action-btn is-primary" type="submit" data-calendar-action="proposal-save">${proposalId ? 'Update local proposal' : 'Save local proposal'}</button>
          ${proposalId ? `<button class="inbox-action-btn" type="button" data-calendar-action="proposal-clear" data-proposal-id="${escapeHtml(proposalId)}">Clear selected proposal</button>` : ''}
          <button class="inbox-action-btn is-blocked" type="button" disabled aria-describedby="calendar-write-blocked">Provider calendar write blocked</button>
        </div>
        <p id="calendar-write-blocked" class="form-hint">Invite send, provider sync, and runtime scheduling remain blocked.</p>
      </form>
      <div class="calendar-local-proposal-list" aria-label="Local calendar proposals">
        <h4>Local proposals (${proposals.length})</h4>
        ${proposals.length ? proposals.map((proposal) => `
          <button class="calendar-proposal-row is-inspector-focusable ${proposal.id === proposalId ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(`calendar:local:${proposal.id}`)}" data-calendar-action="select-proposal" data-proposal-id="${escapeHtml(proposal.id)}" aria-pressed="${proposal.id === proposalId ? 'true' : 'false'}">
            <div>
              <strong>${escapeHtml(proposal.title)}</strong>
              <p>${escapeHtml(proposal.notes || '')}</p>
            </div>
            <div class="calendar-proposal-meta">
              <span>${escapeHtml(proposal.sourceRef || 'no source ref')}</span>
              <em>${escapeHtml(label(proposal.sourceType || 'calendar_local'))}</em>
            </div>
          </button>
        `).join('') : '<p class="form-hint">No local proposals yet. Create one or use Inbox triage to add inbox-linked proposals.</p>'}
      </div>
      <article class="draft-proposal-panel">
        <header>
          <strong>Local receipt preview</strong>
          <span class="draft-proposal-state">preview only</span>
        </header>
        ${renderCalendarLocalReceipts(proposalId)}
      </article>
      <div class="inbox-clear-control">
        <button class="inbox-action-btn is-danger" type="button" data-calendar-action="clear-all">Clear all local Calendar preview state</button>
      </div>
    </section>
  `;
}

function renderTasksLocalReceipts(taskId) {
  const receipts = (state.tasks.receipts || []).filter((entry) => !taskId || entry.taskId === taskId);
  if (!receipts.length) return '<p class="form-hint">No local task receipts yet.</p>';
  return receipts.map((receipt) => `
    <article class="local-receipt-row">
      <header>
        <strong>${escapeHtml(receipt.title)}</strong>
        <span>${escapeHtml(label(receipt.type))} · local receipt</span>
      </header>
      <p>${escapeHtml(receipt.summary)}</p>
      <p class="form-hint">${escapeHtml(receipt.limitations)}</p>
    </article>
  `).join('');
}

function renderTaskStatusButtons(taskId, currentStatus) {
  if (!taskId) return '';
  return `
    <div class="tasks-status-bar" aria-label="Local task status changes">
      <span class="form-hint">Local status:</span>
      ${TASK_STATUSES.map((status) => `
        <button class="inbox-action-btn ${currentStatus === status ? 'is-primary' : ''}" type="button" data-tasks-action="set-status" data-task-id="${escapeHtml(taskId)}" data-task-status="${escapeHtml(status)}" aria-pressed="${currentStatus === status ? 'true' : 'false'}">${escapeHtml(label(status))}</button>
      `).join('')}
    </div>
  `;
}

function renderTasksOperabilityPanel() {
  const selected = selectedLocalTask();
  const tasks = allLocalTasks();
  const taskId = selected?.id || '';
  const calendarSources = allCalendarProposals().map((p) => `calendar:local:${p.id}`).join(', ') || 'none yet';
  return `
    <section class="lane-section tasks-operability-panel" aria-label="Tasks local operability">
      <header class="section-head">
        <div>
          <p class="section-eyebrow">local operability</p>
          <h3>Task create and edit controls</h3>
          <p>Create and edit local preview tasks only. No provider task write.</p>
        </div>
        <span class="draft-proposal-state">local preview task</span>
      </header>
      <div id="tasksStatusRegion" class="inbox-status-region" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'tasks' ? state.statusMessage : 'Ready for local Tasks operability.')}</div>
      <form class="inbox-draft-form" data-tasks-form="task" aria-label="Local task create/edit">
        <input type="hidden" name="taskId" value="${escapeHtml(taskId)}" />
        <h4 id="tasks-form-label">${taskId ? 'Edit local task' : 'New local task'}</h4>
        <label for="task-title">Task title (preview)</label>
        <input id="task-title" name="title" type="text" autocomplete="off" value="${escapeHtml(selected?.title || '')}" />
        <label for="task-status">Status (preview)</label>
        <select id="task-status" name="status" aria-describedby="tasks-form-hint">
          ${TASK_STATUSES.map((status) => `<option value="${escapeHtml(status)}" ${selected?.status === status ? 'selected' : ''}>${escapeHtml(label(status))}</option>`).join('')}
        </select>
        <label for="task-due">Due date text (preview)</label>
        <input id="task-due" name="dueDate" type="text" autocomplete="off" value="${escapeHtml(selected?.dueDate || '')}" placeholder="e.g. Jun 12" />
        <label for="task-notes">Notes (local preview only)</label>
        <textarea id="task-notes" name="notes" rows="3">${escapeHtml(selected?.notes || '')}</textarea>
        <label for="task-source-ref">Source reference (preview)</label>
        <input id="task-source-ref" name="sourceRef" type="text" autocomplete="off" value="${escapeHtml(selected?.sourceRef || '')}" placeholder="inbox-thread:id or calendar:local:id" />
        <input type="hidden" name="sourceType" value="${escapeHtml(selected?.sourceType || 'tasks_local')}" />
        <input type="hidden" name="threadId" value="${escapeHtml(selected?.threadId || '')}" />
        <input type="hidden" name="calendarId" value="${escapeHtml(selected?.calendarId || '')}" />
        <p id="tasks-form-hint" class="form-hint">Local preview task. Available calendar sources: ${escapeHtml(calendarSources)}. No provider sync.</p>
        ${taskId ? renderTaskStatusButtons(taskId, selected?.status || 'proposed') : ''}
        <div class="inbox-form-actions">
          <button class="inbox-action-btn is-primary" type="submit" data-tasks-action="task-save">${taskId ? 'Update local task' : 'Save local task'}</button>
          ${taskId ? `<button class="inbox-action-btn" type="button" data-tasks-action="task-clear" data-task-id="${escapeHtml(taskId)}">Clear selected task</button>` : ''}
          <button class="inbox-action-btn is-blocked" type="button" disabled aria-describedby="tasks-write-blocked">Provider task write blocked</button>
        </div>
        <p id="tasks-write-blocked" class="form-hint">Provider task sync, send, and runtime writes remain blocked.</p>
      </form>
      <div class="tasks-local-list" aria-label="Local tasks">
        <h4>Local tasks (${tasks.length})</h4>
        ${tasks.length ? tasks.map((task) => `
          <button class="calendar-proposal-row is-inspector-focusable ${task.id === taskId ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(`tasks:local:${task.id}`)}" data-tasks-action="select-task" data-task-id="${escapeHtml(task.id)}" aria-pressed="${task.id === taskId ? 'true' : 'false'}">
            <div>
              <strong>${escapeHtml(task.title)}</strong>
              <p>${escapeHtml(task.notes || '')}</p>
            </div>
            <div class="calendar-proposal-meta">
              <span>${escapeHtml(label(task.status))} · ${escapeHtml(task.sourceRef || 'no source')}</span>
              <em>${escapeHtml(label(task.sourceType || 'tasks_local'))}</em>
            </div>
          </button>
        `).join('') : '<p class="form-hint">No local tasks yet. Create one or use Inbox triage to add inbox-linked tasks.</p>'}
      </div>
      <article class="draft-proposal-panel">
        <header>
          <strong>Local receipt preview</strong>
          <span class="draft-proposal-state">preview only</span>
        </header>
        ${renderTasksLocalReceipts(taskId)}
      </article>
      <div class="inbox-clear-control">
        <button class="inbox-action-btn is-danger" type="button" data-tasks-action="clear-all">Clear all local Tasks preview state</button>
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

function renderAutomationsLocalReceipts(ruleId) {
  const receipts = (state.automations.receipts || []).filter((entry) => !ruleId || entry.ruleId === ruleId);
  if (!receipts.length) return '<p class="form-hint">No local automation receipts yet.</p>';
  return receipts.map((receipt) => `
    <article class="local-receipt-row">
      <header><strong>${escapeHtml(receipt.title)}</strong><span>${escapeHtml(label(receipt.type))} · local receipt</span></header>
      <p>${escapeHtml(receipt.summary)}</p>
      <p class="form-hint">${escapeHtml(receipt.limitations)}</p>
    </article>
  `).join('');
}

function renderAutomationsDryRunOutput(ruleId) {
  const dryRun = state.automations.lastDryRun;
  if (!dryRun || dryRun.ruleId !== ruleId) {
    return '<p class="form-hint">Run dry-run to simulate trigger → condition → proposal → gate → blocked execution.</p>';
  }
  return `
    <ol class="dry-run-pipeline" aria-label="Local dry-run simulation result">
      ${dryRun.steps.map((step, index) => `
        <li class="dry-run-step">
          <span class="dry-run-step-index">${index + 1}</span>
          <div><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.summary)}</p></div>
          <em>${escapeHtml(label(step.state))}</em>
        </li>
      `).join('')}
    </ol>
  `;
}

function renderAutomationsOperabilityPanel() {
  const selected = selectedAutomationRule();
  const rules = allLocalAutomationRules();
  const ruleId = selected?.id || '';
  return `
    <section class="lane-section automations-operability-panel" aria-label="Automations local operability">
      <header class="section-head">
        <div>
          <p class="section-eyebrow">local operability</p>
          <h3>Rule builder and dry-run</h3>
          <p>Build local preview rules and simulate dry-run only. No execution.</p>
        </div>
        <span class="draft-proposal-state">dry-run only</span>
      </header>
      <div id="automationsStatusRegion" class="inbox-status-region" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'automations' ? state.statusMessage : 'Ready for local Automations operability.')}</div>
      <form class="inbox-draft-form" data-automations-form="rule" aria-label="Local automation rule">
        <input type="hidden" name="ruleId" value="${escapeHtml(ruleId)}" />
        <h4>${ruleId ? 'Edit local rule' : 'New local rule'}</h4>
        <label for="auto-title">Rule title (preview)</label>
        <input id="auto-title" name="title" type="text" autocomplete="off" value="${escapeHtml(selected?.title || '')}" />
        <label for="auto-trigger">Trigger (preview)</label>
        <input id="auto-trigger" name="trigger" type="text" autocomplete="off" value="${escapeHtml(selected?.trigger || '')}" placeholder="e.g. urgent inbox thread" />
        <label for="auto-condition">Condition (preview)</label>
        <input id="auto-condition" name="condition" type="text" autocomplete="off" value="${escapeHtml(selected?.condition || '')}" />
        <label for="auto-proposal">Proposed action (preview)</label>
        <textarea id="auto-proposal" name="proposal" rows="2">${escapeHtml(selected?.proposal || '')}</textarea>
        <label for="auto-gate">Approval gate (preview)</label>
        <input id="auto-gate" name="gate" type="text" autocomplete="off" value="${escapeHtml(selected?.gate || 'human approval required')}" />
        <p class="form-hint">Local preview rule. Execution and enablement blocked.</p>
        <div class="inbox-form-actions">
          <button class="inbox-action-btn is-primary" type="submit" data-automations-action="rule-save">${ruleId ? 'Update local rule' : 'Save local rule'}</button>
          ${ruleId ? `<button class="inbox-action-btn" type="button" data-automations-action="dry-run" data-rule-id="${escapeHtml(ruleId)}">Run dry-run</button>` : ''}
          ${ruleId ? `<button class="inbox-action-btn" type="button" data-automations-action="rule-clear" data-rule-id="${escapeHtml(ruleId)}">Clear selected rule</button>` : ''}
          <button class="inbox-action-btn is-blocked" type="button" disabled>Enable/run blocked</button>
        </div>
      </form>
      <div class="automations-local-list" aria-label="Local automation rules">
        <h4>Local rules (${rules.length})</h4>
        ${rules.length ? rules.map((rule) => `
          <button class="automation-rule-row is-inspector-focusable ${rule.id === ruleId ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(`automations:local:${rule.id}`)}" data-automations-action="select-rule" data-rule-id="${escapeHtml(rule.id)}" aria-pressed="${rule.id === ruleId ? 'true' : 'false'}">
            <div class="automation-rule-copy">
              <strong>${escapeHtml(rule.title)}</strong>
              <p>${escapeHtml(rule.proposal || '')}</p>
              <span class="automation-rule-meta">trigger: ${escapeHtml(rule.trigger || 'unset')} · ${escapeHtml(label(rule.state))}</span>
            </div>
            <em>dry run only</em>
          </button>
        `).join('') : '<p class="form-hint">No local rules yet. Create a rule above.</p>'}
      </div>
      <article class="draft-proposal-panel">
        <header><strong>Dry-run output</strong><span class="draft-proposal-state">simulation only</span></header>
        ${renderAutomationsDryRunOutput(ruleId)}
      </article>
      <article class="draft-proposal-panel">
        <header><strong>Local receipt preview</strong><span class="draft-proposal-state">preview only</span></header>
        ${renderAutomationsLocalReceipts(ruleId)}
      </article>
      <div class="inbox-clear-control">
        <button class="inbox-action-btn is-danger" type="button" data-automations-action="clear-all">Clear all local Automations preview state</button>
      </div>
    </section>
  `;
}

function renderAutomationStudio(section) {
  const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
  return `
    <section class="lane-section automation-studio" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="automation-rule-list">
        ${(section.templates || []).map((template, index) => {
          const focusId = `${state.laneId}:automation-studio:${sectionIndex}:${index}`;
          const focused = state.focusId === focusId;
          return `
            <button class="automation-rule-row is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(focusId)}" aria-selected="${focused ? 'true' : 'false'}">
              <div class="automation-rule-copy">
                <strong>${escapeHtml(template.title)}</strong>
                <p>${escapeHtml(template.summary)}</p>
                <span class="automation-rule-meta">trigger: ${escapeHtml(template.trigger)} · gate: ${escapeHtml(template.gate)} · receipt: ${escapeHtml(template.receipt)}</span>
              </div>
              <em>${escapeHtml(label(template.state || 'dry_run_only'))}</em>
            </button>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderDryRun(section) {
  const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
  return `
    <section class="lane-section dry-run-preview" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <ol class="dry-run-pipeline">
        ${(section.steps || []).map((step, index) => {
          const focusId = `${state.laneId}:dry-run:${sectionIndex}:${index}`;
          const focused = state.focusId === focusId;
          return `
            <li class="dry-run-step is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" data-inspector-focus="${escapeHtml(focusId)}" tabindex="0" aria-selected="${focused ? 'true' : 'false'}">
              <span class="dry-run-step-index">${escapeHtml(index + 1)}</span>
              <div>
                <strong>${escapeHtml(step.title)}</strong>
                <p>${escapeHtml(step.summary)}</p>
              </div>
              <em>${escapeHtml(label(step.state || 'preview_only'))}</em>
            </li>
          `;
        }).join('')}
      </ol>
    </section>
  `;
}

function renderExtensionsLocalReceipts(installId) {
  const receipts = (state.extensions.receipts || []).filter((entry) => !installId || entry.installId === installId);
  if (!receipts.length) return '<p class="form-hint">No local extension receipts yet.</p>';
  return receipts.map((receipt) => `
    <article class="local-receipt-row">
      <header><strong>${escapeHtml(receipt.title)}</strong><span>${escapeHtml(label(receipt.type))} · local receipt</span></header>
      <p>${escapeHtml(receipt.summary)}</p>
      <p class="form-hint">${escapeHtml(receipt.limitations)}</p>
    </article>
  `).join('');
}

function renderExtensionsOperabilityPanel() {
  const fixtures = extensionFixtures();
  const selected = selectedExtensionInstall();
  const installId = selected?.id || '';
  return `
    <section class="lane-section extensions-operability-panel" aria-label="Extensions local operability">
      <header class="section-head">
        <div>
          <p class="section-eyebrow">local operability</p>
          <h3>Preview install and provision</h3>
          <p>Record local preview installs only. No OAuth or provider connection.</p>
        </div>
        <span class="draft-proposal-state">preview install only</span>
      </header>
      <div id="extensionsStatusRegion" class="inbox-status-region" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'extensions' ? state.statusMessage : 'Ready for local Extensions operability.')}</div>
      <div class="extensions-fixture-list" aria-label="Fixture providers">
        <h4>Provider fixtures (${fixtures.length})</h4>
        ${fixtures.map((fixture) => {
          const install = installForFixture(fixture.fixtureId);
          return `
            <article class="provider-gate-row">
              <div>
                <strong>${escapeHtml(fixture.label)}</strong>
                <p>${escapeHtml(fixture.summary)}</p>
                <span class="provider-permission-line">${escapeHtml(fixture.permissions)}</span>
                <p class="form-hint">Fixture state: ${escapeHtml(label(fixture.state))}${install ? ' · preview installed locally' : ''}</p>
              </div>
              <div class="inbox-form-actions">
                ${install
    ? `<button class="inbox-action-btn" type="button" data-extensions-action="select-install" data-install-id="${escapeHtml(install.id)}" data-inspector-focus="${escapeHtml(`extensions:local:${install.id}`)}">View install</button>
                   <button class="inbox-action-btn" type="button" data-extensions-action="remove-install" data-install-id="${escapeHtml(install.id)}">Remove preview install</button>`
    : `<button class="inbox-action-btn is-primary" type="button" data-extensions-action="preview-install" data-fixture-id="${escapeHtml(fixture.fixtureId)}">Record preview install</button>`}
                <button class="inbox-action-btn is-blocked" type="button" disabled>Connect/OAuth blocked</button>
              </div>
            </article>
          `;
        }).join('')}
      </div>
      ${installId ? `
        <form class="inbox-draft-form" data-extensions-form="provision" aria-label="Local provision notes">
          <input type="hidden" name="installId" value="${escapeHtml(installId)}" />
          <h4>Provision notes for ${escapeHtml(selected?.label || 'install')}</h4>
          <label for="ext-provision-notes">Local provision notes (preview)</label>
          <textarea id="ext-provision-notes" name="provisionNotes" rows="3">${escapeHtml(selected?.provisionNotes || '')}</textarea>
          <p class="form-hint">Planning notes only. No credentials or tokens stored.</p>
          <div class="inbox-form-actions">
            <button class="inbox-action-btn is-primary" type="submit" data-extensions-action="provision-save">Save provision notes</button>
            <button class="inbox-action-btn is-blocked" type="button" disabled>Provider write blocked</button>
          </div>
        </form>
      ` : '<p class="form-hint">Select or create a preview install to edit provision notes.</p>'}
      <article class="draft-proposal-panel">
        <header><strong>Local receipt preview</strong><span class="draft-proposal-state">preview only</span></header>
        ${renderExtensionsLocalReceipts(installId)}
      </article>
      <div class="inbox-clear-control">
        <button class="inbox-action-btn is-danger" type="button" data-extensions-action="clear-all">Clear all local Extensions preview state</button>
      </div>
    </section>
  `;
}

function renderExtensionMatrix(section) {
  const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
  return `
    <section class="lane-section extension-matrix" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="provider-gate-list">
        ${(section.providers || []).map((provider, index) => {
          const focusId = `${state.laneId}:extension-matrix:${sectionIndex}:${index}`;
          const focused = state.focusId === focusId;
          return `
            <button class="provider-gate-row is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(focusId)}" aria-selected="${focused ? 'true' : 'false'}">
              <div>
                <strong>${escapeHtml(provider.label)}</strong>
                <p>${escapeHtml(provider.summary)}</p>
                <span class="provider-permission-line">${escapeHtml(provider.permissions)}</span>
              </div>
              <em>${escapeHtml(label(provider.state || 'provider_blocked'))}</em>
            </button>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderSecretBoundary(section) {
  const sectionIndex = (activeLaneContent().sections || []).findIndex((entry) => entry === section);
  return `
    <section class="lane-section secret-boundary" aria-label="${escapeHtml(section.title)}">
      ${renderSectionHeader(section)}
      <div class="secret-boundary-list">
        ${(section.items || []).map((item, index) => {
          const focusId = `${state.laneId}:secret-boundary:${sectionIndex}:${index}`;
          const focused = state.focusId === focusId;
          return `
            <button class="secret-boundary-row is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" type="button" data-inspector-focus="${escapeHtml(focusId)}" aria-selected="${focused ? 'true' : 'false'}">
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.summary)}</p>
              <em>${escapeHtml(label(item.state || 'credentials_absent'))}</em>
            </button>
          `;
        }).join('')}
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

      <div class="lane-content ${escapeHtml(content.layout || `${lane.id}-layout`)}${lane.id === 'inbox' ? ' is-inbox-lane' : ''}${lane.id === 'receipts' ? ' is-receipts-lane' : ''}${lane.id === 'ibal' ? ' is-ibal-lane' : ''}${lane.id === 'settings' ? ' is-settings-lane' : ''}${lane.id === 'calendar' ? ' is-calendar-lane' : ''}${lane.id === 'tasks' ? ' is-tasks-lane' : ''}${lane.id === 'automations' ? ' is-automations-lane' : ''}${lane.id === 'extensions' ? ' is-extensions-lane' : ''}">
        ${lane.id === 'inbox' ? renderInboxOperabilityPanel() : ''}
        ${lane.id === 'calendar' ? renderCalendarOperabilityPanel() : ''}
        ${lane.id === 'tasks' ? renderTasksOperabilityPanel() : ''}
        ${lane.id === 'automations' ? renderAutomationsOperabilityPanel() : ''}
        ${lane.id === 'extensions' ? renderExtensionsOperabilityPanel() : ''}
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

  if (focusItem?.id?.startsWith('extensions:local:')) {
    const installId = focusItem.id.replace('extensions:local:', '');
    const install = allExtensionInstalls().find((entry) => entry.id === installId);
    const receipts = (state.extensions.receipts || []).filter((entry) => entry.installId === installId);
    return {
      kind: focusItem.kind,
      title: focusItem.title,
      summary: focusItem.summary,
      context: `Local preview install: ${install?.label || 'unknown'}. Not connected to provider.`,
      why: install?.provisionNotes || 'Preview install records intent only; real connection requires gated runtime.',
      evidence: `Permissions (fixture): ${install?.permissions || 'n/a'}. Fixture ref: ${install?.fixtureId || 'n/a'}.`,
      safeNext: 'Edit provision notes locally; keep OAuth and provider connection blocked.',
      blocked: 'OAuth, credentials, provider read/write, repo mutation, and runtime connection remain blocked.',
      ibalProposal: laneInspector.ibalProposal || 'Ibal proposes preserving provider gates until ARCH-004 decisions.',
      receipts: receipts.length
        ? receipts.map((entry) => `${entry.title}: ${entry.summary}`).join(' ')
        : 'Install receipt appears after preview install.',
    };
  }

  if (focusItem?.id?.startsWith('automations:local:')) {
    const ruleId = focusItem.id.replace('automations:local:', '');
    const rule = allLocalAutomationRules().find((entry) => entry.id === ruleId);
    const receipts = (state.automations.receipts || []).filter((entry) => entry.ruleId === ruleId);
    const dryRun = state.automations.lastDryRun?.ruleId === ruleId ? state.automations.lastDryRun : null;
    return {
      kind: focusItem.kind,
      title: focusItem.title,
      summary: focusItem.summary,
      context: `Local automation rule selected. State: ${label(rule?.state || 'dry_run_only')}. Enabled: no.`,
      why: rule?.proposal || 'Rule shows what would happen in a future gated runtime.',
      evidence: `Trigger: ${rule?.trigger || 'unset'}. Condition: ${rule?.condition || 'unset'}. Gate: ${rule?.gate || 'unset'}.`,
      safeNext: dryRun ? 'Review dry-run steps; do not enable rule.' : 'Save rule and run dry-run simulation.',
      blocked: 'Enable, run, provider mutation, repo mutation, and automation execution remain blocked.',
      ibalProposal: laneInspector.ibalProposal || 'Ibal may review rules but cannot enable them.',
      receipts: receipts.length
        ? receipts.map((entry) => `${entry.title}: ${entry.summary}`).join(' ')
        : 'Dry-run receipt appears after simulation.',
    };
  }

  if (focusItem?.id?.startsWith('tasks:local:')) {
    const taskId = focusItem.id.replace('tasks:local:', '');
    const task = allLocalTasks().find((entry) => entry.id === taskId);
    const receipts = (state.tasks.receipts || []).filter((entry) => entry.taskId === taskId);
    const sourceLabel = task?.sourceType === 'inbox_local'
      ? `Inbox-local source: ${task.sourceRef}`
      : (task?.sourceRef ? `Source: ${task.sourceRef}` : 'No source ref');
    return {
      kind: focusItem.kind,
      title: focusItem.title,
      summary: focusItem.summary,
      context: `Local preview task selected. Status: ${label(task?.status || 'proposed')}. ${sourceLabel}.`,
      why: task?.notes || 'Work item requires human review before any provider task write.',
      evidence: `${sourceLabel}. Due: ${task?.dueDate || 'not set'}. Preview metadata only.`,
      safeNext: 'Edit task or change local status; keep provider task write blocked.',
      blocked: 'Provider task write, send, calendar provider write, and runtime sync remain blocked.',
      ibalProposal: laneInspector.ibalProposal || 'Ibal may propose task follow-up but cannot sync tasks.',
      receipts: receipts.length
        ? receipts.map((entry) => `${entry.title}: ${entry.summary} (${entry.limitations})`).join(' ')
        : 'Local task receipt will appear after save.',
    };
  }

  if (focusItem?.id?.startsWith('calendar:local:')) {
    const proposalId = focusItem.id.replace('calendar:local:', '');
    const proposal = allCalendarProposals().find((entry) => entry.id === proposalId);
    const receipts = (state.calendar.receipts || []).filter((entry) => entry.proposalId === proposalId);
    const sourceLabel = proposal?.sourceType === 'inbox_local'
      ? `Inbox-local source: ${proposal.sourceRef}`
      : (proposal?.sourceRef ? `Source: ${proposal.sourceRef}` : 'No source ref');
    return {
      kind: focusItem.kind,
      title: focusItem.title,
      summary: focusItem.summary,
      context: `Local calendar proposal selected. ${sourceLabel}. Fixture/provider calendar unchanged.`,
      why: proposal?.notes || 'Time proposal requires human review before any provider scheduling.',
      evidence: `${sourceLabel}. Date/time: ${proposal?.dateTime || 'not set'}. Preview metadata only.`,
      safeNext: 'Edit local proposal fields; keep provider calendar write blocked.',
      blocked: 'Provider calendar write, invite send, email send, and runtime scheduling remain blocked.',
      ibalProposal: laneInspector.ibalProposal || 'Ibal may propose calendar follow-up but cannot schedule events.',
      receipts: receipts.length
        ? receipts.map((entry) => `${entry.title}: ${entry.summary} (${entry.limitations})`).join(' ')
        : 'Local calendar proposal receipt will appear after save.',
    };
  }

  if (focusItem?.id?.startsWith('inbox-thread:')) {
    const threadId = focusItem.id.replace('inbox-thread:', '');
    const triage = inboxTriageFor(threadId);
    const reply = replyDraftFor(threadId);
    const proposals = localProposalsForThread(threadId);
    const receipts = localReceiptsForThread(threadId);
    const localParts = [];
    if (reply) localParts.push(`Local reply draft saved (${reply.subject || 'no subject'}).`);
    if (triage.reviewed) localParts.push('Marked reviewed locally.');
    if (triage.deferred) localParts.push('Deferred locally.');
    if (proposals.length) localParts.push(`${proposals.length} local proposal(s) from this thread.`);
    if (receipts.length) localParts.push(`${receipts.length} local receipt preview(s).`);
    const localContext = localParts.length
      ? `${focusInspector.context || focusItem.summary} Local state: ${localParts.join(' ')}`
      : (focusInspector.context || focusItem.summary);
    return {
      kind: focusItem.kind,
      title: focusItem.title,
      summary: focusItem.summary,
      context: localContext,
      why: focusItem.summary,
      evidence: focusInspector.evidence || 'Fixture thread refs only. No private message body loaded.',
      safeNext: reply
        ? 'Review local reply draft and keep send blocked until runtime gates clear.'
        : (focusItem.safeNext || 'Create a local draft or proposal; runtime send remains blocked.'),
      blocked: focusInspector.egressState || focusItem.blocked || 'Send, forward, delete, archive, provider write, and runtime actions remain blocked.',
      ibalProposal: focusInspector.ibalProposal,
      receipts: receipts.length
        ? receipts.map((entry) => `${entry.title}: ${entry.summary} (${entry.limitations})`).join(' ')
        : (focusInspector.receipts || focusItem.receipt),
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

function handleExtensionsAction(action, installId, fixtureId) {
  if (action === 'preview-install') {
    previewInstallExtension(fixtureId);
    renderShell();
    return;
  }
  if (action === 'remove-install') {
    removeExtensionInstall(installId);
    renderShell();
    return;
  }
  if (action === 'select-install') {
    if (!installId) return;
    state.extensions.selectedInstallId = installId;
    state.focusId = `extensions:local:${installId}`;
    saveState();
    renderShell();
    return;
  }
  if (action === 'clear-all') {
    if (window.confirm('Clear all local Extensions preview installs and receipts?')) {
      clearExtensionsPreviewState();
      renderShell();
    }
  }
}

function handleAutomationsAction(action, ruleId) {
  if (action === 'rule-clear') {
    clearLocalAutomationRule(ruleId);
    renderShell();
    return;
  }
  if (action === 'select-rule') {
    if (!ruleId) return;
    state.automations.selectedRuleId = ruleId;
    state.focusId = `automations:local:${ruleId}`;
    saveState();
    renderShell();
    return;
  }
  if (action === 'dry-run') {
    runAutomationDryRun(ruleId);
    renderShell();
    return;
  }
  if (action === 'clear-all') {
    if (window.confirm('Clear all local Automations rules, dry-runs, and receipts?')) {
      clearAutomationsPreviewState();
      renderShell();
    }
  }
}

function handleTasksAction(action, taskId, status) {
  if (action === 'task-clear') {
    clearLocalTask(taskId);
    renderShell();
    return;
  }
  if (action === 'select-task') {
    if (!taskId) return;
    state.tasks.selectedTaskId = taskId;
    state.focusId = `tasks:local:${taskId}`;
    saveState();
    renderShell();
    return;
  }
  if (action === 'set-status') {
    changeTaskStatus(taskId, status);
    renderShell();
    return;
  }
  if (action === 'clear-all') {
    if (window.confirm('Clear all local Tasks preview tasks and receipts?')) {
      clearTasksPreviewState();
      renderShell();
    }
  }
}

function handleCalendarAction(action, proposalId) {
  if (action === 'proposal-clear') {
    clearCalendarProposal(proposalId);
    renderShell();
    return;
  }
  if (action === 'select-proposal') {
    if (!proposalId) return;
    state.calendar.selectedProposalId = proposalId;
    state.focusId = `calendar:local:${proposalId}`;
    saveState();
    renderShell();
    return;
  }
  if (action === 'clear-all') {
    if (window.confirm('Clear all local Calendar preview proposals and receipts?')) {
      clearCalendarPreviewState();
      renderShell();
    }
  }
}

function handleInboxAction(action, threadId) {
  if (action === 'compose-save') return;
  if (action === 'compose-clear') {
    clearComposeDraft();
    renderShell();
    return;
  }
  if (action === 'reply-clear') {
    clearReplyDraft(threadId || state.threadId);
    renderShell();
    return;
  }
  if (action === 'mark-reviewed') {
    markThreadReviewed(threadId || state.threadId);
    renderShell();
    return;
  }
  if (action === 'defer-thread') {
    deferThread(threadId || state.threadId);
    renderShell();
    return;
  }
  if (action === 'task-proposal') {
    createLocalTaskProposal(threadId || state.threadId);
    renderShell();
    return;
  }
  if (action === 'calendar-proposal') {
    createLocalCalendarProposal(threadId || state.threadId);
    renderShell();
    return;
  }
  if (action === 'clear-all') {
    if (window.confirm('Clear all local Inbox preview drafts, triage, proposals, and receipts?')) {
      clearInboxPreviewState();
      renderShell();
    }
  }
}

function bindEvents() {
  window.addEventListener('hashchange', () => {
    syncRoute();
    renderShell();
  });

  document.addEventListener('submit', (event) => {
    const extensionsForm = event.target.closest?.('[data-extensions-form]');
    if (extensionsForm) {
      event.preventDefault();
      const formData = new FormData(extensionsForm);
      const installId = String(formData.get('installId') || '').trim();
      saveExtensionProvision(formData, installId);
      renderShell();
      return;
    }

    const automationsForm = event.target.closest?.('[data-automations-form]');
    if (automationsForm) {
      event.preventDefault();
      const formData = new FormData(automationsForm);
      const ruleId = String(formData.get('ruleId') || '').trim() || null;
      saveLocalAutomationRule(formData, ruleId);
      renderShell();
      return;
    }

    const tasksForm = event.target.closest?.('[data-tasks-form]');
    if (tasksForm) {
      event.preventDefault();
      const formData = new FormData(tasksForm);
      const taskId = String(formData.get('taskId') || '').trim() || null;
      saveLocalTask(formData, taskId);
      renderShell();
      return;
    }

    const calendarForm = event.target.closest?.('[data-calendar-form]');
    if (calendarForm) {
      event.preventDefault();
      const formData = new FormData(calendarForm);
      const proposalId = String(formData.get('proposalId') || '').trim() || null;
      saveCalendarProposal(formData, proposalId);
      renderShell();
      return;
    }

    const form = event.target.closest?.('[data-inbox-form]');
    if (!form) return;
    event.preventDefault();
    const formData = new FormData(form);
    if (form.dataset.inboxForm === 'compose') {
      saveComposeDraft(formData);
      renderShell();
      return;
    }
    if (form.dataset.inboxForm === 'reply') {
      const threadId = form.querySelector('[data-thread-id]')?.dataset.threadId || state.threadId;
      saveReplyDraft(threadId, formData);
      renderShell();
    }
  });

  document.addEventListener('click', (event) => {
    const extensionsAction = event.target.closest?.('[data-extensions-action]');
    if (extensionsAction?.dataset.extensionsAction && extensionsAction.dataset.extensionsAction !== 'provision-save') {
      event.preventDefault();
      handleExtensionsAction(
        extensionsAction.dataset.extensionsAction,
        extensionsAction.dataset.installId,
        extensionsAction.dataset.fixtureId,
      );
      return;
    }

    const automationsAction = event.target.closest?.('[data-automations-action]');
    if (automationsAction?.dataset.automationsAction && automationsAction.dataset.automationsAction !== 'rule-save') {
      event.preventDefault();
      handleAutomationsAction(automationsAction.dataset.automationsAction, automationsAction.dataset.ruleId);
      return;
    }

    const tasksAction = event.target.closest?.('[data-tasks-action]');
    if (tasksAction?.dataset.tasksAction && tasksAction.dataset.tasksAction !== 'task-save') {
      event.preventDefault();
      handleTasksAction(tasksAction.dataset.tasksAction, tasksAction.dataset.taskId, tasksAction.dataset.taskStatus);
      return;
    }

    const calendarAction = event.target.closest?.('[data-calendar-action]');
    if (calendarAction?.dataset.calendarAction && calendarAction.dataset.calendarAction !== 'proposal-save') {
      event.preventDefault();
      handleCalendarAction(calendarAction.dataset.calendarAction, calendarAction.dataset.proposalId);
      return;
    }

    const inboxAction = event.target.closest?.('[data-inbox-action]');
    if (inboxAction?.dataset.inboxAction) {
      event.preventDefault();
      handleInboxAction(inboxAction.dataset.inboxAction, inboxAction.dataset.threadId);
      return;
    }

    const focusTarget = event.target.closest?.('[data-inspector-focus]');
    if (focusTarget?.dataset.inspectorFocus) {
      selectInspectorFocus(focusTarget.dataset.inspectorFocus);
      return;
    }

    const threadButton = event.target.closest?.('[data-thread-id]');
    if (!threadButton?.dataset.threadId || threadButton.dataset.inboxAction) return;
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
