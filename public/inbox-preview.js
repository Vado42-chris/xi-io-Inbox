const DATA_URL = './data/inbox-events.preview.json';
const STORAGE_KEY = 'xiioInbox.preview.state';
const MIGRATION_UI005B_KEY = 'xiioInbox.preview.ui005b';
const LEGACY_STORAGE_KEY = 'xiio-inbox-preview-state-v2';
const STORAGE_SCHEMA_VERSION = 3;

const ROUTE_PREFIX = '#/';
const DEFAULT_LANE = 'home';
const IBAL_LEGACY_LANE = 'ibal';

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
  settings: defaultSettingsOps(),
  ibal: defaultIbalOps(),
  account: defaultAccountOps(),
  drafts: defaultDraftsOps(),
  sentEvents: defaultSentEventsOps(),
  activity: defaultActivityOps(),
};

const ACTIVITY_FILTERS = [
  { id: 'user', label: 'Your activity' },
  { id: 'proposals', label: 'Proposals' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'sent', label: 'Simulated sends' },
  { id: 'build', label: 'Build evidence' },
  { id: 'all', label: 'All' },
];

const TASK_STATUSES = ['proposed', 'active', 'deferred', 'reviewed', 'done-preview'];
const TASK_COLUMN_MAP = {
  proposed: 'Proposed',
  active: 'In progress',
  deferred: 'Blocked',
  reviewed: 'Review',
  'done-preview': 'Done',
};

function defaultInboxOps() {
  return {
    mailboxView: 'inbox',
    accountFilter: null,
    composeDraft: null,
    replyDrafts: {},
    triage: {},
    proposals: [],
    receipts: [],
    composeOpen: false,
    replyOpen: false,
  };
}

function defaultCalendarOps() {
  const now = new Date();
  return {
    selectedProposalId: null,
    selectedDay: null,
    viewMonth: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
    proposals: [],
    receipts: [],
    formOpen: false,
  };
}

function defaultTasksOps() {
  return {
    selectedTaskId: null,
    tasks: [],
    receipts: [],
    formOpen: false,
  };
}

function defaultAutomationsOps() {
  return {
    selectedRuleId: null,
    rules: [],
    receipts: [],
    lastDryRun: null,
    formOpen: false,
  };
}

function defaultExtensionsOps() {
  return {
    selectedInstallId: null,
    installs: [],
    receipts: [],
    formOpen: false,
  };
}

function defaultSettingsOps() {
  return {
    selectedKey: 'user:preferences',
    gateOverrides: {},
    policyOverrides: {},
    userPrefs: {
      displayDensity: 'comfortable',
      defaultMailbox: 'inbox',
      desktopNotifications: false,
    },
    receipts: [],
    formOpen: false,
  };
}

function defaultIbalOps() {
  return {
    open: false,
    prompt: '',
    messages: [],
    receipts: [],
    selectedProposalId: null,
  };
}

function defaultAccountOps() {
  return {
    open: false,
    activeAccountId: null,
    workspaceId: null,
    sessionDisplayName: '',
    sessionNotes: '',
    previewAccounts: [],
    editingAccountId: null,
    accountFormOpen: false,
    receipts: [],
  };
}

function defaultDraftsOps() {
  return {
    items: [],
    selectedDraftId: null,
    receipts: [],
  };
}

function defaultSentEventsOps() {
  return {
    events: [],
    selectedEventId: null,
    receipts: [],
  };
}

function defaultActivityOps() {
  return { filter: 'user' };
}

function laneDisplayLabel(laneId, fallback) {
  if (laneId === 'inbox') return 'Mail';
  if (laneId === 'receipts') return 'Activity';
  return fallback;
}

function previewStateEnvelope() {
  const { composeOpen, replyOpen, ...inboxPersist } = state.inbox;
  const { formOpen: calendarFormOpen, ...calendarPersist } = state.calendar;
  const { formOpen: tasksFormOpen, ...tasksPersist } = state.tasks;
  const { formOpen: automationsFormOpen, ...automationsPersist } = state.automations;
  const { formOpen: extensionsFormOpen, ...extensionsPersist } = state.extensions;
  const { formOpen: settingsFormOpen, ...settingsPersist } = state.settings;
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    laneId: state.laneId,
    threadId: state.threadId,
    focusId: state.focusId,
    inbox: inboxPersist,
    calendar: calendarPersist,
    tasks: tasksPersist,
    automations: automationsPersist,
    extensions: extensionsPersist,
    settings: settingsPersist,
    ibal: state.ibal,
    account: state.account,
    drafts: state.drafts,
    sentEvents: state.sentEvents,
    activity: state.activity,
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
  state.settings = {
    ...defaultSettingsOps(),
    ...(stored.settings || {}),
    gateOverrides: stored.settings?.gateOverrides || {},
    policyOverrides: stored.settings?.policyOverrides || {},
    userPrefs: {
      ...defaultSettingsOps().userPrefs,
      ...(stored.settings?.userPrefs || {}),
    },
    receipts: stored.settings?.receipts || [],
  };
  state.ibal = {
    ...defaultIbalOps(),
    ...(stored.ibal || {}),
    messages: stored.ibal?.messages || [],
    receipts: stored.ibal?.receipts || [],
  };
  state.account = {
    ...defaultAccountOps(),
    ...(stored.account || {}),
    previewAccounts: stored.account?.previewAccounts || [],
    receipts: stored.account?.receipts || [],
  };
  state.drafts = {
    ...defaultDraftsOps(),
    ...(stored.drafts || {}),
    items: stored.drafts?.items || [],
    receipts: stored.drafts?.receipts || [],
  };
  state.sentEvents = {
    ...defaultSentEventsOps(),
    ...(stored.sentEvents || {}),
    events: stored.sentEvents?.events || [],
    receipts: stored.sentEvents?.receipts || [],
  };
  state.activity = {
    ...defaultActivityOps(),
    ...(stored.activity || {}),
  };
  if (state.laneId === IBAL_LEGACY_LANE) {
    state.laneId = DEFAULT_LANE;
    state.focusId = defaultFocusIdForLane(DEFAULT_LANE);
  }
  // Ephemeral UI chrome — do not restore open modals/sheets from storage.
  state.inbox.composeOpen = false;
  state.inbox.replyOpen = false;
  state.calendar.formOpen = false;
  state.tasks.formOpen = false;
  state.automations.formOpen = false;
  state.extensions.formOpen = false;
  state.settings.formOpen = false;
  syncInboxCalendarProposals();
  syncInboxTaskProposals();
  seedSampleDraftsIfNeeded();
}

function migrateDraftItemsFromInbox(inbox) {
  const items = [];
  const now = new Date().toISOString();
  const newDraftId = () => `draft-migrate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const compose = inbox?.composeDraft;
  if (compose?.subject || compose?.body || compose?.to) {
    items.push({
      id: newDraftId(),
      kind: 'compose',
      source_thread_id: null,
      recipients: compose.to ? [compose.to] : [],
      subject: compose.subject || '',
      body: compose.body || '',
      status: 'drafting',
      approval_state: 'none',
      created_at: compose.savedAt || now,
      updated_at: compose.savedAt || now,
    });
  }
  Object.entries(inbox?.replyDrafts || {}).forEach(([threadId, reply]) => {
    if (!reply) return;
    items.push({
      id: newDraftId(),
      kind: 'reply',
      source_thread_id: threadId,
      recipients: reply.to ? [reply.to] : [],
      subject: reply.subject || '',
      body: reply.body || '',
      status: 'drafting',
      approval_state: 'none',
      created_at: reply.savedAt || now,
      updated_at: reply.savedAt || now,
    });
  });
  return items;
}

function upgradePreviewEnvelope(envelope) {
  if (!envelope || envelope.schemaVersion === STORAGE_SCHEMA_VERSION) return envelope;
  if (envelope.schemaVersion === 2) {
    return {
      ...envelope,
      schemaVersion: STORAGE_SCHEMA_VERSION,
      drafts: {
        ...defaultDraftsOps(),
        items: migrateDraftItemsFromInbox(envelope.inbox),
      },
      sentEvents: defaultSentEventsOps(),
    };
  }
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    laneId: envelope.laneId === IBAL_LEGACY_LANE ? DEFAULT_LANE : envelope.laneId,
    threadId: envelope.threadId,
    focusId: envelope.focusId,
    inbox: envelope.inbox || defaultInboxOps(),
    calendar: envelope.calendar || defaultCalendarOps(),
    tasks: envelope.tasks || defaultTasksOps(),
    automations: envelope.automations || defaultAutomationsOps(),
    extensions: envelope.extensions || defaultExtensionsOps(),
    settings: envelope.settings || defaultSettingsOps(),
    ibal: envelope.ibal || defaultIbalOps(),
    account: envelope.account || defaultAccountOps(),
    drafts: envelope.drafts || { ...defaultDraftsOps(), items: migrateDraftItemsFromInbox(envelope.inbox) },
    sentEvents: envelope.sentEvents || defaultSentEventsOps(),
  };
}

function migratePreviewStorage() {
  const canonical = safeParse(localStorage.getItem(STORAGE_KEY) || 'null', null);
  if (canonical?.schemaVersion === STORAGE_SCHEMA_VERSION) return canonical;
  if (canonical) return upgradePreviewEnvelope(canonical);

  const ui005b = safeParse(localStorage.getItem(MIGRATION_UI005B_KEY) || 'null', null);
  if (ui005b) {
    return upgradePreviewEnvelope({
      schemaVersion: 2,
      laneId: ui005b.laneId,
      threadId: ui005b.threadId,
      focusId: ui005b.focusId,
      inbox: ui005b.inbox || defaultInboxOps(),
      calendar: defaultCalendarOps(),
      tasks: defaultTasksOps(),
      automations: defaultAutomationsOps(),
      extensions: defaultExtensionsOps(),
      settings: defaultSettingsOps(),
      ibal: defaultIbalOps(),
      account: defaultAccountOps(),
    });
  }

  const legacy = safeParse(localStorage.getItem(LEGACY_STORAGE_KEY) || '{}', {});
  return upgradePreviewEnvelope({
    schemaVersion: 2,
    laneId: legacy.laneId === IBAL_LEGACY_LANE ? DEFAULT_LANE : legacy.laneId,
    threadId: legacy.threadId,
    focusId: legacy.focusId,
    inbox: defaultInboxOps(),
    calendar: defaultCalendarOps(),
    tasks: defaultTasksOps(),
    automations: defaultAutomationsOps(),
    extensions: defaultExtensionsOps(),
    settings: defaultSettingsOps(),
    ibal: defaultIbalOps(),
    account: defaultAccountOps(),
  });
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

function navLanes() {
  return getLanes().filter((lane) => lane.id !== IBAL_LEGACY_LANE);
}

function laneIds() {
  return new Set(getLanes().map((lane) => lane.id));
}

function routeIdFromHash() {
  return String(window.location.hash || '').replace(ROUTE_PREFIX, '').trim();
}

function laneFromHash() {
  const raw = routeIdFromHash();
  if (raw === IBAL_LEGACY_LANE) return DEFAULT_LANE;
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

function inboxLayoutSection() {
  return sectionByType(activeLaneContent(), 'inbox-layout') || { views: [], accounts: [], threads: [] };
}

function mailboxViewId(label) {
  return String(label || '').trim().toLowerCase().replace(/\s+/g, '-');
}

function threadsForMailboxView() {
  let threads = inboxThreads();
  const filterId = state.inbox.accountFilter;
  if (filterId) {
    const account = allPreviewAccounts().find((entry) => entry.accountId === filterId);
    if (account) {
      threads = threads.filter((thread) => String(thread.sender || '').includes(account.displayName.split(' ')[0])
        || String(thread.sender || '') === account.displayName);
    }
  }
  const view = state.inbox.mailboxView || 'inbox';
  if (view === 'inbox') return threads;
  if (view === 'priority-inbox') {
    return threads.filter((thread) => thread.state === 'needs_review'
      || (thread.labels || []).includes('urgent_thread'));
  }
  if (view === 'needs-reply') {
    return threads.filter((thread) => (thread.labels || []).includes('needs_reply'));
  }
  if (view === 'awaiting-evidence') {
    return threads.filter((thread) => (thread.tags || []).includes('local_verification_required')
      || thread.state === 'needs_review');
  }
  if (view === 'drafts' || view === 'approval-queue') return [];
  if (view === 'provider-gates') {
    return threads.filter((thread) => (thread.labels || []).includes('provider_gate')
      || thread.state === 'provider_blocked');
  }
  return threads;
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
    settings: 'settingsStatusRegion',
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
  state.calendar.formOpen = false;
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
  state.tasks.formOpen = false;
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
  state.automations.formOpen = false;
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
  const sectionIndex = (extensions.sections || []).findIndex((entry) => entry === section);
  return (section?.providers || []).map((provider, index) => ({
    ...provider,
    fixtureId: `ext-fixture:${index}`,
    focusId: `extensions:extension-matrix:${sectionIndex}:${index}`,
  }));
}

function extensionSecretBoundaryItems() {
  return sectionByType(getPayload().laneContent?.extensions || {}, 'secret-boundary')?.items || [];
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
  state.extensions.formOpen = false;
  saveState();
  setStatusMessage('Local provision notes saved. No credentials stored.', 'extensions');
}

function clearExtensionsPreviewState() {
  state.extensions = defaultExtensionsOps();
  saveState();
  setStatusMessage('All local Extensions preview state cleared. Fixture providers unchanged.', 'extensions');
}

function settingsLaneContent() {
  return getPayload().laneContent?.settings || {};
}

function settingsGateFixtures() {
  const section = sectionByType(settingsLaneContent(), 'settings-gates');
  return (section?.gates || []).map((gate, index) => ({
    ...gate,
    gateKey: `gate:${index}`,
  }));
}

function settingsPolicyFixtures() {
  const section = sectionByType(settingsLaneContent(), 'policy-list');
  return (section?.policies || []).map((policy) => ({
    ...policy,
    policyKey: policy.label,
  }));
}

function gateOverrideFor(gateKey) {
  return state.settings.gateOverrides?.[gateKey] || null;
}

function policyOverrideFor(policyKey) {
  return state.settings.policyOverrides?.[policyKey] || null;
}

function addSettingsReceipt({ type, title, key, summary }) {
  const receipt = {
    id: createLocalId('receipt'),
    type,
    title,
    key: key || null,
    summary,
    createdAt: new Date().toISOString(),
    limitations: 'Local preview only. No runtime policy apply, provider change, or credential storage occurred.',
  };
  state.settings.receipts = [receipt, ...(state.settings.receipts || [])].slice(0, 20);
  return receipt;
}

function saveSettingsGate(formData, gateKey) {
  if (!gateKey) return;
  const gate = settingsGateFixtures().find((entry) => entry.gateKey === gateKey);
  if (!gate) return;
  const notes = String(formData.get('notes') || '').trim();
  const previewControl = String(formData.get('previewControl') || '').trim();
  state.settings.gateOverrides = {
    ...state.settings.gateOverrides,
    [gateKey]: { notes, previewControl, updatedAt: new Date().toISOString() },
  };
  addSettingsReceipt({
    type: 'gate',
    title: 'Local gate planning notes saved',
    key: gateKey,
    summary: `${gate.label}: ${notes || previewControl || '(updated)'}`,
  });
  state.settings.selectedKey = gateKey;
  state.focusId = `settings:local:gate:${gateKey}`;
  state.settings.formOpen = false;
  saveState();
  setStatusMessage('Local gate notes saved. Runtime gates remain blocked.', 'settings');
}

function saveSettingsUserPrefs(formData) {
  const displayDensity = String(formData.get('displayDensity') || 'comfortable').trim();
  const defaultMailbox = String(formData.get('defaultMailbox') || 'inbox').trim();
  const desktopNotifications = formData.get('desktopNotifications') === 'on';
  state.settings.userPrefs = {
    displayDensity: ['compact', 'comfortable', 'spacious'].includes(displayDensity) ? displayDensity : 'comfortable',
    defaultMailbox: ['inbox', 'drafts', 'approval-queue'].includes(defaultMailbox) ? defaultMailbox : 'inbox',
    desktopNotifications,
  };
  if (state.laneId === 'inbox' && !state.inbox.mailboxView) {
    state.inbox.mailboxView = state.settings.userPrefs.defaultMailbox;
  }
  addSettingsReceipt({
    type: 'preferences',
    key: 'user:preferences',
    title: 'User preferences saved',
    summary: `${state.settings.userPrefs.displayDensity} density · default ${state.settings.userPrefs.defaultMailbox}`,
  });
  saveState();
  setStatusMessage('User preferences saved locally. Runtime apply remains blocked.');
}

function saveSettingsPolicy(formData, policyKey) {
  if (!policyKey) return;
  const policy = settingsPolicyFixtures().find((entry) => entry.policyKey === policyKey);
  if (!policy) return;
  const previewValue = String(formData.get('previewValue') || '').trim();
  const notes = String(formData.get('notes') || '').trim();
  state.settings.policyOverrides = {
    ...state.settings.policyOverrides,
    [policyKey]: { previewValue, notes, updatedAt: new Date().toISOString() },
  };
  addSettingsReceipt({
    type: 'policy',
    title: 'Local policy preview value saved',
    key: policyKey,
    summary: `${policyKey}: ${previewValue || policy.value} — ${notes || 'no notes'}`,
  });
  state.settings.selectedKey = policyKey;
  state.focusId = `settings:local:policy:${policyKey}`;
  state.settings.formOpen = false;
  saveState();
  setStatusMessage('Local policy preview saved. Runtime policy apply remains blocked.', 'settings');
}

function clearSettingsPreviewState() {
  state.settings = defaultSettingsOps();
  saveState();
  setStatusMessage('All local Settings preview state cleared. Fixture gates/policies unchanged.', 'settings');
}

function ibalFixtureCatalog() {
  const content = getPayload().laneContent?.ibal || {};
  const board = sectionByType(content, 'ibal-board');
  const items = [];
  (board?.groups || []).forEach((group) => {
    (group.items || []).forEach((item) => {
      items.push({ ...item, groupLabel: group.label });
    });
  });
  const home = getPayload().laneContent?.home || {};
  const nextSafe = sectionByType(home, 'next-safe-action');
  if (nextSafe?.action) {
    items.push({
      title: nextSafe.action.title,
      summary: nextSafe.action.summary,
      state: 'proposal_only',
      groupLabel: 'home next safe action',
      criteria: nextSafe.action.criteria || [],
    });
  }
  return items;
}

function buildIbalProposalResponse(prompt) {
  const focus = activeInspectableItem();
  const catalog = ibalFixtureCatalog();
  const normalized = String(prompt || '').toLowerCase();
  let pick = catalog[0] || null;
  if (normalized.includes('block') || normalized.includes('gate')) {
    pick = catalog.find((item) => (
      String(item.title || '').toLowerCase().includes('block')
      || String(item.groupLabel || '').toLowerCase().includes('blocker')
    )) || pick;
  } else if (normalized.includes('receipt') || normalized.includes('proof')) {
    pick = catalog.find((item) => String(item.title || '').toLowerCase().includes('receipt')
      || String(item.title || '').toLowerCase().includes('proof')) || pick;
  } else if (focus?.kind) {
    const kindToken = String(focus.kind).split(' ')[0].toLowerCase();
    pick = catalog.find((item) => String(item.summary || '').toLowerCase().includes(kindToken)) || pick;
  }
  const proposal = {
    id: createLocalId('ibal-prop'),
    title: pick?.title || 'Review current selection',
    recommendation: pick?.summary || focus?.safeNext || 'Review fixture context before any runtime action.',
    why: focus?.summary || pick?.summary || 'Context-scoped proposal from preview fixtures.',
    evidence: `Lane: ${state.laneId}. Focus: ${focus?.title || 'none'}. Source: ${pick?.groupLabel || 'fixture'}.`,
    blockers: focus?.blocked || 'Send, provider connect, automation execution, and repo mutation remain blocked.',
    sourceLanes: [state.laneId],
    safeNext: focus?.safeNext || pick?.title || 'Save as local draft if applicable.',
    state: 'proposal_only',
    criteria: pick?.criteria || [],
  };
  return proposal;
}

function addIbalReceipt({ title, summary, proposalId }) {
  const receipt = {
    id: createLocalId('receipt'),
    type: 'ibal-proposal',
    title,
    proposalId: proposalId || null,
    summary,
    createdAt: new Date().toISOString(),
    limitations: 'Local preview only. No model routing, execution, or provider write occurred.',
  };
  state.ibal.receipts = [receipt, ...(state.ibal.receipts || [])].slice(0, 20);
  return receipt;
}

function submitIbalPrompt(promptText) {
  const prompt = String(promptText || '').trim();
  if (!prompt) return;
  const proposal = buildIbalProposalResponse(prompt);
  const userMsg = { id: createLocalId('ibal-msg'), role: 'user', text: prompt, createdAt: new Date().toISOString() };
  const ibalMsg = {
    id: createLocalId('ibal-msg'),
    role: 'ibal',
    text: proposal.recommendation,
    proposal,
    createdAt: new Date().toISOString(),
  };
  state.ibal.messages = [...(state.ibal.messages || []), userMsg, ibalMsg].slice(-20);
  state.ibal.prompt = '';
  state.ibal.open = true;
  state.ibal.selectedProposalId = proposal.id;
  addIbalReceipt({ title: 'Ibal proposal generated', summary: proposal.title, proposalId: proposal.id });
  saveState();
}

function toggleIbalConcierge(forceOpen) {
  state.ibal.open = typeof forceOpen === 'boolean' ? forceOpen : !state.ibal.open;
  if (state.ibal.open) state.account.open = false;
  saveState();
}

function saveIbalProposalReceipt(proposalId) {
  const message = (state.ibal.messages || []).find((entry) => entry.proposal?.id === proposalId);
  if (!message?.proposal) return;
  addIbalReceipt({
    title: 'Ibal proposal receipt saved',
    summary: message.proposal.title,
    proposalId,
  });
  state.ibal.selectedProposalId = proposalId;
  saveState();
}

function clearIbalPreviewState() {
  state.ibal = defaultIbalOps();
  saveState();
}

function accountFixtures() {
  return getPayload().accounts || [];
}

function allPreviewAccounts() {
  return state.account.previewAccounts || [];
}

function isValidEmailAddress(email) {
  if (!email || typeof email !== 'string') return false;
  const parts = email.split('@');
  return parts.length === 2 && parts[0].length > 0 && parts[1].includes('.');
}

function seedSampleDraftsIfNeeded() {
  if (allDraftItems().length) return;
  const now = new Date().toISOString();
  state.drafts.items = [
    {
      id: 'draft-sample-compose',
      kind: 'compose',
      source_thread_id: null,
      recipients: ['family.sender@example.preview'],
      subject: 'Re: School pickup Friday',
      body: 'I can cover pickup at 3:15. Please confirm if that works.',
      status: 'drafting',
      approval_state: 'none',
      task_hint: 'After send: create calendar hold + transport task',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'draft-sample-reply',
      kind: 'reply',
      source_thread_id: 'thread-family-safety-preview',
      recipients: ['family.sender@example.preview'],
      subject: 'Re: Urgent family transport thread',
      body: 'Reviewing options locally. Will propose calendar hold and task follow-up before any send.',
      status: 'needs_review',
      approval_state: 'queued',
      task_hint: 'Queued draft → approve → simulate send → task proposal',
      created_at: now,
      updated_at: now,
    },
    {
      id: 'draft-sample-approved',
      kind: 'reply',
      source_thread_id: 'thread-github-review-preview',
      recipients: ['notifications@github.preview'],
      subject: 'Re: GitHub review reminder',
      body: 'Acknowledged. Scheduling review block and local task proposal.',
      status: 'approved',
      approval_state: 'approved',
      task_hint: 'Ready for Simulate send (dry-run)',
      created_at: now,
      updated_at: now,
    },
  ];
  state.inbox.replyDrafts['thread-family-safety-preview'] = {
    to: 'family.sender@example.preview',
    subject: 'Re: Urgent family transport thread',
    body: state.drafts.items[1].body,
    savedAt: now,
    state: 'local_preview_draft',
  };
}

function savePendingAccountConnect(formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!isValidEmailAddress(email)) {
    setStatusMessage('Enter a valid email address (one @ symbol).');
    return;
  }
  const id = `gmail-${email.replace(/[^a-z0-9]+/gi, '-')}`;
  if (allPreviewAccounts().some((entry) => entry.email === email || entry.accountId === id)) {
    setStatusMessage('This email is already listed. Use Connect Gmail to finish setup.');
    return;
  }
  const row = {
    accountId: id,
    email,
    displayName: email,
    providerId: 'gmail',
    syncState: 'awaiting_local_connect',
    privacyProfile: 'private_mail',
    counts: { unread: 0, needsReply: 0, drafts: 0, blocked: 0 },
  };
  state.account.previewAccounts = [...allPreviewAccounts(), row];
  state.account.activeAccountId = id;
  state.account.editingAccountId = null;
  state.account.accountFormOpen = false;
  addAccountReceipt({
    type: 'account',
    title: 'Gmail account queued for connect',
    summary: `${email} — run local adapter: cd tools/gmail && node cli.js connect`,
  });
  saveState();
  setStatusMessage('Account queued. Connect via tools/gmail CLI (metadata only). Tokens never stored in this preview.');
}

function removePreviewAccount(accountId) {
  state.account.previewAccounts = allPreviewAccounts().filter((entry) => entry.accountId !== accountId);
  if (state.account.activeAccountId === accountId) {
    state.account.activeAccountId = state.account.previewAccounts[0]?.accountId || null;
  }
  if (state.inbox.accountFilter === accountId) state.inbox.accountFilter = null;
  addAccountReceipt({
    type: 'account',
    title: 'Preview account removed',
    summary: `Removed ${accountId}. Fixture threads unchanged.`,
  });
  saveState();
}

function workspaceOptions() {
  const workspace = getPayload().workspace || {};
  return [
    { id: workspace.workspaceId || 'xiio-inbox-preview', label: workspace.displayName || 'Personal operations preview' },
    { id: 'project-ops-preview', label: 'Project operations preview' },
  ];
}

function selectedAccountFixture() {
  const accounts = allPreviewAccounts();
  const activeId = state.account.activeAccountId || accounts[0]?.accountId || null;
  return accounts.find((entry) => entry.accountId === activeId) || accounts[0] || null;
}

function activeWorkspaceLabel() {
  const options = workspaceOptions();
  const activeId = state.account.workspaceId || options[0]?.id || null;
  return options.find((entry) => entry.id === activeId)?.label || options[0]?.label || 'Preview workspace';
}

function activeSessionDisplayName() {
  return state.account.sessionDisplayName
    || selectedAccountFixture()?.displayName
    || getPayload().workspace?.activeAccount
    || 'Preview account';
}

function addAccountReceipt({ type, title, summary }) {
  const receipt = {
    id: createLocalId('receipt'),
    type,
    title,
    summary,
    createdAt: new Date().toISOString(),
    limitations: 'Local preview only. No OAuth, credentials, or real auth backend involved.',
  };
  state.account.receipts = [receipt, ...(state.account.receipts || [])].slice(0, 20);
  return receipt;
}

function switchPreviewAccount(accountId) {
  const account = allPreviewAccounts().find((entry) => entry.accountId === accountId);
  if (!account) return;
  state.account.activeAccountId = accountId;
  addAccountReceipt({
    type: 'switch',
    title: 'Preview account switched',
    summary: `${account.displayName} (${account.providerId}) — preview session only.`,
  });
  saveState();
}

function savePreviewSession(formData) {
  const workspaceId = String(formData.get('workspaceId') || '').trim();
  const sessionDisplayName = String(formData.get('sessionDisplayName') || '').trim();
  const sessionNotes = String(formData.get('sessionNotes') || '').trim();
  state.account.workspaceId = workspaceId || state.account.workspaceId;
  state.account.sessionDisplayName = sessionDisplayName;
  state.account.sessionNotes = sessionNotes;
  addAccountReceipt({
    type: 'session',
    title: 'Preview session saved',
    summary: `${activeWorkspaceLabel()} · ${sessionDisplayName || activeSessionDisplayName()}`,
  });
  saveState();
}

function toggleAccountSession(forceOpen) {
  state.account.open = typeof forceOpen === 'boolean' ? forceOpen : !state.account.open;
  if (state.account.open) state.ibal.open = false;
  saveState();
}

function clearAccountPreviewState() {
  state.account = defaultAccountOps();
  saveState();
}

function ensureAccountDefaults() {
  if (!state.account.workspaceId) {
    state.account.workspaceId = workspaceOptions()[0]?.id || null;
  }
}

function gmailConnectInstructions() {
  return '1) Place OAuth client at secrets/gmail-oauth-client.json\n2) cd tools/gmail && npm install\n3) node cli.js connect\n4) node cli.js profile && node cli.js labels-counts\nMetadata only — no send, no bodies in repo.';
}

function selectedIbalProposal() {
  const messages = state.ibal.messages || [];
  const match = messages.find((entry) => entry.proposal?.id === state.ibal.selectedProposalId);
  return match?.proposal || messages.filter((entry) => entry.proposal).at(-1)?.proposal || null;
}

function inboxTriageFor(threadId) {
  return state.inbox.triage[threadId] || { reviewed: false, deferred: false };
}

function allDraftItems() {
  return state.drafts?.items || [];
}

function draftById(draftId) {
  return allDraftItems().find((draft) => draft.id === draftId) || null;
}

function draftForThread(threadId) {
  return allDraftItems().find((draft) => draft.kind === 'reply' && draft.source_thread_id === threadId) || null;
}

function draftRecipientsLabel(draft) {
  return (draft?.recipients || []).join(', ');
}

function replyDraftFor(threadId) {
  const draft = draftForThread(threadId);
  if (draft) {
    return {
      id: draft.id,
      to: draftRecipientsLabel(draft),
      subject: draft.subject,
      body: draft.body,
      savedAt: draft.updated_at,
      state: 'local_preview_draft',
    };
  }
  return state.inbox.replyDrafts[threadId] || null;
}

function draftsForMailboxView() {
  const view = state.inbox.mailboxView || 'inbox';
  if (view === 'drafts') {
    return allDraftItems().filter((draft) => draft.approval_state === 'none' && draft.status !== 'sent');
  }
  if (view === 'approval-queue') {
    return allDraftItems().filter((draft) => ['queued', 'approved'].includes(draft.approval_state) && draft.status !== 'sent');
  }
  return [];
}

function selectedDraft() {
  const visible = draftsForMailboxView();
  return draftById(state.drafts.selectedDraftId)
    || visible.find((draft) => draft.id === state.drafts.selectedDraftId)
    || visible[0]
    || null;
}

function addDraftReceipt({ type, title, draftId, summary }) {
  const receipt = {
    id: createLocalId('receipt'),
    type,
    title,
    draftId: draftId || null,
    summary,
    createdAt: new Date().toISOString(),
    limitations: 'Local preview only. No provider write, send, or runtime action occurred.',
  };
  state.drafts.receipts = [receipt, ...(state.drafts.receipts || [])].slice(0, 20);
  return receipt;
}

function upsertDraftFromForm({ kind, threadId, formData, draftId }) {
  const to = String(formData.get('to') || '').trim();
  const subject = String(formData.get('subject') || '').trim();
  const body = String(formData.get('body') || '').trim();
  const now = new Date().toISOString();
  let draft = draftId ? draftById(draftId) : null;
  if (!draft && kind === 'reply') draft = draftForThread(threadId);
  if (!draft && kind === 'compose') {
    draft = allDraftItems().find((item) => item.kind === 'compose' && item.approval_state === 'none') || null;
  }
  if (!draft) {
    draft = {
      id: createLocalId('draft'),
      kind,
      source_thread_id: threadId || null,
      recipients: to ? [to] : [],
      subject,
      body,
      status: 'drafting',
      approval_state: 'none',
      created_at: now,
      updated_at: now,
    };
    state.drafts.items = [draft, ...allDraftItems()];
  } else {
    draft.recipients = to ? [to] : [];
    draft.subject = subject;
    draft.body = body;
    draft.updated_at = now;
    if (draft.status === 'archived') draft.status = 'drafting';
  }
  if (kind === 'reply' && threadId) {
    state.inbox.replyDrafts[threadId] = {
      to,
      subject,
      body,
      savedAt: now,
      state: 'local_preview_draft',
    };
  }
  if (kind === 'compose') {
    state.inbox.composeDraft = { to, subject, body, savedAt: now, state: 'local_preview_draft' };
    state.drafts.selectedDraftId = draft.id;
  }
  return draft;
}

function queueDraftForApproval(draftId) {
  const draft = draftById(draftId);
  if (!draft) return;
  draft.approval_state = 'queued';
  draft.status = 'needs_review';
  draft.updated_at = new Date().toISOString();
  addDraftReceipt({
    type: 'approval',
    title: 'Draft submitted to approval queue',
    draftId: draft.id,
    summary: `Subject: ${draft.subject || '(none)'}. Send remains blocked in Tier 1.`,
  });
  saveState();
  setStatusMessage('Draft queued for approval. Send remains blocked.', 'inbox');
}

function approveDraftForSend(draftId) {
  const draft = draftById(draftId);
  if (!draft || draft.approval_state !== 'queued') return;
  draft.approval_state = 'approved';
  draft.status = 'approved';
  draft.updated_at = new Date().toISOString();
  addDraftReceipt({
    type: 'approval',
    title: 'Draft approved for send (preview)',
    draftId: draft.id,
    summary: 'Human approval recorded locally. Provider send blocked in Tier 1.',
  });
  saveState();
  setStatusMessage('Draft approved for send. Provider send remains blocked.', 'inbox');
}

function dequeueDraft(draftId) {
  const draft = draftById(draftId);
  if (!draft) return;
  draft.approval_state = 'none';
  draft.status = 'drafting';
  draft.updated_at = new Date().toISOString();
  addDraftReceipt({
    type: 'draft',
    title: 'Draft removed from approval queue',
    draftId: draft.id,
    summary: 'Returned to drafting. No send occurred.',
  });
  saveState();
  setStatusMessage('Draft returned to drafting.');
}

function deleteDraft(draftId) {
  const draft = draftById(draftId);
  if (!draft) return;
  state.drafts.items = allDraftItems().filter((item) => item.id !== draftId);
  if (draft.source_thread_id) delete state.inbox.replyDrafts[draft.source_thread_id];
  if (state.drafts.selectedDraftId === draftId) state.drafts.selectedDraftId = null;
  addDraftReceipt({
    type: 'draft',
    title: 'Draft deleted locally',
    draftId: draft.id,
    summary: `Removed ${draft.kind} draft. Fixture threads unchanged.`,
  });
  saveState();
  setStatusMessage('Draft deleted locally.');
}

function preSendChecksForDraft(draft) {
  if (!draft) return [];
  const checks = [];
  checks.push(draft.recipients?.length ? 'Recipients present' : 'Missing recipients');
  checks.push(draft.subject?.trim() ? 'Subject present' : 'Missing subject');
  checks.push(draft.body?.trim() ? 'Body present' : 'Missing body');
  checks.push('Provider send blocked (Tier 1)');
  return checks;
}

function queuedDrafts() {
  return allDraftItems().filter((draft) => draft.approval_state === 'queued');
}

function approvedDrafts() {
  return allDraftItems().filter((draft) => draft.approval_state === 'approved');
}

function approveAllQueuedDrafts() {
  const queued = queuedDrafts();
  if (!queued.length) {
    setStatusMessage('No queued drafts to approve.');
    return;
  }
  const sharedRisks = [];
  if (queued.some((draft) => !draft.recipients?.length)) sharedRisks.push('Some drafts missing recipients');
  if (queued.some((draft) => !draft.subject?.trim())) sharedRisks.push('Some drafts missing subject');
  queued.forEach((draft) => approveDraftForSend(draft.id));
  addDraftReceipt({
    type: 'approval',
    title: 'Batch approve (preview)',
    draftId: null,
    summary: `Approved ${queued.length} draft(s). Shared risks: ${sharedRisks.join('; ') || 'none noted'}. Send remains blocked.`,
  });
  saveState();
  setStatusMessage(`Batch approved ${queued.length} draft(s). Send remains blocked.`, 'inbox');
}

function allSentEvents() {
  return state.sentEvents?.events || [];
}

function sentEventById(eventId) {
  return allSentEvents().find((event) => event.id === eventId) || null;
}

function buildPostSendPlan(draft) {
  const steps = [
    { action: 'create_receipt', summary: 'Append simulated send receipt to local ledger' },
    { action: 'notify_user', summary: 'Show dry-run status message (no provider delivery)' },
  ];
  if (draft?.source_thread_id) {
    steps.push({ action: 'archive_thread', summary: `Mark source thread ${draft.source_thread_id} reviewed locally` });
    steps.push({ action: 'follow_up_task', summary: 'Create follow-up task proposal (local only)' });
    steps.push({ action: 'calendar_event', summary: 'Create calendar follow-up proposal (local only)' });
  }
  steps.push({ action: 'post_send_automation', summary: 'Dry-run post-send automation recipes (execution blocked)' });
  return steps;
}

function sendConsequencePreview(draft) {
  return buildPostSendPlan(draft).map((step) => step.summary);
}

function addSentEventReceipt({ type, title, eventId, summary }) {
  const receipt = {
    id: createLocalId('receipt'),
    type,
    title,
    eventId: eventId || null,
    summary,
    createdAt: new Date().toISOString(),
    limitations: 'Simulated send only. No provider write or delivery occurred.',
  };
  state.sentEvents.receipts = [receipt, ...(state.sentEvents.receipts || [])].slice(0, 20);
  return receipt;
}

function linkPostSendProposals(draft, eventId) {
  const links = [];
  const now = new Date().toISOString();
  if (!draft?.source_thread_id) return links;
  const thread = inboxThreads().find((entry) => entry.id === draft.source_thread_id);
  if (!thread) return links;
  state.inbox.triage[draft.source_thread_id] = {
    ...inboxTriageFor(draft.source_thread_id),
    reviewed: true,
    deferred: false,
    reviewedAt: now,
  };
  const taskId = createLocalId('task');
  state.tasks.tasks = [{
    id: taskId,
    title: `Follow-up: ${draft.subject || thread.title}`,
    status: 'proposed',
    dueDate: '',
    notes: 'Post-send plan preview (simulated). Provider sync blocked.',
    sourceRef: `sent-event:${eventId}`,
    sourceType: 'send_simulation',
    threadId: draft.source_thread_id,
    createdAt: now,
    updatedAt: now,
    state: 'local_preview_task',
  }, ...(state.tasks.tasks || [])];
  links.push({ type: 'task', id: taskId });
  const calId = createLocalId('cal');
  state.calendar.proposals = [{
    id: calId,
    title: `Follow-up hold: ${draft.subject || thread.title}`,
    dateTime: '',
    notes: 'Post-send calendar proposal (simulated). Provider write blocked.',
    sourceRef: `sent-event:${eventId}`,
    sourceType: 'send_simulation',
    threadId: draft.source_thread_id,
    createdAt: now,
    updatedAt: now,
    state: 'local_proposal',
  }, ...(state.calendar.proposals || [])];
  links.push({ type: 'calendar', id: calId });
  return links;
}

function simulateSendDraft(draftId) {
  const draft = draftById(draftId);
  if (!draft || draft.approval_state !== 'approved' || draft.status === 'sent') {
    setStatusMessage('Only approved drafts can simulate send.');
    return null;
  }
  const now = new Date().toISOString();
  const plan = buildPostSendPlan(draft);
  const eventId = createLocalId('sent');
  const links = linkPostSendProposals(draft, eventId);
  draft.post_send_plan = plan;
  draft.task_links = links.filter((link) => link.type === 'task').map((link) => link.id);
  draft.status = 'sent';
  draft.sent_at = now;
  draft.updated_at = now;
  const event = {
    id: eventId,
    draft_id: draft.id,
    source_thread_id: draft.source_thread_id,
    subject: draft.subject,
    recipients: draft.recipients,
    simulated: true,
    post_send_plan: plan,
    task_links: draft.task_links,
    created_at: now,
  };
  state.sentEvents.events = [event, ...allSentEvents()].slice(0, 30);
  state.sentEvents.selectedEventId = eventId;
  addDraftReceipt({
    type: 'post_send_plan',
    title: 'Send simulated (dry-run)',
    draftId: draft.id,
    summary: `Post-send plan recorded. ${plan.length} step(s). Provider send did not occur.`,
  });
  addSentEventReceipt({
    type: 'post_send_plan',
    title: 'Simulated send event',
    eventId,
    summary: `Draft ${draft.id} → sent-event ${eventId}. Downstream proposals linked locally.`,
  });
  saveState();
  setStatusMessage('Send simulated (dry-run). View event in Activity lane.', 'inbox');
  return event;
}

function inboxCommandRailMode() {
  if (state.laneId === 'receipts') return 'sent';
  if (state.laneId !== 'inbox') return null;
  const view = state.inbox.mailboxView || 'inbox';
  if (view === 'approval-queue') return 'batch';
  if (state.drafts.selectedDraftId) return 'draft';
  if (state.threadId) return 'thread';
  return 'lane';
}

function localReceiptsForThread(threadId) {
  return (state.inbox.receipts || []).filter((receipt) => !threadId || receipt.threadId === threadId);
}

function localProposalsForThread(threadId) {
  return (state.inbox.proposals || []).filter((proposal) => proposal.threadId === threadId);
}

function linkedTasksForThread(threadId) {
  if (!threadId) return [];
  return (state.tasks.tasks || []).filter(
    (task) => task.threadId === threadId || task.sourceRef === `inbox-thread:${threadId}`,
  );
}

function renderRailOutcomesBlock({ threadId, draft } = {}) {
  const resolvedThreadId = threadId || draft?.source_thread_id || null;
  const tasks = resolvedThreadId ? linkedTasksForThread(resolvedThreadId) : [];
  const proposals = resolvedThreadId ? localProposalsForThread(resolvedThreadId) : [];
  const calendarProposals = proposals.filter((proposal) => proposal.type === 'calendar');
  const hint = draft?.task_hint;
  const lines = [];
  if (hint) lines.push(`Draft flow: ${hint}`);
  tasks.forEach((task) => lines.push(`Task: ${task.title} (${label(task.status || task.state)})`));
  calendarProposals.forEach((proposal) => lines.push(`Calendar: ${proposal.title}`));
  if (!lines.length && !resolvedThreadId && !draft) return '';
  return `
    <section class="inspector-block inspector-outcomes">
      <h3>Outcomes</h3>
      ${lines.length
    ? `<ul class="rail-outcome-list">${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`
    : '<p class="form-hint">No linked tasks yet. Use <strong>Add task</strong> in Commands.</p>'}
      <div class="rail-outcome-links">
        <a class="lane-link is-inline" href="#/tasks">Open Tasks</a>
        <a class="lane-link is-inline" href="#/calendar">Open Calendar</a>
        <a class="lane-link is-inline" href="#/receipts">Open Activity</a>
      </div>
    </section>
  `;
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
  const draft = upsertDraftFromForm({ kind: 'compose', threadId: null, formData });
  addLocalReceipt({
    type: 'draft',
    title: 'Local compose draft saved',
    threadId: null,
    summary: `Subject: ${draft.subject || '(none)'}. Preview draft only.`,
  });
  addDraftReceipt({
    type: 'draft',
    title: 'Compose draft object saved',
    draftId: draft.id,
    summary: `Draft ${draft.id} in drafts namespace (schema v3).`,
  });
  state.inbox.composeOpen = false;
  saveState();
  setStatusMessage('Draft saved. Send remains blocked.', 'inbox');
}

function clearComposeDraft() {
  state.inbox.composeDraft = null;
  state.drafts.items = allDraftItems().filter((draft) => !(draft.kind === 'compose' && draft.approval_state === 'none'));
  saveState();
  setStatusMessage('Compose draft cleared.');
}

function saveReplyDraft(threadId, formData, draftId) {
  if (!threadId) return;
  const draft = upsertDraftFromForm({ kind: 'reply', threadId, formData, draftId });
  addLocalReceipt({
    type: 'draft',
    title: 'Local reply draft saved',
    threadId,
    summary: `Reply draft for fixture thread ${threadId}. Not sent.`,
  });
  addDraftReceipt({
    type: 'draft',
    title: 'Reply draft object saved',
    draftId: draft.id,
    summary: `Draft ${draft.id} linked to thread ${threadId}.`,
  });
  saveState();
  setStatusMessage('Local reply draft saved. Send remains blocked.');
}

function clearReplyDraft(threadId) {
  if (!threadId) return;
  const draft = draftForThread(threadId);
  if (draft) deleteDraft(draft.id);
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
  state.drafts = defaultDraftsOps();
  seedSampleDraftsIfNeeded();
  saveState();
  setStatusMessage('All local Inbox preview state cleared. Sample drafts re-seeded.');
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
  const raw = routeIdFromHash();
  if (raw === IBAL_LEGACY_LANE) {
    state.ibal.open = true;
    window.location.hash = `${ROUTE_PREFIX}${DEFAULT_LANE}`;
    state.laneId = DEFAULT_LANE;
    state.focusId = defaultFocusIdForLane(DEFAULT_LANE);
    saveState();
    return;
  }
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
  const raw = routeIdFromHash();
  if (raw === IBAL_LEGACY_LANE) {
    state.ibal.open = true;
    window.location.hash = `${ROUTE_PREFIX}${DEFAULT_LANE}`;
    state.laneId = DEFAULT_LANE;
    state.focusId = defaultFocusIdForLane(DEFAULT_LANE);
    saveState();
    return;
  }
  if (!window.location.hash || !laneIds().has(raw)) {
    window.location.hash = `${ROUTE_PREFIX}${DEFAULT_LANE}`;
    state.laneId = DEFAULT_LANE;
    saveState();
  }
}

function selectInboxThread(threadId) {
  if (!threadId || !inboxThreads().some((thread) => thread.id === threadId)) return;
  state.threadId = threadId;
  state.drafts.selectedDraftId = null;
  state.focusId = `inbox-thread:${threadId}`;
  state.inbox.replyOpen = false;
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
    const view = state.inbox.mailboxView || 'inbox';
    if (view === 'drafts' || view === 'approval-queue') {
      const draft = selectedDraft();
      return draft ? `inbox-draft:${draft.id}` : 'lane:inbox';
    }
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
  if (laneId === 'settings') {
    const key = state.settings.selectedKey;
    if (key?.startsWith('gate:')) return `settings:local:gate:${key}`;
    if (key) return `settings:local:policy:${key}`;
    const firstGate = settingsGateFixtures()[0];
    return firstGate ? `settings:local:gate:${firstGate.gateKey}` : 'lane:settings';
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
    allDraftItems().forEach((draft) => {
      items.push({
        id: `inbox-draft:${draft.id}`,
        kind: 'draft',
        title: draft.subject || '(no subject)',
        summary: `${draft.kind} draft · ${label(draft.status || 'drafting')}`,
        meta: draft.approval_state !== 'none' ? `Approval: ${draft.approval_state}` : 'Not queued',
        safeNext: draft.approval_state === 'approved'
          ? 'Send blocked in Tier 1; post-send plan preview ships in UI-007C.'
          : 'Edit draft or submit for approval queue.',
        blocked: 'Send, forward, provider write, and runtime execution remain blocked.',
        receipt: 'Draft receipts stored in drafts namespace.',
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

  if (laneId === 'receipts') {
    allSentEvents().forEach((event) => {
      items.push({
        id: `sent-event:${event.id}`,
        kind: 'sent event (simulated)',
        title: event.subject || 'Simulated send',
        summary: `Dry-run ${event.created_at}. Draft ${event.draft_id}.`,
        meta: event.simulated ? 'simulated' : 'preview',
        safeNext: 'Inspect post-send plan and linked proposals.',
        blocked: 'Provider delivery and runtime replay remain blocked.',
        receipt: 'Sent-event receipt in sentEvents namespace.',
      });
    });
  }

  if (laneId === 'settings') {
    settingsGateFixtures().forEach((gate) => {
      const override = gateOverrideFor(gate.gateKey);
      if (!override) return;
      items.push({
        id: `settings:local:gate:${gate.gateKey}`,
        kind: 'local gate override',
        title: gate.label,
        summary: override.notes || override.previewControl || 'Local gate planning notes.',
        meta: override.previewControl || gate.control,
        state: gate.state,
        safeNext: 'Refine local gate planning; runtime connect remains blocked.',
        blocked: 'Provider connect, credential storage, and runtime policy apply remain blocked.',
        receipt: 'Gate planning receipt preview available.',
      });
    });
    settingsPolicyFixtures().forEach((policy) => {
      const override = policyOverrideFor(policy.policyKey);
      if (!override) return;
      items.push({
        id: `settings:local:policy:${policy.policyKey}`,
        kind: 'local policy override',
        title: policy.label,
        summary: override.notes || policy.summary,
        meta: override.previewValue || policy.value,
        state: 'preview_only',
        safeNext: 'Adjust local preview value; runtime policy apply remains blocked.',
        blocked: 'Runtime policy apply, provider mutation, and credential storage remain blocked.',
        receipt: 'Policy preview receipt available.',
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
    state.drafts.selectedDraftId = null;
  }
  if (focusId.startsWith('inbox-draft:')) {
    state.drafts.selectedDraftId = focusId.replace('inbox-draft:', '');
    state.threadId = null;
  }
  if (focusId.startsWith('sent-event:')) {
    state.sentEvents.selectedEventId = focusId.replace('sent-event:', '');
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
  if (focusId.startsWith('settings:local:gate:')) {
    state.settings.selectedKey = focusId.replace('settings:local:gate:', '');
  }
  if (focusId.startsWith('settings:local:policy:')) {
    state.settings.selectedKey = focusId.replace('settings:local:policy:', '');
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
        <button class="account-session-trigger user-card-trigger ${state.account.open ? 'is-open' : ''}" type="button" data-account-action="toggle" aria-expanded="${state.account.open ? 'true' : 'false'}" aria-controls="accountSessionPanel">
          <span class="user-card-avatar" aria-hidden="true">${escapeHtml((activeSessionDisplayName() || 'P').slice(0, 1).toUpperCase())}</span>
          <span class="trust-cluster-line">
            <strong>${escapeHtml(activeSessionDisplayName())}</strong>
            <span>${escapeHtml(selectedAccountFixture()?.displayName || activeWorkspaceLabel())}</span>
          </span>
        </button>
        <div class="trust-cluster-line" aria-label="Global trust tokens">
          ${renderTrustToken('provider gated', workspace.providerStatus || 'provider_blocked')}
          ${renderTrustToken('privacy local only', workspace.privacyMode || 'local_only')}
          ${renderTrustToken('ibal proposal only', workspace.ibalStatus || 'proposal_only')}
        </div>
      </section>

      <section class="topbar-command-cluster" aria-label="Ibal command entry">
        <button class="ibal-concierge-btn ${state.ibal.open ? 'is-open' : ''}" type="button" data-ibal-action="toggle" aria-expanded="${state.ibal.open ? 'true' : 'false'}" aria-controls="ibalConciergeDrawer">
          Ibal concierge
        </button>
        <form class="command-box" data-ibal-form="command" aria-label="Search and command entry">
          <span>Search / command</span>
          <input type="search" name="prompt" autocomplete="off" placeholder="${escapeHtml(workspace.commandPlaceholder || 'Ask Ibal (preview only)')}" value="${escapeHtml(state.ibal.prompt || '')}" />
        </form>
      </section>

      ${renderTrustRail()}
    </header>
  `;
}

function renderInboxMailNav() {
  const section = inboxLayoutSection();
  const activeView = state.inbox.mailboxView || 'inbox';
  const smartViews = (section.views || []).filter((view) => mailboxViewId(view.label) !== 'drafts');
  const draftListCount = allDraftItems().filter((draft) => draft.approval_state === 'none').length;
  const approvalCount = allDraftItems().filter((draft) => ['queued', 'approved'].includes(draft.approval_state)).length;
  return `
    <div class="mail-nav-section" aria-label="Mail folders and views">
      <p class="mail-nav-label">Mail</p>
      <button class="mail-nav-item ${activeView === 'inbox' && !state.inbox.accountFilter ? 'is-active' : ''}" type="button" data-inbox-action="select-mailbox-view" data-mailbox-view="inbox">
        <span>All inboxes</span>
        <strong>${inboxThreads().length}</strong>
      </button>
      <button class="mail-nav-item ${activeView === 'drafts' ? 'is-active' : ''}" type="button" data-inbox-action="select-mailbox-view" data-mailbox-view="drafts">
        <span>Drafts</span>
        <strong>${draftListCount}</strong>
      </button>
      <button class="mail-nav-item ${activeView === 'approval-queue' ? 'is-active' : ''}" type="button" data-inbox-action="select-mailbox-view" data-mailbox-view="approval-queue">
        <span>Approval Queue</span>
        <strong>${approvalCount}</strong>
      </button>
      ${smartViews.map((view) => {
        const viewId = mailboxViewId(view.label);
        return `
          <button class="mail-nav-item ${activeView === viewId ? 'is-active' : ''}" type="button" data-inbox-action="select-mailbox-view" data-mailbox-view="${escapeHtml(viewId)}">
            <span>${escapeHtml(view.label)}</span>
            <strong>${escapeHtml(view.count)}</strong>
          </button>
        `;
      }).join('')}
      <p class="mail-nav-label">Accounts</p>
      ${allPreviewAccounts().length ? allPreviewAccounts().map((account) => `
        <button class="mail-nav-item ${state.inbox.accountFilter === account.accountId ? 'is-active' : ''}" type="button" data-inbox-action="select-account-filter" data-thread-id="${escapeHtml(account.accountId)}">
          <span>${escapeHtml(account.displayName)}</span>
          <strong>${account.counts?.unread ?? 0}</strong>
        </button>
      `).join('') : '<p class="form-hint mail-nav-hint">No accounts connected. Add Gmail in user card.</p>'}
    </div>
  `;
}

function renderNavigation() {
  return `
    <nav class="lane-nav mail-nav-pane" aria-label="Primary navigation">
      <p class="lane-nav-label">Workbench</p>
      ${navLanes().map((lane) => {
        const hint = laneNavHint(lane.status);
        return `
          <a class="lane-link ${lane.id === state.laneId ? 'is-active' : ''}" href="${escapeHtml(lane.route)}" aria-current="${lane.id === state.laneId ? 'page' : 'false'}">
            <span>${escapeHtml(laneDisplayLabel(lane.id, lane.label))}</span>
            ${hint ? `<span class="lane-nav-hint">${escapeHtml(hint)}</span>` : ''}
          </a>
        `;
      }).join('')}
      ${state.laneId === 'inbox' ? renderInboxMailNav() : ''}
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

function renderInboxToolbar() {
  return `
    <div class="inbox-toolbar" role="toolbar" aria-label="Inbox actions">
      <button class="inbox-action-btn is-primary" type="button" data-inbox-action="toggle-compose" aria-expanded="${state.inbox.composeOpen ? 'true' : 'false'}">Compose</button>
      <div id="inboxStatusRegion" class="inbox-status-region is-compact" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'inbox' ? state.statusMessage : '')}</div>
      <details class="inbox-toolbar-overflow">
        <summary>More</summary>
        <button class="inbox-action-btn is-danger" type="button" data-inbox-action="clear-all">Clear local inbox state</button>
      </details>
    </div>
  `;
}

function renderInboxComposeSheet() {
  const compose = state.inbox.composeDraft || {};
  return `
    <div class="inbox-compose-root ${state.inbox.composeOpen ? 'is-open' : ''}" aria-hidden="${state.inbox.composeOpen ? 'false' : 'true'}">
      <button class="inbox-compose-backdrop" type="button" data-inbox-action="close-compose" aria-label="Close compose"></button>
      <section class="inbox-compose-sheet" role="dialog" aria-modal="true" aria-label="Compose message">
        <header class="inbox-compose-head">
          <h3>New message</h3>
          <button class="inbox-action-btn" type="button" data-inbox-action="close-compose">Close</button>
        </header>
        <form class="inbox-draft-form" data-inbox-form="compose" aria-label="Compose draft">
          <label for="compose-to">To</label>
          <input id="compose-to" name="to" type="text" autocomplete="off" value="${escapeHtml(compose.to || '')}" />
          <label for="compose-subject">Subject</label>
          <input id="compose-subject" name="subject" type="text" autocomplete="off" value="${escapeHtml(compose.subject || '')}" />
          <label for="compose-body">Message</label>
          <textarea id="compose-body" name="body" rows="8">${escapeHtml(compose.body || '')}</textarea>
          <p class="form-hint">Draft only — not sent. No provider connection.</p>
          <div class="inbox-form-actions">
            <button class="inbox-action-btn is-primary" type="submit" data-inbox-action="compose-save">Save draft</button>
            <button class="inbox-action-btn" type="button" data-inbox-action="compose-clear">Discard</button>
            <button class="inbox-action-btn is-blocked" type="button" disabled>Send blocked</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function syncMailboxThreadSelection() {
  if (state.laneId !== 'inbox') return;
  const view = state.inbox.mailboxView || 'inbox';
  if (view === 'drafts' || view === 'approval-queue') {
    state.threadId = null;
    const visible = draftsForMailboxView();
    if (!visible.length) {
      state.drafts.selectedDraftId = null;
      return;
    }
    if (!visible.some((draft) => draft.id === state.drafts.selectedDraftId)) {
      state.drafts.selectedDraftId = visible[0].id;
      state.focusId = `inbox-draft:${visible[0].id}`;
    }
    return;
  }
  state.drafts.selectedDraftId = null;
  const visible = threadsForMailboxView();
  if (!visible.length) {
    state.threadId = null;
    return;
  }
  if (!visible.some((thread) => thread.id === state.threadId)) {
    state.threadId = visible[0].id;
    state.focusId = `inbox-thread:${visible[0].id}`;
  }
}

function renderDraftStatusChip(draft) {
  const labelText = draft.status === 'sent' ? 'Sent (simulated)'
    : draft.approval_state === 'approved' ? 'Approved (send blocked)'
      : draft.approval_state === 'queued' ? 'Awaiting approval'
        : label(draft.status || 'drafting');
  const chipClass = draft.status === 'sent' ? 'is-safe'
    : draft.approval_state === 'approved' ? 'is-safe'
      : draft.approval_state === 'queued' ? 'is-warn' : 'is-neutral';
  return `<span class="thread-status-chip ${chipClass}">${escapeHtml(labelText)}</span>`;
}

function renderPostSendPreview(draft) {
  const steps = draft.status === 'sent' && draft.post_send_plan?.length
    ? draft.post_send_plan.map((step) => step.summary || step)
    : sendConsequencePreview(draft);
  return `
    <details class="inbox-reading-details post-send-preview" open>
      <summary>${draft.status === 'sent' ? 'Post-send plan (executed dry-run)' : 'Send consequence preview (dry-run)'}</summary>
      <ul class="post-send-plan-list">${steps.map((step) => `<li>${escapeHtml(typeof step === 'string' ? step : step.summary)}</li>`).join('')}</ul>
      <p class="form-hint">Tier 1 preview only. Provider send and runtime automation execution remain blocked.</p>
    </details>
  `;
}

function renderDraftReadingPane(draft) {
  if (!draft) {
    return `
      <section class="inbox-reading-pane mail-reading-pane is-empty" aria-label="Draft editor">
        <p class="lane-empty-state">Select a draft to review or edit.</p>
      </section>
    `;
  }
  const thread = draft.source_thread_id
    ? inboxThreads().find((item) => item.id === draft.source_thread_id)
    : null;
  return `
    <section class="inbox-reading-pane mail-reading-pane" aria-label="Draft editor">
      <header class="inbox-reading-head">
        <div>
          <h3>${escapeHtml(draft.subject || '(no subject)')}</h3>
          <p class="inbox-reading-meta">${escapeHtml(draft.kind)} draft · ${escapeHtml(draft.updated_at || '')}${thread ? ` · re: ${escapeHtml(thread.title)}` : ''}</p>
        </div>
        ${renderDraftStatusChip(draft)}
      </header>
      ${draft.task_hint ? `<p class="draft-task-hint-banner">${escapeHtml(draft.task_hint)}</p>` : ''}
      <form class="inbox-draft-form" data-inbox-form="draft-edit" aria-label="Edit draft">
        <input type="hidden" name="draftId" value="${escapeHtml(draft.id)}" />
        <label for="draft-to-${escapeHtml(draft.id)}">To</label>
        <input id="draft-to-${escapeHtml(draft.id)}" name="to" type="text" autocomplete="off" value="${escapeHtml(draftRecipientsLabel(draft))}" />
        <label for="draft-subject-${escapeHtml(draft.id)}">Subject</label>
        <input id="draft-subject-${escapeHtml(draft.id)}" name="subject" type="text" autocomplete="off" value="${escapeHtml(draft.subject || '')}" />
        <label for="draft-body-${escapeHtml(draft.id)}">Message</label>
        <textarea id="draft-body-${escapeHtml(draft.id)}" name="body" rows="10">${escapeHtml(draft.body || '')}</textarea>
        <p class="form-hint">Draft object in local storage (schema v3). Send and provider writes remain blocked.</p>
        <div class="inbox-form-actions">
          <button class="inbox-action-btn is-primary" type="submit" data-inbox-action="draft-save">Save draft</button>
          ${draft.approval_state === 'none' ? `
            <button class="inbox-action-btn" type="button" data-inbox-action="draft-queue" data-draft-id="${escapeHtml(draft.id)}">Submit for approval</button>
          ` : ''}
          ${draft.approval_state === 'queued' ? `
            <button class="inbox-action-btn" type="button" data-inbox-action="draft-approve" data-draft-id="${escapeHtml(draft.id)}">Approve for send</button>
            <button class="inbox-action-btn" type="button" data-inbox-action="draft-dequeue" data-draft-id="${escapeHtml(draft.id)}">Return to drafts</button>
          ` : ''}
          ${draft.approval_state === 'approved' && draft.status !== 'sent' ? `
            <button class="inbox-action-btn is-primary" type="button" data-inbox-action="draft-simulate-send" data-draft-id="${escapeHtml(draft.id)}">Simulate send (dry-run)</button>
            <button class="inbox-action-btn is-blocked" type="button" disabled>Provider send blocked</button>
            <button class="inbox-action-btn" type="button" data-inbox-action="draft-dequeue" data-draft-id="${escapeHtml(draft.id)}">Return to drafts</button>
          ` : ''}
          ${draft.status === 'sent' ? `<p class="form-hint">Simulated send complete. Open Activity lane for sent-event ledger.</p>` : ''}
          <button class="inbox-action-btn is-danger" type="button" data-inbox-action="draft-delete" data-draft-id="${escapeHtml(draft.id)}">Delete draft</button>
        </div>
      </form>
      ${['queued', 'approved', 'sent'].includes(draft.status) || ['queued', 'approved'].includes(draft.approval_state) ? renderPostSendPreview(draft) : ''}
    </section>
  `;
}

function renderInboxReadingPane(layoutSection, threadOverride) {
  const thread = threadOverride || selectedInboxThread();
  const threadId = thread?.id || '';
  const reply = replyDraftFor(threadId) || {};
  const messages = thread?.messages || [];
  const evidence = thread?.evidence || [];
  const attachments = thread?.attachments || [];
  if (state.inbox.mailboxView === 'drafts' || state.inbox.mailboxView === 'approval-queue') {
    return renderDraftReadingPane(selectedDraft());
  }
  if (!thread) {
    return `
      <section class="inbox-reading-pane is-empty" aria-label="Message reading pane">
        <p class="inbox-empty-state">Select a conversation to read and reply.</p>
      </section>
    `;
  }
  return `
    <section class="inbox-reading-pane mail-reading-pane" aria-label="Message reading pane">
      <header class="inbox-reading-head">
        <div>
          <h3>${escapeHtml(thread.title)}</h3>
          <p class="inbox-reading-meta">${escapeHtml(thread.sender || '')} · ${escapeHtml(thread.receivedAt || '')}</p>
        </div>
        ${renderThreadStatusChip(thread.state || 'needs_review')}
      </header>
      <div class="message-stack" aria-label="Conversation">
        ${messages.map((message) => `
          <article class="message-row">
            <header class="message-row-head">
              <strong>${escapeHtml(message.from)}</strong>
              <small>${escapeHtml(message.meta)}</small>
            </header>
            <p class="message-body">${escapeHtml(message.summary)}</p>
          </article>
        `).join('')}
      </div>
      ${state.inbox.replyOpen ? `
        <form class="inbox-draft-form inbox-reply-sheet" data-inbox-form="reply" aria-label="Reply draft">
          <label for="reply-to">To</label>
          <input id="reply-to" name="to" type="text" autocomplete="off" value="${escapeHtml(reply.to || thread.sender || '')}" />
          <label for="reply-subject">Subject</label>
          <input id="reply-subject" name="subject" type="text" autocomplete="off" value="${escapeHtml(reply.subject || (thread.title ? `Re: ${thread.title}` : ''))}" />
          <label for="reply-body">Message</label>
          <textarea id="reply-body" name="body" rows="6">${escapeHtml(reply.body || '')}</textarea>
          <div class="inbox-form-actions">
            <button class="inbox-action-btn is-primary" type="submit" data-inbox-action="reply-save" data-thread-id="${escapeHtml(threadId)}">Save draft</button>
            <button class="inbox-action-btn" type="button" data-inbox-action="reply-clear" data-thread-id="${escapeHtml(threadId)}">Discard</button>
            <button class="inbox-action-btn is-blocked" type="button" disabled>Send blocked</button>
          </div>
        </form>
      ` : ''}
      <details class="inbox-reading-details">
        <summary>Details and attachments</summary>
        <dl class="thread-metadata-grid">
          ${(thread.fields || thread.detailFields || []).map((field) => `
            <div><dt>${escapeHtml(field.label)}</dt><dd>${escapeHtml(field.value)}</dd></div>
          `).join('')}
        </dl>
        ${evidence.length ? `<ul class="detail-list">${evidence.map((item) => `<li>${escapeHtml(item.label)}: ${escapeHtml(item.summary)}</li>`).join('')}</ul>` : ''}
        ${attachments.length ? `<p class="form-hint">Attachments: ${attachments.map((item) => escapeHtml(item.label)).join(', ')} (provider blocked)</p>` : ''}
      </details>
      ${(localReceiptsForThread(threadId).length || localProposalsForThread(threadId).length) ? `
        <details class="inbox-reading-details">
          <summary>Local drafts and receipts</summary>
          ${renderLocalReceiptsPanel(threadId)}
        </details>
      ` : ''}
    </section>
  `;
}

function renderDraftListRow(draft, selectedId) {
  return `
    <button class="thread-row draft-row ${selectedId === draft.id ? 'is-selected' : ''}" type="button" data-draft-id="${escapeHtml(draft.id)}" data-inspector-focus="${escapeHtml(`inbox-draft:${draft.id}`)}" aria-pressed="${selectedId === draft.id ? 'true' : 'false'}">
      <div class="thread-row-main">
        <div class="thread-row-top">
          <strong class="thread-sender">${escapeHtml(draftRecipientsLabel(draft) || draft.kind)}</strong>
          <time class="thread-time">${escapeHtml(draft.updated_at || '')}</time>
        </div>
        <span class="thread-subject">${escapeHtml(draft.subject || '(no subject)')}</span>
        <p class="thread-snippet">${escapeHtml((draft.body || '').slice(0, 120))}</p>
        ${draft.task_hint ? `<p class="thread-task-hint">${escapeHtml(draft.task_hint)}</p>` : ''}
      </div>
      <div class="thread-row-meta">${renderDraftStatusChip(draft)}</div>
    </button>
  `;
}

function renderInboxWorkspace() {
  const layoutSection = inboxLayoutSection();
  const mailboxView = state.inbox.mailboxView || 'inbox';
  const visibleDrafts = draftsForMailboxView();
  const selectedDraftId = state.drafts.selectedDraftId;
  const visibleThreads = threadsForMailboxView();
  const selected = visibleThreads.find((thread) => thread.id === state.threadId)
    || visibleThreads[0]
    || null;
  const listLabel = mailboxView === 'drafts' ? 'Drafts'
    : mailboxView === 'approval-queue' ? 'Approval queue'
      : 'Conversations';
  return `
    <div class="inbox-workspace is-mail-workbench">
      ${renderInboxToolbar()}
      <div class="inbox-workspace-grid mail-workbench-center">
        <div class="thread-list-panel mail-list-pane" aria-label="${escapeHtml(listLabel)}">
          ${mailboxView === 'drafts' || mailboxView === 'approval-queue' ? (
    visibleDrafts.length
      ? visibleDrafts.map((draft) => renderDraftListRow(draft, selectedDraftId)).join('')
      : `<p class="lane-empty-state">${mailboxView === 'approval-queue'
        ? 'No drafts in approval queue. Submit a draft from the Drafts view.'
        : 'No drafts yet. Compose or reply to create a local draft object.'}</p>`
  ) : visibleThreads.length ? visibleThreads.map((thread) => `
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
                ${renderLocalTriageChip(thread.id)}
              </div>
            </button>
          `).join('') : '<p class="lane-empty-state">No threads in this view.</p>'}
        </div>
        ${renderInboxReadingPane({ ...layoutSection, threads: visibleThreads }, selected)}
      </div>
      ${renderInboxComposeSheet()}
    </div>
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

function calendarAgendaFixtures() {
  const content = activeLaneContent();
  const section = sectionByType(content, 'agenda');
  const sectionIndex = (content.sections || []).findIndex((entry) => entry === section);
  return (section?.items || []).map((item, index) => ({
    focusId: `calendar:agenda:${sectionIndex}:${index}`,
    time: item.time,
    title: item.title,
    summary: item.summary,
    tags: item.tags || [],
  }));
}

function calendarConflictFixtures() {
  return sectionByType(activeLaneContent(), 'conflict-panel')?.items || [];
}

function calendarViewMonthParts() {
  const raw = state.calendar.viewMonth || defaultCalendarOps().viewMonth;
  const [year, month] = raw.split('-').map(Number);
  return { year, month: month - 1 };
}

function calendarDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function calendarMonthLabel() {
  const { year, month } = calendarViewMonthParts();
  return new Date(year, month, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' });
}

function shiftCalendarViewMonth(delta) {
  const { year, month } = calendarViewMonthParts();
  const next = new Date(year, month + delta, 1);
  state.calendar.viewMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
  state.calendar.selectedDay = null;
  saveState();
}

function proposalGridDay(proposal, year, monthIndex) {
  const text = proposal.dateTime || '';
  const match = text.match(/(\d{1,2})/);
  if (match) {
    const day = Number(match[1]);
    if (day >= 1 && day <= calendarDaysInMonth(year, monthIndex)) return day;
  }
  return null;
}

function calendarEventsByDay() {
  const { year, month } = calendarViewMonthParts();
  const byDay = {};
  const add = (day, event) => {
    if (!day) return;
    byDay[day] = byDay[day] || [];
    byDay[day].push(event);
  };
  const agendaDays = [10, 12, 15];
  calendarAgendaFixtures().forEach((item, index) => {
    const day = agendaDays[index] || (index + 1);
    if (day <= calendarDaysInMonth(year, month)) {
      add(day, { kind: 'agenda', focusId: item.focusId, title: item.title, time: item.time, summary: item.summary });
    }
  });
  allCalendarProposals().forEach((proposal, index) => {
    const day = proposalGridDay(proposal, year, month) || Math.min(8 + index, calendarDaysInMonth(year, month));
    add(day, {
      kind: 'proposal',
      id: proposal.id,
      focusId: `calendar:local:${proposal.id}`,
      title: proposal.title,
      time: proposal.dateTime || '—',
      summary: proposal.notes || '',
    });
  });
  return byDay;
}

function renderCalendarMonthGrid() {
  const { year, month } = calendarViewMonthParts();
  const dim = calendarDaysInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay();
  const byDay = calendarEventsByDay();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cells = [];
  for (let i = 0; i < firstDow; i += 1) cells.push(null);
  for (let d = 1; d <= dim; d += 1) cells.push(d);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  return `
    <section class="calendar-month-shell" aria-label="Month view">
      <header class="calendar-month-head">
        <button class="inbox-action-btn" type="button" data-calendar-action="month-prev" aria-label="Previous month">‹</button>
        <h3>${escapeHtml(calendarMonthLabel())}</h3>
        <button class="inbox-action-btn" type="button" data-calendar-action="month-next" aria-label="Next month">›</button>
      </header>
      <div class="calendar-weekday-row" aria-hidden="true">
        ${weekdays.map((label) => `<span>${label}</span>`).join('')}
      </div>
      <div class="calendar-month-grid">
        ${cells.map((day) => {
    if (!day) return '<div class="calendar-day-cell is-pad" aria-hidden="true"></div>';
    const events = byDay[day] || [];
    const isToday = isCurrentMonth && day === today.getDate();
    const isSelected = state.calendar.selectedDay === day;
    return `
          <button class="calendar-day-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" type="button" data-calendar-action="select-day" data-day="${day}" aria-pressed="${isSelected ? 'true' : 'false'}">
            <span class="calendar-day-num">${day}</span>
            <div class="calendar-day-events">
              ${events.slice(0, 3).map((event) => `
                <span class="calendar-day-chip ${event.kind === 'proposal' ? 'is-proposal' : 'is-fixture'}" title="${escapeHtml(event.title)}">${escapeHtml((event.time ? `${event.time} ` : '') + event.title)}</span>
              `).join('')}
              ${events.length > 3 ? `<span class="calendar-day-more">+${events.length - 3} more</span>` : ''}
            </div>
          </button>
        `;
  }).join('')}
      </div>
    </section>
  `;
}

function renderCalendarProposalForm(proposalId) {
  const selected = proposalId
    ? allCalendarProposals().find((entry) => entry.id === proposalId)
    : selectedCalendarProposal();
  const id = proposalId || selected?.id || '';
  return `
    <form class="inbox-draft-form" data-calendar-form="proposal" aria-label="Event proposal">
      <input type="hidden" name="proposalId" value="${escapeHtml(id)}" />
      <label for="calendar-title">Title</label>
      <input id="calendar-title" name="title" type="text" autocomplete="off" value="${escapeHtml(selected?.title || '')}" />
      <label for="calendar-datetime">When</label>
      <input id="calendar-datetime" name="dateTime" type="text" autocomplete="off" value="${escapeHtml(selected?.dateTime || '')}" placeholder="e.g. Jun 10, 2:00 PM" />
      <label for="calendar-notes">Notes</label>
      <textarea id="calendar-notes" name="notes" rows="3">${escapeHtml(selected?.notes || '')}</textarea>
      <label for="calendar-source-ref">Source</label>
      <input id="calendar-source-ref" name="sourceRef" type="text" autocomplete="off" value="${escapeHtml(selected?.sourceRef || '')}" />
      <input type="hidden" name="sourceType" value="${escapeHtml(selected?.sourceType || 'calendar_local')}" />
      <input type="hidden" name="threadId" value="${escapeHtml(selected?.threadId || '')}" />
      <p class="form-hint">Preview only — not scheduled on a provider calendar.</p>
      <div class="inbox-form-actions">
        <button class="inbox-action-btn is-primary" type="submit" data-calendar-action="proposal-save">${id ? 'Save changes' : 'Save event'}</button>
        ${id ? `<button class="inbox-action-btn" type="button" data-calendar-action="proposal-clear" data-proposal-id="${escapeHtml(id)}">Delete</button>` : ''}
        <button class="inbox-action-btn is-blocked" type="button" disabled>Invite blocked</button>
      </div>
    </form>
  `;
}

function renderCalendarEventSheet() {
  const proposalId = state.calendar.selectedProposalId || '';
  return `
    <div class="lane-compose-root calendar-compose-root ${state.calendar.formOpen ? 'is-open' : ''}" aria-hidden="${state.calendar.formOpen ? 'false' : 'true'}">
      <button class="lane-compose-backdrop" type="button" data-calendar-action="close-form" aria-label="Close"></button>
      <section class="lane-compose-sheet" role="dialog" aria-modal="true" aria-label="New or edit event">
        <header class="lane-compose-head">
          <h3>${proposalId ? 'Edit event' : 'New event'}</h3>
          <button class="inbox-action-btn" type="button" data-calendar-action="close-form">Close</button>
        </header>
        ${renderCalendarProposalForm(proposalId)}
      </section>
    </div>
  `;
}

function renderCalendarReadingPane() {
  const proposals = allCalendarProposals();
  const proposal = proposals.find((entry) => entry.id === state.calendar.selectedProposalId)
    || (state.focusId?.startsWith('calendar:local:')
      ? proposals.find((entry) => `calendar:local:${entry.id}` === state.focusId)
      : null);
  const agenda = calendarAgendaFixtures().find((entry) => entry.focusId === state.focusId);
  const conflicts = calendarConflictFixtures();
  if (proposal) {
    return `
      <section class="lane-reading-pane" aria-label="Event details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(proposal.title)}</h3>
            <p class="lane-reading-meta">${escapeHtml(proposal.dateTime || 'No time set')} · local proposal</p>
          </div>
        </header>
        <p>${escapeHtml(proposal.notes || 'No notes.')}</p>
        <p class="form-hint">Source: ${escapeHtml(proposal.sourceRef || 'none')}</p>
        <div class="inbox-action-toolbar">
          <button class="inbox-action-btn is-primary" type="button" data-calendar-action="edit-event" data-proposal-id="${escapeHtml(proposal.id)}">Edit</button>
          <button class="inbox-action-btn" type="button" data-calendar-action="proposal-clear" data-proposal-id="${escapeHtml(proposal.id)}">Delete</button>
        </div>
        ${(state.calendar.receipts || []).filter((r) => r.proposalId === proposal.id).length ? `
          <details class="lane-reading-details">
            <summary>Receipts</summary>
            ${renderCalendarLocalReceipts(proposal.id)}
          </details>
        ` : ''}
      </section>
    `;
  }
  if (agenda) {
    return `
      <section class="lane-reading-pane" aria-label="Event details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(agenda.title)}</h3>
            <p class="lane-reading-meta">${escapeHtml(agenda.time)} · preview fixture</p>
          </div>
        </header>
        <p>${escapeHtml(agenda.summary)}</p>
        ${agenda.tags.length ? `<p class="form-hint">${agenda.tags.map((tag) => escapeHtml(label(tag))).join(' · ')}</p>` : ''}
        ${conflicts.length ? `
          <details class="lane-reading-details">
            <summary>Scheduling notes</summary>
            ${conflicts.map((item) => `<p><strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(item.summary)}</p>`).join('')}
          </details>
        ` : ''}
      </section>
    `;
  }
  if (state.calendar.selectedDay) {
    const events = calendarEventsByDay()[state.calendar.selectedDay] || [];
    const { year, month } = calendarViewMonthParts();
    const dayLabel = new Date(year, month, state.calendar.selectedDay).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    return `
      <section class="lane-reading-pane" aria-label="Day details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(dayLabel)}</h3>
            <p class="lane-reading-meta">${events.length} event(s)</p>
          </div>
        </header>
        ${events.length ? events.map((event) => `
          <button class="calendar-agenda-row" type="button" data-calendar-action="${event.kind === 'proposal' ? 'select-proposal' : 'select-agenda'}" ${event.kind === 'proposal' ? `data-proposal-id="${escapeHtml(event.id)}"` : `data-focus-id="${escapeHtml(event.focusId)}"`}>
            <time>${escapeHtml(event.time || '—')}</time>
            <div><strong>${escapeHtml(event.title)}</strong><p>${escapeHtml(event.summary || '')}</p></div>
          </button>
        `).join('') : '<p class="lane-empty-state">No events on this day.</p>'}
      </section>
    `;
  }
  return `<section class="lane-reading-pane is-empty" aria-label="Event details"><p class="lane-empty-state">Select a day or event, or create one.</p></section>`;
}

function renderCalendarWorkspace() {
  return `
    <div class="lane-workspace calendar-workspace">
      <div class="lane-toolbar" role="toolbar" aria-label="Calendar actions">
        <button class="inbox-action-btn is-primary" type="button" data-calendar-action="new-event">New event</button>
        <div id="calendarStatusRegion" class="inbox-status-region is-compact" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'calendar' ? state.statusMessage : '')}</div>
        <details class="lane-toolbar-overflow">
          <summary>More</summary>
          <button class="inbox-action-btn is-danger" type="button" data-calendar-action="clear-all">Clear local calendar state</button>
        </details>
      </div>
      <div class="lane-workspace-grid calendar-workspace-grid">
        ${renderCalendarMonthGrid()}
        ${renderCalendarReadingPane()}
      </div>
      ${renderCalendarEventSheet()}
    </div>
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

function taskBoardFixtures() {
  const content = activeLaneContent();
  const section = sectionByType(content, 'task-board');
  const sectionIndex = (content.sections || []).findIndex((entry) => entry === section);
  const items = [];
  (section?.columns || []).forEach((column, columnIndex) => {
    (column.items || []).forEach((item, index) => {
      items.push({
        focusId: `tasks:task-board:${sectionIndex}:${columnIndex}-${index}`,
        column: column.label,
        title: item.title,
        summary: item.summary,
        meta: item.meta,
        state: item.state,
      });
    });
  });
  return items;
}

function taskLinkFixtures() {
  return sectionByType(activeLaneContent(), 'task-links')?.links || [];
}

function parseTaskMetaSource(meta) {
  if (!meta) return null;
  const lower = meta.toLowerCase();
  if (lower.includes('source inbox') || lower.includes('inbox')) return { lane: 'inbox', label: 'Mail' };
  if (lower.includes('source calendar') || lower.includes('calendar')) return { lane: 'calendar', label: 'Calendar' };
  if (lower.includes('source receipts') || lower.includes('receipts')) return { lane: 'receipts', label: 'Activity' };
  if (lower.includes('source settings') || lower.includes('settings')) return { lane: 'settings', label: 'Settings' };
  return null;
}

function taskSourceJumpTarget(taskOrRef) {
  const threadId = taskOrRef?.threadId;
  const sourceRef = taskOrRef?.sourceRef || '';
  if (threadId) return { lane: 'inbox', threadId, label: 'Open mail thread' };
  if (sourceRef.startsWith('inbox-thread:')) {
    return { lane: 'inbox', threadId: sourceRef.replace('inbox-thread:', ''), label: 'Open mail thread' };
  }
  const metaSource = parseTaskMetaSource(taskOrRef?.meta);
  if (metaSource) return { lane: metaSource.lane, label: `Open ${metaSource.label}` };
  return null;
}

function renderTaskSourceLink(item) {
  const jump = taskSourceJumpTarget(item.kind === 'local' ? item.task : item);
  if (!jump) return item.sourceRef ? `<span class="task-source-hint">${escapeHtml(item.sourceRef || item.task?.sourceRef || '')}</span>` : '';
  return `<button class="task-source-link" type="button" data-tasks-action="source-jump" data-lane-id="${escapeHtml(jump.lane)}" ${jump.threadId ? `data-thread-id="${escapeHtml(jump.threadId)}"` : ''}>${escapeHtml(jump.label)}</button>`;
}

function taskBoardColumns() {
  const content = activeLaneContent();
  const section = sectionByType(content, 'task-board');
  const sectionIndex = (content.sections || []).findIndex((entry) => entry === section);
  const columns = (section?.columns || []).map((column, columnIndex) => ({
    label: column.label,
    state: column.state,
    items: (column.items || []).map((item, index) => ({
      kind: 'fixture',
      focusId: `tasks:task-board:${sectionIndex}:${columnIndex}-${index}`,
      title: item.title,
      summary: item.summary,
      meta: item.meta,
      state: item.state,
    })),
  }));
  if (!columns.some((col) => col.label === 'In progress')) {
    columns.splice(1, 0, { label: 'In progress', state: 'active', items: [] });
  }
  allLocalTasks().forEach((task) => {
    const colLabel = TASK_COLUMN_MAP[task.status] || 'Proposed';
    const col = columns.find((entry) => entry.label === colLabel) || columns[0];
    col.items.push({
      kind: 'local',
      id: task.id,
      focusId: `tasks:local:${task.id}`,
      title: task.title,
      summary: task.notes || task.dueDate || '',
      task,
    });
  });
  return columns;
}

function renderTasksKanbanBoard() {
  const selectedId = state.tasks.selectedTaskId;
  const columns = taskBoardColumns();
  return `
    <div class="tasks-kanban-board" aria-label="Task board">
      ${columns.map((column) => `
        <section class="tasks-kanban-column">
          <header class="tasks-kanban-column-head">
            <h4>${escapeHtml(column.label)}</h4>
            <span>${column.items.length}</span>
          </header>
          <div class="tasks-kanban-cards">
            ${column.items.length ? column.items.map((item) => {
    const isSelected = item.kind === 'local'
      ? item.id === selectedId
      : state.focusId === item.focusId;
    return `
              <button class="tasks-kanban-card ${isSelected ? 'is-selected' : ''}" type="button"
                data-tasks-action="${item.kind === 'local' ? 'select-task' : 'select-fixture'}"
                ${item.kind === 'local' ? `data-task-id="${escapeHtml(item.id)}"` : `data-focus-id="${escapeHtml(item.focusId)}"`}
                data-inspector-focus="${escapeHtml(item.focusId)}">
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.summary || '')}</p>
                ${renderTaskSourceLink(item)}
              </button>
            `;
  }).join('') : '<p class="tasks-kanban-empty">No tasks</p>'}
          </div>
        </section>
      `).join('')}
    </div>
  `;
}

function renderTasksTaskForm(taskId) {
  const selected = taskId
    ? allLocalTasks().find((entry) => entry.id === taskId)
    : selectedLocalTask();
  const id = taskId || selected?.id || '';
  return `
    <form class="inbox-draft-form" data-tasks-form="task" aria-label="Task form">
      <input type="hidden" name="taskId" value="${escapeHtml(id)}" />
      <label for="task-title">Title</label>
      <input id="task-title" name="title" type="text" autocomplete="off" value="${escapeHtml(selected?.title || '')}" />
      <label for="task-status">Status</label>
      <select id="task-status" name="status">
        ${TASK_STATUSES.map((status) => `<option value="${escapeHtml(status)}" ${selected?.status === status ? 'selected' : ''}>${escapeHtml(label(status))}</option>`).join('')}
      </select>
      <label for="task-due">Due</label>
      <input id="task-due" name="dueDate" type="text" autocomplete="off" value="${escapeHtml(selected?.dueDate || '')}" />
      <label for="task-notes">Notes</label>
      <textarea id="task-notes" name="notes" rows="3">${escapeHtml(selected?.notes || '')}</textarea>
      <label for="task-source-ref">Source</label>
      <input id="task-source-ref" name="sourceRef" type="text" autocomplete="off" value="${escapeHtml(selected?.sourceRef || '')}" />
      <input type="hidden" name="sourceType" value="${escapeHtml(selected?.sourceType || 'tasks_local')}" />
      <input type="hidden" name="threadId" value="${escapeHtml(selected?.threadId || '')}" />
      <input type="hidden" name="calendarId" value="${escapeHtml(selected?.calendarId || '')}" />
      <p class="form-hint">Preview only — no provider sync.</p>
      <div class="inbox-form-actions">
        <button class="inbox-action-btn is-primary" type="submit" data-tasks-action="task-save">${id ? 'Save changes' : 'Save task'}</button>
        ${id ? `<button class="inbox-action-btn" type="button" data-tasks-action="task-clear" data-task-id="${escapeHtml(id)}">Delete</button>` : ''}
        <button class="inbox-action-btn is-blocked" type="button" disabled>Sync blocked</button>
      </div>
    </form>
  `;
}

function renderTasksTaskSheet() {
  const taskId = state.tasks.selectedTaskId || '';
  return `
    <div class="lane-compose-root tasks-compose-root ${state.tasks.formOpen ? 'is-open' : ''}" aria-hidden="${state.tasks.formOpen ? 'false' : 'true'}">
      <button class="lane-compose-backdrop" type="button" data-tasks-action="close-form" aria-label="Close"></button>
      <section class="lane-compose-sheet" role="dialog" aria-modal="true" aria-label="New or edit task">
        <header class="lane-compose-head">
          <h3>${taskId ? 'Edit task' : 'New task'}</h3>
          <button class="inbox-action-btn" type="button" data-tasks-action="close-form">Close</button>
        </header>
        ${renderTasksTaskForm(taskId)}
      </section>
    </div>
  `;
}

function renderTasksReadingPane() {
  const tasks = allLocalTasks();
  const task = tasks.find((entry) => entry.id === state.tasks.selectedTaskId)
    || (state.focusId?.startsWith('tasks:local:')
      ? tasks.find((entry) => `tasks:local:${entry.id}` === state.focusId)
      : null);
  const fixture = taskBoardFixtures().find((entry) => entry.focusId === state.focusId);
  const links = taskLinkFixtures();
  if (task) {
    return `
      <section class="lane-reading-pane" aria-label="Task details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(task.title)}</h3>
            <p class="lane-reading-meta">${escapeHtml(label(task.status))}${task.dueDate ? ` · due ${escapeHtml(task.dueDate)}` : ''}</p>
          </div>
        </header>
        <p>${escapeHtml(task.notes || 'No notes.')}</p>
        <div class="task-source-row">${renderTaskSourceLink({ kind: 'local', task })}</div>
        ${task.sourceRef ? `<p class="form-hint">Ref: ${escapeHtml(task.sourceRef)}</p>` : ''}
        ${renderTaskStatusButtons(task.id, task.status || 'proposed')}
        <div class="inbox-action-toolbar">
          <button class="inbox-action-btn is-primary" type="button" data-tasks-action="edit-task" data-task-id="${escapeHtml(task.id)}">Edit</button>
          <button class="inbox-action-btn" type="button" data-tasks-action="task-clear" data-task-id="${escapeHtml(task.id)}">Delete</button>
        </div>
        ${(state.tasks.receipts || []).filter((r) => r.taskId === task.id).length ? `
          <details class="lane-reading-details"><summary>Receipts</summary>${renderTasksLocalReceipts(task.id)}</details>
        ` : ''}
      </section>
    `;
  }
  if (fixture) {
    return `
      <section class="lane-reading-pane" aria-label="Task details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(fixture.title)}</h3>
            <p class="lane-reading-meta">${escapeHtml(fixture.column)} · preview fixture</p>
          </div>
        </header>
        <p>${escapeHtml(fixture.summary)}</p>
        <div class="task-source-row">${renderTaskSourceLink(fixture)}</div>
        ${fixture.meta ? `<p class="form-hint">${escapeHtml(fixture.meta)}</p>` : ''}
        ${links.length ? `
          <details class="lane-reading-details">
            <summary>Linked sources</summary>
            ${links.map((link) => `<p><strong>${escapeHtml(link.source)}</strong> — ${escapeHtml(link.title)}: ${escapeHtml(link.summary)}</p>`).join('')}
          </details>
        ` : ''}
      </section>
    `;
  }
  return `<section class="lane-reading-pane is-empty" aria-label="Task details"><p class="lane-empty-state">Select a task or create one.</p></section>`;
}

function renderTasksWorkspace() {
  return `
    <div class="lane-workspace tasks-workspace">
      <div class="lane-toolbar" role="toolbar" aria-label="Tasks actions">
        <button class="inbox-action-btn is-primary" type="button" data-tasks-action="new-task">New task</button>
        <div id="tasksStatusRegion" class="inbox-status-region is-compact" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'tasks' ? state.statusMessage : '')}</div>
        <details class="lane-toolbar-overflow">
          <summary>More</summary>
          <button class="inbox-action-btn is-danger" type="button" data-tasks-action="clear-all">Clear local tasks state</button>
        </details>
      </div>
      <div class="lane-workspace-grid tasks-workspace-grid is-kanban">
        ${renderTasksKanbanBoard()}
        ${renderTasksReadingPane()}
      </div>
      ${renderTasksTaskSheet()}
    </div>
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

function automationTemplateFixtures() {
  const content = activeLaneContent();
  const section = sectionByType(content, 'automation-studio');
  const sectionIndex = (content.sections || []).findIndex((entry) => entry === section);
  return (section?.templates || []).map((template, index) => ({
    focusId: `automations:automation-studio:${sectionIndex}:${index}`,
    title: template.title,
    summary: template.summary,
    trigger: template.trigger,
    gate: template.gate,
    state: template.state,
  }));
}

function automationDryRunFixtures() {
  return sectionByType(activeLaneContent(), 'dry-run')?.steps || [];
}

function renderAutomationsRuleForm(ruleId) {
  const selected = ruleId
    ? allLocalAutomationRules().find((entry) => entry.id === ruleId)
    : selectedAutomationRule();
  const id = ruleId || selected?.id || '';
  return `
    <form class="inbox-draft-form" data-automations-form="rule" aria-label="Automation rule">
      <input type="hidden" name="ruleId" value="${escapeHtml(id)}" />
      <label for="auto-title">Rule name</label>
      <input id="auto-title" name="title" type="text" autocomplete="off" value="${escapeHtml(selected?.title || '')}" />
      <label for="auto-trigger">Trigger</label>
      <input id="auto-trigger" name="trigger" type="text" autocomplete="off" value="${escapeHtml(selected?.trigger || '')}" />
      <label for="auto-condition">Condition</label>
      <input id="auto-condition" name="condition" type="text" autocomplete="off" value="${escapeHtml(selected?.condition || '')}" />
      <label for="auto-proposal">Proposed action</label>
      <textarea id="auto-proposal" name="proposal" rows="2">${escapeHtml(selected?.proposal || '')}</textarea>
      <label for="auto-gate">Approval gate</label>
      <input id="auto-gate" name="gate" type="text" autocomplete="off" value="${escapeHtml(selected?.gate || 'human approval required')}" />
      <p class="form-hint">Dry-run only — execution and enablement blocked.</p>
      <div class="inbox-form-actions">
        <button class="inbox-action-btn is-primary" type="submit" data-automations-action="rule-save">${id ? 'Save changes' : 'Save rule'}</button>
        <button class="inbox-action-btn is-blocked" type="button" disabled>Enable blocked</button>
      </div>
    </form>
  `;
}

function renderAutomationsRuleSheet() {
  const ruleId = state.automations.selectedRuleId || '';
  return `
    <div class="lane-compose-root automations-compose-root ${state.automations.formOpen ? 'is-open' : ''}" aria-hidden="${state.automations.formOpen ? 'false' : 'true'}">
      <button class="lane-compose-backdrop" type="button" data-automations-action="close-form" aria-label="Close"></button>
      <section class="lane-compose-sheet" role="dialog" aria-modal="true" aria-label="Automation rule">
        <header class="lane-compose-head">
          <h3>${ruleId ? 'Edit rule' : 'New rule'}</h3>
          <button class="inbox-action-btn" type="button" data-automations-action="close-form">Close</button>
        </header>
        ${renderAutomationsRuleForm(ruleId)}
      </section>
    </div>
  `;
}

function renderAutomationsReadingPane() {
  const rules = allLocalAutomationRules();
  const rule = rules.find((entry) => entry.id === state.automations.selectedRuleId)
    || (state.focusId?.startsWith('automations:local:')
      ? rules.find((entry) => `automations:local:${entry.id}` === state.focusId)
      : null);
  const template = automationTemplateFixtures().find((entry) => entry.focusId === state.focusId);
  const dryRunSteps = automationDryRunFixtures();
  if (rule) {
    return `
      <section class="lane-reading-pane" aria-label="Rule details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(rule.title)}</h3>
            <p class="lane-reading-meta">${escapeHtml(label(rule.state))} · dry-run only</p>
          </div>
        </header>
        <p><strong>Trigger:</strong> ${escapeHtml(rule.trigger || 'unset')}</p>
        <p><strong>Condition:</strong> ${escapeHtml(rule.condition || 'unset')}</p>
        <p><strong>Proposal:</strong> ${escapeHtml(rule.proposal || 'unset')}</p>
        <p><strong>Gate:</strong> ${escapeHtml(rule.gate || 'unset')}</p>
        <div class="inbox-action-toolbar">
          <button class="inbox-action-btn is-primary" type="button" data-automations-action="dry-run" data-rule-id="${escapeHtml(rule.id)}">Run dry-run</button>
          <button class="inbox-action-btn" type="button" data-automations-action="edit-rule" data-rule-id="${escapeHtml(rule.id)}">Edit</button>
          <button class="inbox-action-btn" type="button" data-automations-action="rule-clear" data-rule-id="${escapeHtml(rule.id)}">Delete</button>
          <button class="inbox-action-btn is-blocked" type="button" disabled>Enable blocked</button>
        </div>
        ${state.automations.lastDryRun?.ruleId === rule.id ? `
          <details class="lane-reading-details" open>
            <summary>Dry-run result</summary>
            ${renderAutomationsDryRunOutput(rule.id)}
          </details>
        ` : ''}
        ${(state.automations.receipts || []).filter((r) => r.ruleId === rule.id).length ? `
          <details class="lane-reading-details"><summary>Receipts</summary>${renderAutomationsLocalReceipts(rule.id)}</details>
        ` : ''}
      </section>
    `;
  }
  if (template) {
    return `
      <section class="lane-reading-pane" aria-label="Template details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(template.title)}</h3>
            <p class="lane-reading-meta">template · ${escapeHtml(label(template.state))}</p>
          </div>
        </header>
        <p>${escapeHtml(template.summary)}</p>
        <p class="form-hint">Trigger: ${escapeHtml(template.trigger)} · Gate: ${escapeHtml(template.gate)}</p>
        ${dryRunSteps.length ? `
          <details class="lane-reading-details">
            <summary>How dry-run works</summary>
            <ol class="dry-run-pipeline">${dryRunSteps.map((step, index) => `
              <li class="dry-run-step"><span class="dry-run-step-index">${index + 1}</span>
                <div><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.summary)}</p></div></li>
            `).join('')}</ol>
          </details>
        ` : ''}
      </section>
    `;
  }
  return `<section class="lane-reading-pane is-empty" aria-label="Rule details"><p class="lane-empty-state">Select a rule or template.</p></section>`;
}

function renderAutomationsWorkspace() {
  const rules = allLocalAutomationRules();
  const templates = automationTemplateFixtures();
  const selectedId = state.automations.selectedRuleId;
  return `
    <div class="lane-workspace automations-workspace">
      <div class="lane-toolbar" role="toolbar" aria-label="Automations actions">
        <button class="inbox-action-btn is-primary" type="button" data-automations-action="new-rule">New rule</button>
        <div id="automationsStatusRegion" class="inbox-status-region is-compact" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'automations' ? state.statusMessage : '')}</div>
        <details class="lane-toolbar-overflow">
          <summary>More</summary>
          <button class="inbox-action-btn is-danger" type="button" data-automations-action="clear-all">Clear local automations state</button>
        </details>
      </div>
      <div class="lane-workspace-grid automations-workspace-grid">
        <div class="automations-item-list" aria-label="Rules and templates">
          ${rules.map((rule) => `
            <button class="automations-list-row ${rule.id === selectedId ? 'is-selected' : ''}" type="button" data-automations-action="select-rule" data-rule-id="${escapeHtml(rule.id)}" data-inspector-focus="${escapeHtml(`automations:local:${rule.id}`)}">
              <span class="automations-list-badge">rule</span>
              <div><strong>${escapeHtml(rule.title)}</strong><p>${escapeHtml(rule.trigger || '')}</p></div>
            </button>
          `).join('')}
          ${templates.map((item) => `
            <button class="automations-list-row ${state.focusId === item.focusId ? 'is-selected' : ''}" type="button" data-automations-action="select-template" data-focus-id="${escapeHtml(item.focusId)}" data-inspector-focus="${escapeHtml(item.focusId)}">
              <span class="automations-list-badge">template</span>
              <div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.summary)}</p></div>
            </button>
          `).join('')}
        </div>
        ${renderAutomationsReadingPane()}
      </div>
      ${renderAutomationsRuleSheet()}
    </div>
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

function renderExtensionsProvisionForm(installId) {
  const install = allExtensionInstalls().find((entry) => entry.id === installId) || selectedExtensionInstall();
  const id = installId || install?.id || '';
  return `
    <form class="inbox-draft-form" data-extensions-form="provision" aria-label="Provision notes">
      <input type="hidden" name="installId" value="${escapeHtml(id)}" />
      <label for="ext-provision-notes">Provision notes</label>
      <textarea id="ext-provision-notes" name="provisionNotes" rows="3">${escapeHtml(install?.provisionNotes || '')}</textarea>
      <p class="form-hint">Planning notes only. No credentials or tokens stored.</p>
      <div class="inbox-form-actions">
        <button class="inbox-action-btn is-primary" type="submit" data-extensions-action="provision-save">Save notes</button>
        <button class="inbox-action-btn is-blocked" type="button" disabled>Provider write blocked</button>
      </div>
    </form>
  `;
}

function renderExtensionsProvisionSheet() {
  const install = selectedExtensionInstall();
  return `
    <div class="lane-compose-root extensions-compose-root ${state.extensions.formOpen ? 'is-open' : ''}" aria-hidden="${state.extensions.formOpen ? 'false' : 'true'}">
      <button class="lane-compose-backdrop" type="button" data-extensions-action="close-form" aria-label="Close"></button>
      <section class="lane-compose-sheet" role="dialog" aria-modal="true" aria-label="Provision notes">
        <header class="lane-compose-head">
          <h3>Provision · ${escapeHtml(install?.label || 'install')}</h3>
          <button class="inbox-action-btn" type="button" data-extensions-action="close-form">Close</button>
        </header>
        ${renderExtensionsProvisionForm(install?.id)}
      </section>
    </div>
  `;
}

function renderExtensionsReadingPane() {
  const fixtures = extensionFixtures();
  const install = selectedExtensionInstall();
  const fixture = fixtures.find((entry) => entry.focusId === state.focusId);
  const boundaryItems = extensionSecretBoundaryItems();
  if (install && state.focusId === `extensions:local:${install.id}`) {
    return `
      <section class="lane-reading-pane" aria-label="Install details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(install.label)}</h3>
            <p class="lane-reading-meta">${escapeHtml(label(install.state))} · preview install</p>
          </div>
        </header>
        <p><strong>Permissions:</strong> ${escapeHtml(install.permissions || 'unset')}</p>
        ${install.provisionNotes ? `<p><strong>Notes:</strong> ${escapeHtml(install.provisionNotes)}</p>` : ''}
        <div class="inbox-action-toolbar">
          <button class="inbox-action-btn is-primary" type="button" data-extensions-action="edit-provision" data-install-id="${escapeHtml(install.id)}">Edit provision notes</button>
          <button class="inbox-action-btn" type="button" data-extensions-action="remove-install" data-install-id="${escapeHtml(install.id)}">Remove install</button>
          <button class="inbox-action-btn is-blocked" type="button" disabled>Connect/OAuth blocked</button>
        </div>
        ${(state.extensions.receipts || []).filter((r) => r.installId === install.id).length ? `
          <details class="lane-reading-details"><summary>Receipts</summary>${renderExtensionsLocalReceipts(install.id)}</details>
        ` : ''}
      </section>
    `;
  }
  if (fixture) {
    const localInstall = installForFixture(fixture.fixtureId);
    return `
      <section class="lane-reading-pane" aria-label="Provider details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(fixture.label)}</h3>
            <p class="lane-reading-meta">${escapeHtml(label(fixture.state))}${localInstall ? ' · preview installed' : ''}</p>
          </div>
        </header>
        <p>${escapeHtml(fixture.summary)}</p>
        <p class="form-hint">Permissions: ${escapeHtml(fixture.permissions)}</p>
        <div class="inbox-action-toolbar">
          ${localInstall
    ? `<button class="inbox-action-btn" type="button" data-extensions-action="select-install" data-install-id="${escapeHtml(localInstall.id)}">View install</button>`
    : `<button class="inbox-action-btn is-primary" type="button" data-extensions-action="preview-install" data-fixture-id="${escapeHtml(fixture.fixtureId)}">Record preview install</button>`}
          <button class="inbox-action-btn is-blocked" type="button" disabled>Connect/OAuth blocked</button>
        </div>
        ${boundaryItems.length ? `
          <details class="lane-reading-details">
            <summary>Secret boundary</summary>
            <ul class="extensions-boundary-list">${boundaryItems.map((item) => `
              <li><strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(item.summary)}</li>
            `).join('')}</ul>
          </details>
        ` : ''}
      </section>
    `;
  }
  return `<section class="lane-reading-pane is-empty" aria-label="Provider details"><p class="lane-empty-state">Select a provider fixture.</p></section>`;
}

function renderExtensionsWorkspace() {
  const fixtures = extensionFixtures();
  const selectedId = state.extensions.selectedInstallId;
  return `
    <div class="lane-workspace extensions-workspace">
      <div class="lane-toolbar" role="toolbar" aria-label="Extensions actions">
        <div id="extensionsStatusRegion" class="inbox-status-region is-compact" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'extensions' ? state.statusMessage : '')}</div>
        <details class="lane-toolbar-overflow">
          <summary>More</summary>
          <button class="inbox-action-btn is-danger" type="button" data-extensions-action="clear-all">Clear local extensions state</button>
        </details>
      </div>
      <div class="lane-workspace-grid extensions-workspace-grid">
        <div class="extensions-item-list" aria-label="Provider fixtures">
          ${fixtures.map((fixture) => {
            const install = installForFixture(fixture.fixtureId);
            const isSelected = state.focusId === fixture.focusId
              || (install && (selectedId === install.id || state.focusId === `extensions:local:${install.id}`));
            return `
            <button class="extensions-list-row ${isSelected ? 'is-selected' : ''}" type="button" data-extensions-action="select-fixture" data-fixture-id="${escapeHtml(fixture.fixtureId)}" data-inspector-focus="${escapeHtml(fixture.focusId)}">
              <span class="extensions-list-badge">${install ? 'installed' : escapeHtml(label(fixture.state))}</span>
              <div><strong>${escapeHtml(fixture.label)}</strong><p>${escapeHtml(fixture.permissions)}</p></div>
            </button>
          `;
          }).join('')}
        </div>
        ${renderExtensionsReadingPane()}
      </div>
      ${renderExtensionsProvisionSheet()}
    </div>
  `;
}

function renderSettingsLocalReceipts(key) {
  const receipts = (state.settings.receipts || []).filter((entry) => !key || entry.key === key);
  if (!receipts.length) return '<p class="form-hint">No local settings receipts yet.</p>';
  return receipts.map((receipt) => `
    <article class="local-receipt-row">
      <header><strong>${escapeHtml(receipt.title)}</strong><span>${escapeHtml(label(receipt.type))} · local receipt</span></header>
      <p>${escapeHtml(receipt.summary)}</p>
      <p class="form-hint">${escapeHtml(receipt.limitations)}</p>
    </article>
  `).join('');
}

const SETTINGS_POLICY_VALUES = ['blocked', 'disabled', 'false', 'undecided', 'preview_only', 'draft_only'];

function isSettingsGateKey(key) {
  return String(key || '').startsWith('gate:');
}

function renderSettingsGateForm(gateKey) {
  const gate = settingsGateFixtures().find((entry) => entry.gateKey === gateKey);
  const override = gate ? gateOverrideFor(gate.gateKey) : null;
  if (!gate) return '';
  return `
    <form class="inbox-draft-form" data-settings-form="gate" aria-label="Gate planning">
      <input type="hidden" name="gateKey" value="${escapeHtml(gate.gateKey)}" />
      <label for="gate-notes-edit">Planning notes</label>
      <textarea id="gate-notes-edit" name="notes" rows="2">${escapeHtml(override?.notes || '')}</textarea>
      <label for="gate-control-edit">Preview control label</label>
      <input id="gate-control-edit" name="previewControl" type="text" autocomplete="off" value="${escapeHtml(override?.previewControl || gate.control)}" />
      <p class="form-hint">Fixture: ${escapeHtml(gate.summary)}</p>
      <div class="inbox-form-actions">
        <button class="inbox-action-btn is-primary" type="submit" data-settings-action="gate-save">Save</button>
        <button class="inbox-action-btn is-blocked" type="button" disabled>Connect blocked</button>
      </div>
    </form>
  `;
}

function renderSettingsPolicyForm(policyKey) {
  const policy = settingsPolicyFixtures().find((entry) => entry.policyKey === policyKey);
  const override = policy ? policyOverrideFor(policy.policyKey) : null;
  if (!policy) return '';
  return `
    <form class="inbox-draft-form" data-settings-form="policy" aria-label="Policy preview">
      <input type="hidden" name="policyKey" value="${escapeHtml(policy.policyKey)}" />
      <label for="policy-value-edit">Preview value</label>
      <select id="policy-value-edit" name="previewValue">
        ${SETTINGS_POLICY_VALUES.map((value) => `
          <option value="${escapeHtml(value)}" ${(override?.previewValue || policy.value) === value ? 'selected' : ''}>${escapeHtml(label(value))}</option>
        `).join('')}
      </select>
      <label for="policy-notes-edit">Planning notes</label>
      <textarea id="policy-notes-edit" name="notes" rows="2">${escapeHtml(override?.notes || '')}</textarea>
      <p class="form-hint">${escapeHtml(policy.summary)}</p>
      <div class="inbox-form-actions">
        <button class="inbox-action-btn is-primary" type="submit" data-settings-action="policy-save">Save</button>
        <button class="inbox-action-btn is-blocked" type="button" disabled>Apply blocked</button>
      </div>
    </form>
  `;
}

function renderSettingsEditSheet() {
  const key = state.settings.selectedKey || '';
  const isGate = isSettingsGateKey(key);
  const gate = isGate ? settingsGateFixtures().find((entry) => entry.gateKey === key) : null;
  const policy = !isGate ? settingsPolicyFixtures().find((entry) => entry.policyKey === key) : null;
  const title = gate?.label || policy?.label || 'Setting';
  return `
    <div class="lane-compose-root settings-compose-root ${state.settings.formOpen ? 'is-open' : ''}" aria-hidden="${state.settings.formOpen ? 'false' : 'true'}">
      <button class="lane-compose-backdrop" type="button" data-settings-action="close-form" aria-label="Close"></button>
      <section class="lane-compose-sheet" role="dialog" aria-modal="true" aria-label="Edit setting">
        <header class="lane-compose-head">
          <h3>${escapeHtml(title)}</h3>
          <button class="inbox-action-btn" type="button" data-settings-action="close-form">Close</button>
        </header>
        ${isGate ? renderSettingsGateForm(key) : renderSettingsPolicyForm(key)}
      </section>
    </div>
  `;
}

function renderUserPreferencesPane() {
  const prefs = state.settings.userPrefs || defaultSettingsOps().userPrefs;
  return `
    <section class="lane-reading-pane" aria-label="User preferences">
      <header class="lane-reading-head">
        <div>
          <h3>User preferences</h3>
          <p class="lane-reading-meta">Local preview only · no runtime apply</p>
        </div>
      </header>
      <form class="inbox-draft-form" data-settings-form="preferences" aria-label="User preferences">
        <label for="pref-density">Display density</label>
        <select id="pref-density" name="displayDensity">
          <option value="compact" ${prefs.displayDensity === 'compact' ? 'selected' : ''}>Compact</option>
          <option value="comfortable" ${prefs.displayDensity === 'comfortable' ? 'selected' : ''}>Comfortable</option>
          <option value="spacious" ${prefs.displayDensity === 'spacious' ? 'selected' : ''}>Spacious</option>
        </select>
        <label for="pref-mailbox">Default mailbox on open</label>
        <select id="pref-mailbox" name="defaultMailbox">
          <option value="inbox" ${prefs.defaultMailbox === 'inbox' ? 'selected' : ''}>Inbox</option>
          <option value="drafts" ${prefs.defaultMailbox === 'drafts' ? 'selected' : ''}>Drafts</option>
          <option value="approval-queue" ${prefs.defaultMailbox === 'approval-queue' ? 'selected' : ''}>Approval queue</option>
        </select>
        <label class="checkbox-row">
          <input type="checkbox" name="desktopNotifications" ${prefs.desktopNotifications ? 'checked' : ''} />
          Desktop notifications (preview toggle — delivery blocked)
        </label>
        <div class="inbox-form-actions">
          <button class="inbox-action-btn is-primary" type="submit">Save preferences</button>
        </div>
      </form>
    </section>
  `;
}

function renderSettingsReadingPane() {
  const key = state.settings.selectedKey;
  if (key === 'user:preferences') return renderUserPreferencesPane();
  const gate = isSettingsGateKey(key) ? settingsGateFixtures().find((entry) => entry.gateKey === key) : null;
  const policy = !gate ? settingsPolicyFixtures().find((entry) => entry.policyKey === key) : null;
  const gateOverride = gate ? gateOverrideFor(gate.gateKey) : null;
  const policyOverride = policy ? policyOverrideFor(policy.policyKey) : null;
  if (gate) {
    return `
      <section class="lane-reading-pane" aria-label="Gate details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(gate.label)}</h3>
            <p class="lane-reading-meta">${escapeHtml(label(gate.state))} · provider gate</p>
          </div>
        </header>
        <p>${escapeHtml(gate.summary)}</p>
        <p><strong>Control:</strong> ${escapeHtml(gateOverride?.previewControl || gate.control)}</p>
        ${gateOverride?.notes ? `<p><strong>Notes:</strong> ${escapeHtml(gateOverride.notes)}</p>` : ''}
        <div class="inbox-action-toolbar">
          <button class="inbox-action-btn is-primary" type="button" data-settings-action="edit-item" data-settings-key="${escapeHtml(gate.gateKey)}">Edit planning notes</button>
          <button class="inbox-action-btn is-blocked" type="button" disabled>Connect blocked</button>
        </div>
        ${(state.settings.receipts || []).filter((r) => r.key === gate.gateKey).length ? `
          <details class="lane-reading-details"><summary>Receipts</summary>${renderSettingsLocalReceipts(gate.gateKey)}</details>
        ` : ''}
      </section>
    `;
  }
  if (policy) {
    return `
      <section class="lane-reading-pane" aria-label="Policy details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(policy.label)}</h3>
            <p class="lane-reading-meta">policy · ${escapeHtml(label(policyOverride?.previewValue || policy.value))}</p>
          </div>
        </header>
        <p>${escapeHtml(policy.summary)}</p>
        <p><strong>Fixture value:</strong> ${escapeHtml(policy.value)}</p>
        ${policyOverride?.notes ? `<p><strong>Notes:</strong> ${escapeHtml(policyOverride.notes)}</p>` : ''}
        <div class="inbox-action-toolbar">
          <button class="inbox-action-btn is-primary" type="button" data-settings-action="edit-item" data-settings-key="${escapeHtml(policy.policyKey)}">Edit preview value</button>
          <button class="inbox-action-btn is-blocked" type="button" disabled>Apply blocked</button>
        </div>
        ${(state.settings.receipts || []).filter((r) => r.key === policy.policyKey).length ? `
          <details class="lane-reading-details"><summary>Receipts</summary>${renderSettingsLocalReceipts(policy.policyKey)}</details>
        ` : ''}
      </section>
    `;
  }
  return `<section class="lane-reading-pane is-empty" aria-label="Setting details"><p class="lane-empty-state">Select a gate or policy.</p></section>`;
}

function renderSettingsWorkspace() {
  const gates = settingsGateFixtures();
  const policies = settingsPolicyFixtures();
  const selectedKey = state.settings.selectedKey;
  return `
    <div class="lane-workspace settings-workspace">
      <div class="lane-toolbar" role="toolbar" aria-label="Settings actions">
        <div id="settingsStatusRegion" class="inbox-status-region is-compact" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'settings' ? state.statusMessage : '')}</div>
        <details class="lane-toolbar-overflow">
          <summary>More</summary>
          <button class="inbox-action-btn is-danger" type="button" data-settings-action="clear-all">Clear local settings state</button>
        </details>
      </div>
      <div class="lane-workspace-grid settings-workspace-grid">
        <div class="settings-item-list" aria-label="Gates and policies">
          <button class="settings-list-row ${selectedKey === 'user:preferences' ? 'is-selected' : ''}" type="button" data-settings-action="select-preferences" data-settings-key="user:preferences" data-inspector-focus="settings:local:preferences">
            <span class="settings-list-badge">user</span>
            <div><strong>User preferences</strong><p>Density, default mailbox, notifications</p></div>
          </button>
          ${gates.map((gate) => `
            <button class="settings-list-row ${selectedKey === gate.gateKey ? 'is-selected' : ''}" type="button" data-settings-action="select-gate" data-settings-key="${escapeHtml(gate.gateKey)}" data-inspector-focus="${escapeHtml(`settings:local:gate:${gate.gateKey}`)}">
              <span class="settings-list-badge">gate</span>
              <div><strong>${escapeHtml(gate.label)}</strong><p>${escapeHtml(gate.control)}</p></div>
            </button>
          `).join('')}
          ${policies.map((policy) => `
            <button class="settings-list-row ${selectedKey === policy.policyKey ? 'is-selected' : ''}" type="button" data-settings-action="select-policy" data-settings-key="${escapeHtml(policy.policyKey)}" data-inspector-focus="${escapeHtml(`settings:local:policy:${policy.policyKey}`)}">
              <span class="settings-list-badge">policy</span>
              <div><strong>${escapeHtml(policy.label)}</strong><p>${escapeHtml(policy.value)}</p></div>
            </button>
          `).join('')}
        </div>
        ${renderSettingsReadingPane()}
      </div>
      ${renderSettingsEditSheet()}
    </div>
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

function activityKindMatches(kind, filter) {
  if (filter === 'all') return true;
  if (filter === 'build') return kind === 'proof';
  if (filter === 'user') return kind !== 'proof';
  if (filter === 'proposals') return ['proposal', 'draft'].includes(kind);
  if (filter === 'blocked') return ['gate', 'blocked'].includes(kind);
  if (filter === 'sent') return kind === 'send_sim';
  return true;
}

function activityLedgerRows() {
  const content = activeLaneContent();
  const section = sectionByType(content, 'receipt-ledger');
  const sectionIndex = (content.sections || []).findIndex((entry) => entry === section);
  const rows = (section?.rows || []).map((row, index) => ({
    kind: row.kind || 'proof',
    title: row.title,
    source: row.source,
    state: row.state,
    focusId: `receipts:receipt-ledger:${sectionIndex}:${index}`,
  }));
  allSentEvents().forEach((event) => {
    rows.push({
      kind: 'send_sim',
      title: event.subject || 'Simulated send',
      source: `draft:${event.draft_id || ''}`,
      state: 'dry_run_only',
      focusId: `sent-event:${event.id}`,
    });
  });
  return rows;
}

function renderActivityLedgerTable() {
  const filter = state.activity.filter || 'user';
  const rows = activityLedgerRows().filter((row) => activityKindMatches(row.kind, filter));
  return `
    <div class="receipt-ledger-table" role="table" aria-label="Activity ledger">
      <div class="receipt-ledger-head" role="row">
        <span role="columnheader">Type</span>
        <span role="columnheader">What happened</span>
        <span role="columnheader">Source</span>
        <span role="columnheader">State</span>
      </div>
      ${rows.length ? rows.map((row) => {
    const focused = state.focusId === row.focusId;
    return `
        <button class="receipt-ledger-row is-inspector-focusable ${row.kind === 'send_sim' ? 'is-local-sent' : ''} ${focused ? 'is-inspector-focused' : ''}" type="button" role="row" data-inspector-focus="${escapeHtml(row.focusId)}" aria-selected="${focused ? 'true' : 'false'}">
          <span class="receipt-kind receipt-kind-${escapeHtml(row.kind)}" role="cell">${escapeHtml(row.kind)}</span>
          <strong role="cell">${escapeHtml(row.title)}</strong>
          <span role="cell">${escapeHtml(row.source)}</span>
          <span class="receipt-state" role="cell">${escapeHtml(label(row.state || 'preview_only'))}</span>
        </button>
      `;
  }).join('') : '<p class="lane-empty-state">No entries for this filter.</p>'}
    </div>
  `;
}

function renderActivityWorkspace() {
  const filter = state.activity.filter || 'user';
  const groupsSection = sectionByType(activeLaneContent(), 'receipt-groups');
  return `
    <div class="lane-workspace activity-workspace">
      <div class="lane-toolbar" role="toolbar" aria-label="Activity filters">
        <div class="activity-filter-bar" role="tablist" aria-label="Filter activity">
          ${ACTIVITY_FILTERS.map((entry) => `
            <button class="activity-filter-btn ${filter === entry.id ? 'is-active' : ''}" type="button" role="tab" aria-selected="${filter === entry.id ? 'true' : 'false'}" data-activity-action="set-filter" data-activity-filter="${escapeHtml(entry.id)}">${escapeHtml(entry.label)}</button>
          `).join('')}
        </div>
      </div>
      <p class="form-hint activity-subtitle">Audit trail of drafts, proposals, blocked actions, and simulated sends. Build/CI evidence is under <strong>Build evidence</strong>.</p>
      ${renderActivityLedgerTable()}
      ${groupsSection ? `
        <details class="lane-reading-details activity-advanced">
          <summary>What we record (advanced)</summary>
          ${renderReceiptGroups(groupsSection)}
        </details>
      ` : ''}
    </div>
  `;
}

function renderReceiptLedger(section) {
  return renderActivityLedgerTable();
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
      <header class="lane-header${['inbox', 'calendar', 'tasks', 'automations', 'extensions', 'settings', 'receipts'].includes(lane.id) ? ' is-compact' : ''}">
        <div>
          ${['inbox', 'calendar', 'tasks', 'automations', 'extensions', 'settings', 'receipts'].includes(lane.id) ? '' : `<p class="eyebrow">${escapeHtml(content.eyebrow || lane.id)}</p>`}
          <h2>${escapeHtml({ inbox: 'Inbox', calendar: 'Calendar', tasks: 'Tasks', automations: 'Automations', extensions: 'Extensions', settings: 'Settings', receipts: 'Activity' }[lane.id] || (content.title || lane.label))}</h2>
          ${['inbox', 'calendar', 'tasks', 'automations', 'extensions', 'settings', 'receipts'].includes(lane.id) ? '' : `<p>${escapeHtml(content.summary || lane.description || '')}</p>`}
        </div>
        ${['inbox', 'calendar', 'tasks', 'automations', 'extensions', 'settings', 'receipts'].includes(lane.id) ? '' : `
        <div class="lane-status-line">
          <span>${escapeHtml(label(content.proofState || lane.status || 'preview_only'))}</span>
          <span>${escapeHtml(label(lane.status || 'preview_only'))}</span>
        </div>`}
      </header>

      ${['inbox', 'calendar', 'tasks', 'automations', 'extensions', 'settings'].includes(lane.id) ? '' : `
      <section class="metric-grid" aria-label="${escapeHtml(lane.label)} preview metrics">
        ${(content.metrics || content.primary || []).map(renderMetricCard).join('')}
      </section>`}

      <div class="lane-content ${escapeHtml(content.layout || `${lane.id}-layout`)}${lane.id === 'inbox' ? ' is-inbox-lane' : ''}${lane.id === 'receipts' ? ' is-receipts-lane' : ''}${lane.id === 'ibal' ? ' is-ibal-lane' : ''}${lane.id === 'settings' ? ' is-settings-lane' : ''}${lane.id === 'calendar' ? ' is-calendar-lane' : ''}${lane.id === 'tasks' ? ' is-tasks-lane' : ''}${lane.id === 'automations' ? ' is-automations-lane' : ''}${lane.id === 'extensions' ? ' is-extensions-lane' : ''}">
        ${lane.id === 'inbox' ? renderInboxWorkspace() : ''}
        ${lane.id === 'calendar' ? renderCalendarWorkspace() : ''}
        ${lane.id === 'tasks' ? renderTasksWorkspace() : ''}
        ${lane.id === 'automations' ? renderAutomationsWorkspace() : ''}
        ${lane.id === 'extensions' ? renderExtensionsWorkspace() : ''}
        ${lane.id === 'settings' ? renderSettingsWorkspace() : ''}
        ${lane.id === 'receipts' ? renderActivityWorkspace() : ''}
        ${['inbox', 'calendar', 'tasks', 'automations', 'extensions', 'settings', 'receipts'].includes(lane.id) ? '' : (content.sections || []).map(renderLaneSection).join('')}
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
  const railMode = inboxCommandRailMode();

  if (state.laneId === 'inbox' && railMode === 'batch') {
    const queued = queuedDrafts();
    const approved = approvedDrafts();
    const selected = selectedDraft();
    const sharedRisks = [];
    if (queued.some((draft) => !draft.recipients?.length)) sharedRisks.push('Missing recipients on one or more drafts');
    if (queued.some((draft) => !draft.subject?.trim())) sharedRisks.push('Missing subject on one or more drafts');
    return {
      kind: 'batch',
      mode: 'batch',
      title: 'Approval queue',
      summary: `${queued.length} awaiting approval · ${approved.length} approved (send blocked).`,
      context: selected
        ? `Selected: ${selected.subject || '(no subject)'} (${label(selected.approval_state)}).`
        : 'Select a queued draft to review before batch approve.',
      why: 'Batch approve is high-risk egress; shared risks must be visible before human approval.',
      evidence: `Queue: ${queued.map((d) => d.subject || d.id).join('; ') || 'empty'}.`,
      safeNext: queued.length
        ? `Review ${queued.length} queued draft(s), then batch approve or approve individually. Send stays blocked.`
        : 'Queue empty — submit drafts from Drafts view.',
      blocked: 'Send, provider write, and runtime execution remain blocked in Tier 1.',
      ibalProposal: laneInspector.ibalProposal || 'Ibal may flag shared risks but cannot send.',
      receipts: (state.drafts.receipts || []).slice(0, 3).map((entry) => `${entry.title}: ${entry.summary}`).join(' ') || 'Approval receipts appear after approve actions.',
      sharedRisks,
      queuedCount: queued.length,
    };
  }

  if (focusItem?.id?.startsWith('inbox-draft:')) {
    const draftId = focusItem.id.replace('inbox-draft:', '');
    const draft = draftById(draftId);
    const receipts = (state.drafts.receipts || []).filter((entry) => entry.draftId === draftId);
    const checks = preSendChecksForDraft(draft);
    return {
      kind: 'draft',
      mode: 'draft',
      title: draft?.subject || '(no subject)',
      summary: `${draft?.kind || 'draft'} · ${label(draft?.status || 'drafting')} · ${label(draft?.approval_state || 'none')}`,
      context: `Draft object ${draftId}. ${draft?.source_thread_id ? `Source thread: ${draft.source_thread_id}.` : 'Compose draft (no source thread).'}`,
      why: 'Draft is the controllable work artifact; send is the event boundary (blocked in Tier 1).',
      evidence: `Pre-send checks: ${checks.join('; ')}.`,
      safeNext: draft?.approval_state === 'approved'
        ? 'Approved for send — provider send blocked until Tier 2 gates clear.'
        : (draft?.approval_state === 'queued'
          ? 'Approve for send or return to drafts.'
          : 'Edit draft, then submit for approval.'),
      blocked: 'Send, forward, provider write, and automation execution remain blocked.',
      ibalProposal: laneInspector.ibalProposal || 'Ibal may propose pre-send checks but cannot send.',
      receipts: receipts.length
        ? receipts.map((entry) => `${entry.title}: ${entry.summary}`).join(' ')
        : 'Draft receipt appears after save or approval action.',
      preSendChecks: checks,
      sendConsequences: draft?.status === 'sent'
        ? (draft.post_send_plan || []).map((step) => step.summary || step)
        : sendConsequencePreview(draft),
    };
  }

  if (focusItem?.id?.startsWith('sent-event:')) {
    const eventId = focusItem.id.replace('sent-event:', '');
    const event = sentEventById(eventId);
    const receipts = (state.sentEvents.receipts || []).filter((entry) => entry.eventId === eventId);
    return {
      kind: 'sent',
      mode: 'sent',
      title: event?.subject || 'Simulated send event',
      summary: `Dry-run ${event?.created_at || ''}. No provider delivery.`,
      context: `Sent-event ${eventId} from draft ${event?.draft_id || 'unknown'}.`,
      why: 'Post-send fan-out creates local proposals and receipts only in Tier 1.',
      evidence: (event?.post_send_plan || []).map((step) => step.summary).join('; ') || 'No plan recorded.',
      safeNext: 'Review linked task/calendar proposals; runtime sync remains blocked.',
      blocked: 'Provider send replay, disclose, and runtime mutation remain blocked.',
      ibalProposal: laneInspector.ibalProposal,
      receipts: receipts.length
        ? receipts.map((entry) => `${entry.title}: ${entry.summary}`).join(' ')
        : 'Sent-event receipt recorded on simulate.',
    };
  }

  if (state.laneId === 'receipts') {
    const events = allSentEvents();
    return {
      kind: 'sent',
      mode: 'sent',
      title: 'Activity',
      summary: `Audit trail: ${events.length} simulated send(s). Filter by type above.`,
      context: events.length
        ? `Latest: ${events[0].subject || events[0].id} (${events[0].created_at}).`
        : 'No simulated sends yet. Approve a draft and run Simulate send in Approval Queue.',
      why: 'Receipts prove controlled egress boundaries; sent events fan out downstream proposals.',
      evidence: 'Local receipts in drafts/sentEvents namespaces; fixture samples in payload.',
      safeNext: events.length ? 'Select a sent event row to inspect post-send plan.' : 'Complete draft → approve → simulate send workflow.',
      blocked: 'Provider send replay, disclose, and runtime mutation remain blocked.',
      ibalProposal: laneInspector.ibalProposal,
      receipts: laneInspector.receipts || 'Receipt expectation documented per action.',
    };
  }

  if (focusItem?.id?.startsWith('settings:local:gate:')) {
    const gateKey = focusItem.id.replace('settings:local:gate:', '');
    const gate = settingsGateFixtures().find((entry) => entry.gateKey === gateKey);
    const override = gateOverrideFor(gateKey);
    const receipts = (state.settings.receipts || []).filter((entry) => entry.key === gateKey);
    return {
      kind: focusItem.kind,
      title: focusItem.title,
      summary: focusItem.summary,
      context: `Local gate planning for ${gate?.label || gateKey}. Fixture state: ${label(gate?.state || 'runtime_blocked')}.`,
      why: override?.notes || gate?.summary || 'Gate planning records intent before any future provider/runtime decision.',
      evidence: `Fixture control: ${gate?.control || 'n/a'}. Local preview control: ${override?.previewControl || gate?.control || 'n/a'}.`,
      safeNext: 'Refine planning notes; keep provider connect and credential storage blocked.',
      blocked: 'Provider connect, OAuth, credential storage, and runtime gate apply remain blocked.',
      ibalProposal: laneInspector.ibalProposal || 'Ibal proposes keeping gates closed until ARCH-004 resolves.',
      receipts: receipts.length
        ? receipts.map((entry) => `${entry.title}: ${entry.summary}`).join(' ')
        : 'Gate receipt appears after saving local notes.',
    };
  }

  if (focusItem?.id?.startsWith('settings:local:policy:')) {
    const policyKey = focusItem.id.replace('settings:local:policy:', '');
    const policy = settingsPolicyFixtures().find((entry) => entry.policyKey === policyKey);
    const override = policyOverrideFor(policyKey);
    const receipts = (state.settings.receipts || []).filter((entry) => entry.key === policyKey);
    return {
      kind: focusItem.kind,
      title: focusItem.title,
      summary: focusItem.summary,
      context: `Local policy preview for ${policyKey}. Fixture value: ${policy?.value || 'n/a'}.`,
      why: override?.notes || policy?.summary || 'Policy preview records planning only; runtime apply is blocked.',
      evidence: `Fixture: ${policy?.value || 'n/a'}. Local preview: ${override?.previewValue || policy?.value || 'n/a'}.`,
      safeNext: 'Adjust local preview value; do not assume runtime policy changed.',
      blocked: 'Runtime policy apply, provider mutation, and credential storage remain blocked.',
      ibalProposal: laneInspector.ibalProposal || 'Ibal may reference policy defaults but cannot apply them.',
      receipts: receipts.length
        ? receipts.map((entry) => `${entry.title}: ${entry.summary}`).join(' ')
        : 'Policy receipt appears after saving preview value.',
    };
  }

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
      kind: 'thread',
      mode: 'thread',
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

function renderInboxCommandRail(mode, inspector) {
  if (mode === 'batch') {
    const queued = queuedDrafts();
    const selected = selectedDraft();
    return `
      <div class="inbox-action-toolbar" role="toolbar" aria-label="Batch approval actions">
        ${queued.length ? `<button class="inbox-action-btn is-primary" type="button" data-inbox-action="draft-batch-approve-all">Approve all queued (${queued.length})</button>` : ''}
        ${selected?.approval_state === 'queued' ? `<button class="inbox-action-btn" type="button" data-inbox-action="draft-approve" data-draft-id="${escapeHtml(selected.id)}">Approve selected</button>` : ''}
        <button class="inbox-action-btn is-blocked" type="button" disabled>Send blocked (Tier 1)</button>
      </div>
      ${inspector.sharedRisks?.length ? `<ul class="rail-risk-list">${inspector.sharedRisks.map((risk) => `<li>${escapeHtml(risk)}</li>`).join('')}</ul>` : ''}
    `;
  }
  if (mode === 'draft') {
    const draft = selectedDraft();
    if (!draft) return '';
    return `
      <div class="inbox-action-toolbar" role="toolbar" aria-label="Draft actions">
        ${draft.approval_state === 'none' ? `<button class="inbox-action-btn is-primary" type="button" data-inbox-action="draft-queue" data-draft-id="${escapeHtml(draft.id)}">Submit for approval</button>` : ''}
        ${draft.approval_state === 'queued' ? `<button class="inbox-action-btn is-primary" type="button" data-inbox-action="draft-approve" data-draft-id="${escapeHtml(draft.id)}">Approve for send</button>` : ''}
        ${draft.approval_state === 'approved' && draft.status !== 'sent' ? `<button class="inbox-action-btn is-primary" type="button" data-inbox-action="draft-simulate-send" data-draft-id="${escapeHtml(draft.id)}">Simulate send</button>` : ''}
        ${draft.approval_state === 'approved' && draft.status !== 'sent' ? `<button class="inbox-action-btn is-blocked" type="button" disabled>Provider send blocked</button>` : ''}
        ${['queued', 'approved'].includes(draft.approval_state) && draft.status !== 'sent' ? `<button class="inbox-action-btn" type="button" data-inbox-action="draft-dequeue" data-draft-id="${escapeHtml(draft.id)}">Return to drafts</button>` : ''}
      </div>
      ${inspector.preSendChecks?.length ? `<ul class="rail-check-list">${inspector.preSendChecks.map((check) => `<li>${escapeHtml(check)}</li>`).join('')}</ul>` : ''}
      ${inspector.sendConsequences?.length ? `<ul class="rail-check-list">${inspector.sendConsequences.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
    `;
  }
  if (mode === 'thread' && state.threadId) {
    return `
      <div class="inbox-action-toolbar" role="toolbar" aria-label="Thread actions">
        <button class="inbox-action-btn is-primary" type="button" data-inbox-action="toggle-reply" data-thread-id="${escapeHtml(state.threadId)}" aria-expanded="${state.inbox.replyOpen ? 'true' : 'false'}">Reply</button>
        <button class="inbox-action-btn" type="button" data-inbox-action="mark-reviewed" data-thread-id="${escapeHtml(state.threadId)}">Mark read</button>
        <button class="inbox-action-btn" type="button" data-inbox-action="defer-thread" data-thread-id="${escapeHtml(state.threadId)}">Defer</button>
        <button class="inbox-action-btn" type="button" data-inbox-action="task-proposal" data-thread-id="${escapeHtml(state.threadId)}">Add task</button>
        <button class="inbox-action-btn" type="button" data-inbox-action="calendar-proposal" data-thread-id="${escapeHtml(state.threadId)}">Schedule</button>
      </div>
    `;
  }
  return '';
}

function renderInspector() {
  const lane = activeLane();
  const inspector = activeInspectorModel();
  const railMode = inspector.mode || inboxCommandRailMode() || inspector.kind || 'lane';
  const inboxRail = state.laneId === 'inbox' ? renderInboxCommandRail(railMode, inspector) : '';
  const inboxOutcomes = state.laneId === 'inbox' && ['thread', 'draft', 'batch'].includes(railMode)
    ? renderRailOutcomesBlock({
      threadId: railMode === 'thread' ? state.threadId : null,
      draft: railMode === 'draft' || railMode === 'batch' ? selectedDraft() : null,
    })
    : '';
  return `
    <aside class="right-inspector context-command-rail" aria-label="Contextual command rail" data-rail-mode="${escapeHtml(railMode)}">
      <header class="inspector-title">
        <p class="inspector-rail-mode">${escapeHtml(String(railMode))} mode</p>
        <h2 class="inspector-selected-title">${escapeHtml(inspector.title || lane.label)}</h2>
        <p class="inspector-command-hint">${escapeHtml(inspector.safeNext || 'Review context and keep actions in draft or proposal mode.')}</p>
      </header>
      <section class="inspector-block inspector-commands">
        <h3>Commands</h3>
        ${inboxRail}
        <div class="inspector-ibal-actions">
          <button class="inbox-action-btn" type="button" data-ibal-action="toggle-open">Ask Ibal</button>
          <button class="inbox-action-btn is-blocked" type="button" disabled>Execute blocked</button>
        </div>
      </section>
      ${inboxOutcomes}
      <details class="inspector-meta-collapsed">
        <summary>Context and evidence</summary>
        ${renderInspectorBlock('What is selected', inspector.context || 'Lane-level context only. No provider record is loaded.')}
        ${renderInspectorBlock('Why it matters', inspector.why || 'Context helps determine the next safe action without runtime writes.')}
        ${renderInspectorBlock('Evidence', inspector.evidence || 'Evidence references remain preview-only until provider gates are decided.')}
        ${inspector.sendConsequences?.length ? renderInspectorBlock('Send consequences (preview)', inspector.sendConsequences.join('; ')) : ''}
        <section class="inspector-block">
          <h3>Blocked actions</h3>
          <p>${escapeHtml(inspector.blocked || 'Draft creation may be previewed. Send, forward, delete, disclose, publish, deploy, and provider mutation remain blocked.')}</p>
          ${renderDisabledActions()}
        </section>
        ${renderInspectorBlock('Ibal proposal', inspector.ibalProposal || selectedIbalProposal()?.recommendation || 'Ibal proposes only in this preview and cannot execute actions.')}
        ${renderInspectorBlock('Receipt expectation', inspector.receipts || 'Receipts are first-class audit placeholders. No confirmed runtime action exists.')}
      </details>
    </aside>
  `;
}

function renderIbalProposalCard(proposal) {
  if (!proposal) return '';
  return `
    <article class="ibal-proposal-card" aria-label="Ibal proposal">
      <header>
        <strong>${escapeHtml(proposal.title)}</strong>
        <span>${escapeHtml(label(proposal.state))}</span>
      </header>
      <p>${escapeHtml(proposal.recommendation)}</p>
      <dl class="ibal-proposal-meta">
        <div><dt>Why</dt><dd>${escapeHtml(proposal.why)}</dd></div>
        <div><dt>Evidence</dt><dd>${escapeHtml(proposal.evidence)}</dd></div>
        <div><dt>Blockers</dt><dd>${escapeHtml(proposal.blockers)}</dd></div>
        <div><dt>Safe next</dt><dd>${escapeHtml(proposal.safeNext)}</dd></div>
      </dl>
      ${proposal.criteria?.length ? `<ul class="ibal-proposal-criteria">${proposal.criteria.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
      <div class="inbox-form-actions">
        <button class="inbox-action-btn is-primary" type="button" data-ibal-action="save-receipt" data-proposal-id="${escapeHtml(proposal.id)}">Save proposal receipt</button>
        <button class="inbox-action-btn is-blocked" type="button" disabled>Auto-execute blocked</button>
      </div>
    </article>
  `;
}

function renderAccountSessionPanel() {
  const accounts = allPreviewAccounts();
  const workspaces = workspaceOptions();
  const activeAccount = selectedAccountFixture();
  const activeAccountId = activeAccount?.accountId || '';
  const activeWorkspaceId = state.account.workspaceId || workspaces[0]?.id || '';
  const editing = state.account.editingAccountId
    ? accounts.find((entry) => entry.accountId === state.account.editingAccountId)
    : null;
  return `
    <div class="account-session-root ${state.account.open ? 'is-open' : ''}" aria-hidden="${state.account.open ? 'false' : 'true'}">
      <button class="account-session-backdrop" type="button" data-account-action="close" aria-label="Close account session panel"></button>
      <aside id="accountSessionPanel" class="account-session-panel" role="dialog" aria-modal="true" aria-label="Account and session preview" tabindex="-1">
        <header class="account-session-head">
          <div class="user-card-header">
            <span class="user-card-avatar is-large" aria-hidden="true">${escapeHtml((activeSessionDisplayName() || 'P').slice(0, 1).toUpperCase())}</span>
            <div>
              <p class="section-eyebrow">account / session</p>
              <h2>${escapeHtml(activeSessionDisplayName())}</h2>
              <p>${escapeHtml(activeAccount?.displayName || '')} · ${escapeHtml(label(activeAccount?.syncState || 'provider_blocked'))}</p>
            </div>
          </div>
          <button class="inbox-action-btn" type="button" data-account-action="close">Close</button>
        </header>
        <form class="inbox-draft-form" data-account-form="session" aria-label="Preview session shell">
          <label for="account-workspace">Workspace (preview)</label>
          <select id="account-workspace" name="workspaceId">
            ${workspaces.map((entry) => `
              <option value="${escapeHtml(entry.id)}" ${entry.id === activeWorkspaceId ? 'selected' : ''}>${escapeHtml(entry.label)}</option>
            `).join('')}
          </select>
          <label for="account-display-name">Session display name (preview)</label>
          <input id="account-display-name" name="sessionDisplayName" type="text" autocomplete="off" value="${escapeHtml(state.account.sessionDisplayName || '')}" placeholder="${escapeHtml(activeAccount?.displayName || 'Preview user')}" />
          <label for="account-session-notes">Session notes (local)</label>
          <textarea id="account-session-notes" name="sessionNotes" rows="2">${escapeHtml(state.account.sessionNotes || '')}</textarea>
          <p class="form-hint">Planning labels only. No passwords, tokens, or OAuth secrets stored.</p>
          <div class="inbox-form-actions">
            <button class="inbox-action-btn is-primary" type="submit" data-account-action="session-save">Save preview session</button>
            <button class="inbox-action-btn is-blocked" type="button" disabled>Sign in blocked</button>
            <button class="inbox-action-btn is-blocked" type="button" disabled>OAuth blocked</button>
          </div>
        </form>
        <section class="account-switch-list" aria-label="Email accounts">
          <div class="inbox-form-actions">
            <h3>Email accounts (${accounts.length})</h3>
            <button class="inbox-action-btn is-primary" type="button" data-account-action="add-account">Add Gmail account</button>
          </div>
          ${state.account.accountFormOpen ? `
            <form class="inbox-draft-form" data-account-form="connect" aria-label="Add Gmail account">
              <label for="account-email-input">Gmail address</label>
              <input id="account-email-input" name="email" type="email" required autocomplete="email" placeholder="you@gmail.com" />
              <p class="form-hint">Real connect uses the local metadata adapter (GMAIL-001C). Tokens stay in tools/gmail/data/ — never in this browser preview.</p>
              <div class="inbox-form-actions">
                <button class="inbox-action-btn is-primary" type="submit">Queue account</button>
                <button class="inbox-action-btn" type="button" data-account-action="cancel-account-form">Cancel</button>
              </div>
            </form>
          ` : ''}
          ${accounts.length ? accounts.map((account) => `
            <article class="account-switch-row ${account.accountId === activeAccountId ? 'is-active' : ''}">
              <div>
                <strong>${escapeHtml(account.displayName)}</strong>
                <p>${escapeHtml(account.providerId)} · ${escapeHtml(label(account.syncState))}</p>
                <span class="form-hint">unread ${account.counts?.unread ?? 0} · needs reply ${account.counts?.needsReply ?? 0}</span>
              </div>
              <div class="inbox-form-actions">
                <button class="inbox-action-btn ${account.accountId === activeAccountId ? '' : 'is-primary'}" type="button" data-account-action="switch-account" data-account-id="${escapeHtml(account.accountId)}" ${account.accountId === activeAccountId ? 'disabled' : ''}>
                  ${account.accountId === activeAccountId ? 'Active' : 'Switch'}
                </button>
                <button class="inbox-action-btn is-primary" type="button" data-account-action="connect-gmail" data-account-id="${escapeHtml(account.accountId)}">Connect Gmail</button>
                <button class="inbox-action-btn is-danger" type="button" data-account-action="remove-account" data-account-id="${escapeHtml(account.accountId)}">Remove</button>
              </div>
            </article>
          `).join('') : '<p class="lane-empty-state">No email accounts yet. Add your Gmail address, then connect via the local adapter CLI.</p>'}
        </section>
        <section class="account-receipt-list" aria-label="Account session receipts">
          <h3>Local receipts (${(state.account.receipts || []).length})</h3>
          ${(state.account.receipts || []).length
    ? (state.account.receipts || []).map((receipt) => `
              <article class="local-receipt-row">
                <header><strong>${escapeHtml(receipt.title)}</strong><span>${escapeHtml(label(receipt.type))} · local receipt</span></header>
                <p>${escapeHtml(receipt.summary)}</p>
                <p class="form-hint">${escapeHtml(receipt.limitations)}</p>
              </article>
            `).join('')
    : '<p class="form-hint">Session and account-switch receipts appear after you save or switch.</p>'}
        </section>
        <div class="inbox-clear-control">
          <button class="inbox-action-btn is-danger" type="button" data-account-action="clear-all">Clear account session preview state</button>
        </div>
      </aside>
    </div>
  `;
}

function renderIbalConciergeDrawer() {
  const messages = state.ibal.messages || [];
  const selected = selectedIbalProposal();
  return `
    <div class="ibal-concierge-root ${state.ibal.open ? 'is-open' : ''}" aria-hidden="${state.ibal.open ? 'false' : 'true'}">
      <button class="ibal-concierge-backdrop" type="button" data-ibal-action="close" aria-label="Close Ibal concierge"></button>
      <aside id="ibalConciergeDrawer" class="ibal-concierge-drawer" role="dialog" aria-modal="true" aria-label="Ibal concierge" tabindex="-1">
        <header class="ibal-concierge-head">
          <div>
            <p class="section-eyebrow">conductor / concierge</p>
            <h2>Ibal</h2>
            <p>Proposal-only assistant. Fixture responses; no model routing or execution.</p>
          </div>
          <button class="inbox-action-btn" type="button" data-ibal-action="close" aria-label="Close concierge">Close</button>
        </header>
        <form class="ibal-concierge-prompt" data-ibal-form="prompt" aria-label="Ask Ibal">
          <label for="ibal-prompt-input">Ask Ibal</label>
          <input id="ibal-prompt-input" name="prompt" type="text" autocomplete="off" placeholder="What is blocked? What should I do next?" value="${escapeHtml(state.ibal.prompt || '')}" />
          <button class="inbox-action-btn is-primary" type="submit" data-ibal-action="submit">Propose</button>
        </form>
        <div class="ibal-message-list" aria-label="Concierge conversation">
          ${messages.length ? messages.map((message) => `
            <article class="ibal-message is-${escapeHtml(message.role)}">
              <header><strong>${message.role === 'ibal' ? 'Ibal' : 'You'}</strong><span>${escapeHtml(new Date(message.createdAt).toLocaleString())}</span></header>
              <p>${escapeHtml(message.text)}</p>
              ${message.proposal ? renderIbalProposalCard(message.proposal) : ''}
            </article>
          `).join('') : '<p class="form-hint">Ask Ibal about the current lane, blockers, or next safe action. Responses are fixture-based previews only.</p>'}
        </div>
        ${selected ? `
          <section class="ibal-selected-proposal" aria-label="Selected proposal context">
            <h3>Selected proposal</h3>
            ${renderIbalProposalCard(selected)}
          </section>
        ` : ''}
        <section class="ibal-receipt-list" aria-label="Ibal local receipts">
          <h3>Local receipts (${(state.ibal.receipts || []).length})</h3>
          ${(state.ibal.receipts || []).length
    ? (state.ibal.receipts || []).map((receipt) => `
              <article class="local-receipt-row">
                <header><strong>${escapeHtml(receipt.title)}</strong><span>ibal · local receipt</span></header>
                <p>${escapeHtml(receipt.summary)}</p>
                <p class="form-hint">${escapeHtml(receipt.limitations)}</p>
              </article>
            `).join('')
    : '<p class="form-hint">Proposal receipts appear after you ask Ibal or save a proposal receipt.</p>'}
        </section>
        <div class="inbox-clear-control">
          <button class="inbox-action-btn is-danger" type="button" data-ibal-action="clear-all">Clear Ibal concierge preview state</button>
        </div>
      </aside>
    </div>
  `;
}

function renderShell() {
  const mount = document.getElementById('inboxPreviewMount');
  if (!mount) return;
  syncMailboxThreadSelection();

  mount.innerHTML = `
    <section class="app-shell" aria-label="xi-io Inbox unified app shell">
      ${renderTopBar()}
      <section class="app-frame app-density-${escapeHtml(state.settings.userPrefs?.displayDensity || 'comfortable')} ${state.laneId === 'inbox' ? 'is-mail-workbench' : ''}">
        ${renderNavigation()}
        ${renderMainLane()}
        ${renderInspector()}
      </section>
    </section>
    ${renderAccountSessionPanel()}
    ${renderIbalConciergeDrawer()}
  `;
}

function handleAccountAction(action, accountId) {
  if (action === 'toggle') {
    toggleAccountSession();
    renderShell();
    if (state.account.open) document.getElementById('accountSessionPanel')?.focus();
    return;
  }
  if (action === 'close') {
    toggleAccountSession(false);
    renderShell();
    return;
  }
  if (action === 'switch-account') {
    switchPreviewAccount(accountId);
    renderShell();
    return;
  }
  if (action === 'add-account') {
    state.account.editingAccountId = null;
    state.account.accountFormOpen = true;
    saveState();
    renderShell();
    return;
  }
  if (action === 'connect-gmail') {
    window.alert(gmailConnectInstructions());
    setStatusMessage('Gmail connect runs in tools/gmail CLI. Metadata only; send blocked.');
    saveState();
    renderShell();
    return;
  }
  if (action === 'cancel-account-form') {
    state.account.editingAccountId = null;
    state.account.accountFormOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'remove-account') {
    if (window.confirm('Remove this account from the list?')) {
      removePreviewAccount(accountId);
      renderShell();
    }
    return;
  }
  if (action === 'clear-all') {
    if (window.confirm('Clear all account session preview state? Lane operability data is preserved.')) {
      clearAccountPreviewState();
      ensureAccountDefaults();
      saveState();
      renderShell();
    }
  }
}

function handleIbalAction(action, proposalId) {
  if (action === 'toggle' || action === 'toggle-open') {
    state.account.open = false;
    toggleIbalConcierge(true);
    renderShell();
    document.getElementById('ibalConciergeDrawer')?.focus();
    return;
  }
  if (action === 'close') {
    toggleIbalConcierge(false);
    renderShell();
    return;
  }
  if (action === 'save-receipt') {
    saveIbalProposalReceipt(proposalId);
    renderShell();
    return;
  }
  if (action === 'clear-all') {
    if (window.confirm('Clear all Ibal concierge messages and receipts?')) {
      clearIbalPreviewState();
      renderShell();
    }
  }
}

function handleSettingsAction(action, settingsKey) {
  if (action === 'edit-item') {
    if (!settingsKey) return;
    state.settings.selectedKey = settingsKey;
    state.focusId = isSettingsGateKey(settingsKey)
      ? `settings:local:gate:${settingsKey}`
      : `settings:local:policy:${settingsKey}`;
    state.settings.formOpen = true;
    saveState();
    renderShell();
    return;
  }
  if (action === 'close-form') {
    state.settings.formOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-preferences') {
    state.settings.selectedKey = 'user:preferences';
    state.focusId = 'settings:local:preferences';
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-gate' || action === 'select-policy') {
    if (!settingsKey) return;
    state.settings.selectedKey = settingsKey;
    state.focusId = action === 'select-gate'
      ? `settings:local:gate:${settingsKey}`
      : `settings:local:policy:${settingsKey}`;
    saveState();
    renderShell();
    return;
  }
  if (action === 'clear-all') {
    if (window.confirm('Clear all local Settings preview overrides and receipts?')) {
      clearSettingsPreviewState();
      renderShell();
    }
  }
}

function handleExtensionsAction(action, installId, fixtureId) {
  if (action === 'select-fixture') {
    if (!fixtureId) return;
    const fixture = extensionFixtures().find((entry) => entry.fixtureId === fixtureId);
    if (!fixture) return;
    state.focusId = fixture.focusId;
    const install = installForFixture(fixtureId);
    state.extensions.selectedInstallId = install?.id || null;
    saveState();
    renderShell();
    return;
  }
  if (action === 'edit-provision') {
    if (!installId) return;
    state.extensions.selectedInstallId = installId;
    state.focusId = `extensions:local:${installId}`;
    state.extensions.formOpen = true;
    saveState();
    renderShell();
    return;
  }
  if (action === 'close-form') {
    state.extensions.formOpen = false;
    saveState();
    renderShell();
    return;
  }
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

function handleAutomationsAction(action, ruleId, focusId) {
  if (action === 'new-rule') {
    state.automations.selectedRuleId = null;
    state.automations.formOpen = true;
    saveState();
    renderShell();
    return;
  }
  if (action === 'edit-rule') {
    if (!ruleId) return;
    state.automations.selectedRuleId = ruleId;
    state.automations.formOpen = true;
    saveState();
    renderShell();
    return;
  }
  if (action === 'close-form') {
    state.automations.formOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-template') {
    if (!focusId) return;
    state.focusId = focusId;
    state.automations.selectedRuleId = null;
    saveState();
    renderShell();
    return;
  }
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

function handleTasksAction(action, taskId, status, focusId) {
  if (action === 'new-task') {
    state.tasks.selectedTaskId = null;
    state.tasks.formOpen = true;
    saveState();
    renderShell();
    return;
  }
  if (action === 'edit-task') {
    if (taskId) state.tasks.selectedTaskId = taskId;
    state.tasks.formOpen = true;
    saveState();
    renderShell();
    return;
  }
  if (action === 'close-form') {
    state.tasks.formOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-fixture') {
    if (!focusId) return;
    state.focusId = focusId;
    state.tasks.selectedTaskId = null;
    state.tasks.formOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'task-clear') {
    clearLocalTask(taskId);
    state.tasks.formOpen = false;
    renderShell();
    return;
  }
  if (action === 'source-jump') {
    const lane = focusId;
    const thread = status;
    if (!lane) return;
    state.laneId = lane;
    if (thread) {
      state.threadId = thread;
      state.inbox.mailboxView = 'inbox';
      state.focusId = `inbox-thread:${thread}`;
    } else {
      state.focusId = defaultFocusIdForLane(lane);
    }
    window.location.hash = `${ROUTE_PREFIX}${lane}`;
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-task') {
    if (!taskId) return;
    state.tasks.selectedTaskId = taskId;
    state.focusId = `tasks:local:${taskId}`;
    state.tasks.formOpen = false;
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

function handleActivityAction(action, filterId) {
  if (action === 'set-filter' && filterId) {
    state.activity.filter = filterId;
    saveState();
    renderShell();
  }
}

function handleCalendarAction(action, proposalId, focusId) {
  if (action === 'new-event') {
    state.calendar.selectedProposalId = null;
    state.calendar.formOpen = true;
    saveState();
    renderShell();
    return;
  }
  if (action === 'edit-event') {
    if (proposalId) state.calendar.selectedProposalId = proposalId;
    state.calendar.formOpen = true;
    saveState();
    renderShell();
    return;
  }
  if (action === 'close-form') {
    state.calendar.formOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'month-prev') {
    shiftCalendarViewMonth(-1);
    renderShell();
    return;
  }
  if (action === 'month-next') {
    shiftCalendarViewMonth(1);
    renderShell();
    return;
  }
  if (action === 'select-day') {
    const day = Number(focusId);
    if (!day) return;
    state.calendar.selectedDay = day;
    state.calendar.selectedProposalId = null;
    state.focusId = `calendar:day:${state.calendar.viewMonth}:${day}`;
    state.calendar.formOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-agenda') {
    if (!focusId) return;
    state.focusId = focusId;
    state.calendar.selectedProposalId = null;
    state.calendar.selectedDay = null;
    state.calendar.formOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'proposal-clear') {
    clearCalendarProposal(proposalId);
    state.calendar.formOpen = false;
    renderShell();
    return;
  }
  if (action === 'select-proposal') {
    if (!proposalId) return;
    state.calendar.selectedProposalId = proposalId;
    state.focusId = `calendar:local:${proposalId}`;
    state.calendar.selectedDay = null;
    state.calendar.formOpen = false;
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

function handleInboxAction(action, threadId, mailboxView, draftId) {
  if (action === 'select-account-filter') {
    const id = threadId;
    if (!id) {
      state.inbox.accountFilter = null;
    } else {
      state.inbox.accountFilter = state.inbox.accountFilter === id ? null : id;
      state.inbox.mailboxView = 'inbox';
    }
    syncMailboxThreadSelection();
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-mailbox-view') {
    if (!mailboxView) return;
    state.inbox.mailboxView = mailboxView;
    if (mailboxView !== 'inbox') state.inbox.accountFilter = null;
    syncMailboxThreadSelection();
    saveState();
    renderShell();
    return;
  }
  if (action === 'toggle-compose') {
    state.inbox.composeOpen = !state.inbox.composeOpen;
    if (state.inbox.composeOpen) state.inbox.replyOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'close-compose') {
    state.inbox.composeOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'toggle-reply') {
    state.inbox.replyOpen = !state.inbox.replyOpen;
    if (state.inbox.replyOpen) state.inbox.composeOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'compose-save') return;
  if (action === 'compose-clear') {
    clearComposeDraft();
    state.inbox.composeOpen = false;
    saveState();
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
  if (action === 'draft-queue') {
    queueDraftForApproval(draftId || state.drafts.selectedDraftId);
    syncMailboxThreadSelection();
    renderShell();
    return;
  }
  if (action === 'draft-approve') {
    approveDraftForSend(draftId || state.drafts.selectedDraftId);
    renderShell();
    return;
  }
  if (action === 'draft-dequeue') {
    dequeueDraft(draftId || state.drafts.selectedDraftId);
    syncMailboxThreadSelection();
    renderShell();
    return;
  }
  if (action === 'draft-delete') {
    if (window.confirm('Delete this local draft?')) {
      deleteDraft(draftId || state.drafts.selectedDraftId);
      syncMailboxThreadSelection();
      renderShell();
    }
    return;
  }
  if (action === 'draft-batch-approve-all') {
    if (window.confirm('Approve all queued drafts locally? Send remains blocked in Tier 1.')) {
      approveAllQueuedDrafts();
      renderShell();
    }
    return;
  }
  if (action === 'draft-simulate-send') {
    if (window.confirm('Simulate send locally (dry-run)? No provider delivery will occur.')) {
      simulateSendDraft(draftId || state.drafts.selectedDraftId);
      syncMailboxThreadSelection();
      renderShell();
    }
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
    const accountForm = event.target.closest?.('[data-account-form]');
    if (accountForm) {
      event.preventDefault();
      const formData = new FormData(accountForm);
      if (accountForm.dataset.accountForm === 'connect') {
        savePendingAccountConnect(formData);
      } else {
        savePreviewSession(formData);
      }
      renderShell();
      return;
    }

    const ibalForm = event.target.closest?.('[data-ibal-form]');
    if (ibalForm) {
      event.preventDefault();
      const formData = new FormData(ibalForm);
      submitIbalPrompt(String(formData.get('prompt') || '').trim());
      renderShell();
      document.getElementById('ibalConciergeDrawer')?.focus();
      return;
    }

    const settingsForm = event.target.closest?.('[data-settings-form]');
    if (settingsForm) {
      event.preventDefault();
      const formData = new FormData(settingsForm);
      const formKind = settingsForm.dataset.settingsForm;
      if (formKind === 'preferences') {
        saveSettingsUserPrefs(formData);
      } else if (formKind === 'gate') {
        saveSettingsGate(formData, String(formData.get('gateKey') || '').trim());
      } else if (formKind === 'policy') {
        saveSettingsPolicy(formData, String(formData.get('policyKey') || '').trim());
      }
      renderShell();
      return;
    }

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
      return;
    }
    if (form.dataset.inboxForm === 'draft-edit') {
      const draft = draftById(String(formData.get('draftId') || '').trim());
      if (draft) {
        upsertDraftFromForm({
          kind: draft.kind,
          threadId: draft.source_thread_id,
          formData,
          draftId: draft.id,
        });
        addDraftReceipt({
          type: 'draft',
          title: 'Draft updated',
          draftId: draft.id,
          summary: `Subject: ${draft.subject || '(none)'}.`,
        });
        saveState();
        setStatusMessage('Draft updated locally.');
      }
      renderShell();
    }
  });

  document.addEventListener('click', (event) => {
    const accountAction = event.target.closest?.('[data-account-action]');
    if (accountAction?.dataset.accountAction && accountAction.dataset.accountAction !== 'session-save') {
      event.preventDefault();
      handleAccountAction(accountAction.dataset.accountAction, accountAction.dataset.accountId);
      return;
    }

    const ibalAction = event.target.closest?.('[data-ibal-action]');
    if (ibalAction?.dataset.ibalAction && ibalAction.dataset.ibalAction !== 'submit') {
      event.preventDefault();
      handleIbalAction(ibalAction.dataset.ibalAction, ibalAction.dataset.proposalId);
      return;
    }

    const settingsAction = event.target.closest?.('[data-settings-action]');
    if (settingsAction?.dataset.settingsAction && !['gate-save', 'policy-save'].includes(settingsAction.dataset.settingsAction)) {
      event.preventDefault();
      handleSettingsAction(settingsAction.dataset.settingsAction, settingsAction.dataset.settingsKey);
      return;
    }

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
      handleAutomationsAction(
        automationsAction.dataset.automationsAction,
        automationsAction.dataset.ruleId,
        automationsAction.dataset.focusId,
      );
      return;
    }

    const tasksAction = event.target.closest?.('[data-tasks-action]');
    if (tasksAction?.dataset.tasksAction && tasksAction.dataset.tasksAction !== 'task-save') {
      event.preventDefault();
      handleTasksAction(
        tasksAction.dataset.tasksAction,
        tasksAction.dataset.taskId,
        tasksAction.dataset.threadId || tasksAction.dataset.taskStatus,
        tasksAction.dataset.laneId || tasksAction.dataset.focusId,
      );
      return;
    }

    const activityAction = event.target.closest?.('[data-activity-action]');
    if (activityAction?.dataset.activityAction) {
      event.preventDefault();
      handleActivityAction(activityAction.dataset.activityAction, activityAction.dataset.activityFilter);
      return;
    }

    const calendarAction = event.target.closest?.('[data-calendar-action]');
    if (calendarAction?.dataset.calendarAction && calendarAction.dataset.calendarAction !== 'proposal-save') {
      event.preventDefault();
      handleCalendarAction(
        calendarAction.dataset.calendarAction,
        calendarAction.dataset.proposalId,
        calendarAction.dataset.focusId || calendarAction.dataset.day,
      );
      return;
    }

    const inboxAction = event.target.closest?.('[data-inbox-action]');
    if (inboxAction?.dataset.inboxAction && !['compose-save', 'reply-save', 'draft-save'].includes(inboxAction.dataset.inboxAction)) {
      event.preventDefault();
      handleInboxAction(
        inboxAction.dataset.inboxAction,
        inboxAction.dataset.threadId,
        inboxAction.dataset.mailboxView,
        inboxAction.dataset.draftId,
      );
      return;
    }

    const draftRow = event.target.closest?.('[data-draft-id]');
    if (draftRow?.dataset.draftId && !draftRow.dataset.inboxAction) {
      state.drafts.selectedDraftId = draftRow.dataset.draftId;
      state.focusId = `inbox-draft:${draftRow.dataset.draftId}`;
      saveState();
      renderShell();
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
    if (event.key === 'Escape' && state.tasks.formOpen) {
      state.tasks.formOpen = false;
      saveState();
      renderShell();
      return;
    }
    if (event.key === 'Escape' && state.calendar.formOpen) {
      state.calendar.formOpen = false;
      saveState();
      renderShell();
      return;
    }
    if (event.key === 'Escape' && state.inbox.composeOpen) {
      state.inbox.composeOpen = false;
      saveState();
      renderShell();
      return;
    }
    if (event.key === 'Escape' && state.inbox.replyOpen) {
      state.inbox.replyOpen = false;
      saveState();
      renderShell();
      return;
    }
    if (event.key === 'Escape' && state.account.open) {
      toggleAccountSession(false);
      renderShell();
      return;
    }
    if (event.key === 'Escape' && state.ibal.open) {
      toggleIbalConcierge(false);
      renderShell();
      return;
    }
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
  ensureAccountDefaults();
  saveState();
  state.threadId = selectedInboxThread()?.id || state.threadId;
  state.focusId = state.focusId || defaultFocusIdForLane(state.laneId);
  ensureRoute();
  syncRoute();
  renderShell();
}

bindEvents();
init();

window.xiioInboxPreview = { state, renderShell, init };
