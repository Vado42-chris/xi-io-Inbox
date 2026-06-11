const DATA_URL = './data/inbox-events.preview.json';
const STORAGE_KEY = 'xiioInbox.preview.state';
const MIGRATION_UI005B_KEY = 'xiioInbox.preview.ui005b';
const LEGACY_STORAGE_KEY = 'xiio-inbox-preview-state-v2';
const STORAGE_SCHEMA_VERSION = 10;

const EXTENSION_CATEGORY_CATALOG = [
  { id: 'internal-xiio', label: 'Internal xi-io', summary: 'First-party capabilities built into the product.' },
  { id: 'email', label: 'Email providers', summary: 'External mail sync and send paths.' },
  { id: 'cloud-storage', label: 'Cloud storage', summary: 'Remote file and backup providers.' },
  { id: 'automation-connectors', label: 'Automation connectors', summary: 'External automation platforms.' },
  { id: 'communication', label: 'Communication', summary: 'Team chat and notification connectors.' },
  { id: 'local-tools', label: 'Local tools', summary: 'On-device export, archive, and redaction.' },
  { id: 'developer', label: 'Developer / advanced', summary: 'Operator CLI paths and advanced integrations.' },
];

const EXTENSION_STATUS_FILTERS = [
  { id: 'all', label: 'All statuses' },
  { id: 'preview_only', label: 'Preview only' },
  { id: 'metadata_only', label: 'Metadata only' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'requires_oauth', label: 'Requires OAuth' },
  { id: 'unavailable', label: 'Unavailable' },
];

const EXTENSION_PROVIDER_CATALOG = [
  { id: 'internal-ibal', name: 'Ibal', category: 'internal-xiio', marker: 'internal', status: 'preview_only', summary: 'Contextual assistant proposals across lanes.', whyItMatters: 'Surfaces cross-lane suggestions without executing actions.', permissions: 'Local fixture context only', dataTouched: 'Lane focus, proposal text', currentGate: 'Runtime assistant blocked in Tier 1', allowedPreviewAction: 'View Ibal proposals in preview lanes', blockedRuntimeAction: 'Execute sends, provider writes, or automations', relatedAreas: ['Home', 'Mail', 'Tasks', 'Automations'], receiptExpectations: ['Ibal proposal viewed', 'Context receipt (preview)'] },
  { id: 'internal-activity', name: 'Activity / Receipts', category: 'internal-xiio', marker: 'internal', status: 'preview_only', summary: 'User-facing ledger of preview actions and gates.', whyItMatters: 'Shows what happened locally and what remains blocked.', permissions: 'Local preview receipts only', dataTouched: 'Action summaries, gate labels', currentGate: 'Export to cloud blocked in Tier 1', allowedPreviewAction: 'Open Activity · filter · source links', blockedRuntimeAction: 'Real export upload · provider sync', relatedAreas: ['Activity', 'Settings'], receiptExpectations: ['Gate viewed', 'Action blocked receipt'] },
  { id: 'internal-draft-workbench', name: 'Draft Workbench', category: 'internal-xiio', marker: 'internal', status: 'preview_only', summary: 'Compose, reply, and approval-queue drafts locally.', whyItMatters: 'Prepare outbound mail without provider write.', permissions: 'Local draft storage only', dataTouched: 'Draft metadata, subject, local body placeholder', currentGate: 'Gmail draft write blocked · send blocked', allowedPreviewAction: 'Create/edit local drafts · approval queue', blockedRuntimeAction: 'Provider draft sync · send', relatedAreas: ['Mail', 'Drafts', 'Approval Queue'], receiptExpectations: ['Draft saved (local)', 'Send blocked'] },
  { id: 'internal-evidence-packets', name: 'Evidence Packets', category: 'internal-xiio', marker: 'internal', status: 'preview_only', summary: 'Link artifacts and export placeholders to work items.', whyItMatters: 'Supports audit trails without cloud upload.', permissions: 'Local artifact refs only', dataTouched: 'Artifact paths, redaction flags (preview)', currentGate: 'Cloud evidence upload blocked', allowedPreviewAction: 'Attach local placeholders to stories/bugs', blockedRuntimeAction: 'Cloud upload · custody chain runtime', relatedAreas: ['Tasks', 'Activity'], receiptExpectations: ['Evidence placeholder added', 'Upload blocked'] },
  { id: 'internal-automation-recipes', name: 'Automation Recipes', category: 'internal-xiio', marker: 'internal', status: 'preview_only', summary: 'Internal When→If→Then rules with dry-run only.', whyItMatters: 'Differs from Zapier/Make — local recipes never execute externally.', permissions: 'Local rule storage', dataTouched: 'Rule definitions, dry-run steps', currentGate: 'Automation execution blocked', allowedPreviewAction: 'Build rules · dry-run · save actions to library', blockedRuntimeAction: 'Enable rules · provider mutation', relatedAreas: ['Automations', 'Activity'], receiptExpectations: ['Dry-run receipt', 'Execution blocked'] },
  { id: 'local-redacted-export', name: 'Local Export / Redacted Packet Builder', category: 'local-tools', marker: 'local', status: 'preview_only', summary: 'Build redacted export packets on device.', whyItMatters: 'Safe sharing without cloud providers.', permissions: 'Local filesystem planning only', dataTouched: 'Redaction flags, export manifest (preview)', currentGate: 'No real file write in browser preview', allowedPreviewAction: 'Plan export packet contents', blockedRuntimeAction: 'Auto-upload to cloud · undisclosed export', relatedAreas: ['Activity', 'Tasks'], receiptExpectations: ['Export planned (preview)', 'Upload blocked'] },
  { id: 'email-gmail', name: 'Gmail', category: 'email', marker: 'external', status: 'metadata_only', summary: 'Google mail when gates pass. Metadata adapter exists as operator CLI only.', whyItMatters: 'Organize mail without exposing bodies in Tier 1 preview.', permissions: 'Metadata scopes · send requires approval', dataTouched: 'Thread metadata, labels, counts — not message bodies in preview', currentGate: 'Body read blocked · draft write blocked · send blocked · browser not connected', allowedPreviewAction: 'View gate status · operator CLI metadata adapter (tools/gmail)', blockedRuntimeAction: 'OAuth in browser · body read · draft write · send', relatedAreas: ['Mail', 'Drafts', 'Activity'], receiptExpectations: ['Provider gate viewed', 'Connect blocked', 'OAuth pending'], adapterNote: 'GMAIL-001C metadata CLI under tools/gmail/. Tokens stay in gitignored secrets/. Browser preview is not connected.', requiresOAuth: true, fixtureLabel: 'Gmail' },
  { id: 'email-outlook', name: 'Outlook / Microsoft Graph', category: 'email', marker: 'external', status: 'blocked', summary: 'Microsoft mail and calendar graph sync.', whyItMatters: 'Future enterprise mail path.', permissions: 'Mail read/write (future)', dataTouched: 'Mail metadata and calendar refs', currentGate: 'Provider blocked · ARCH-004 open', allowedPreviewAction: 'View blocked card and permissions', blockedRuntimeAction: 'Connect · sync · send', relatedAreas: ['Mail', 'Calendar'], receiptExpectations: ['Connect blocked', 'Gate viewed'], requiresOAuth: true },
  { id: 'email-imap', name: 'IMAP (later)', category: 'email', marker: 'external', status: 'unavailable', summary: 'Generic IMAP mail access planned post-gate.', whyItMatters: 'Non-Gmail mailboxes without Google OAuth.', permissions: 'TBD after security review', dataTouched: 'Not defined in preview', currentGate: 'Unavailable in Tier 1', allowedPreviewAction: 'Read planning copy only', blockedRuntimeAction: 'All connection paths', relatedAreas: ['Mail', 'Settings'], receiptExpectations: ['Unavailable notice'] },
  { id: 'cloud-google-drive', name: 'Google Drive', category: 'cloud-storage', marker: 'external', status: 'blocked', summary: 'Attach and archive files from Drive when allowed.', whyItMatters: 'Evidence and draft attachments without local-only limits.', permissions: 'File read (future) · upload gated', dataTouched: 'File metadata, not contents in preview', currentGate: 'Cloud upload/download blocked', allowedPreviewAction: 'View gated workflows: attach to draft, evidence storage', blockedRuntimeAction: 'Upload · download · link live files', relatedAreas: ['Drafts', 'Tasks', 'Evidence'], receiptExpectations: ['Storage gate viewed', 'Upload blocked'] },
  { id: 'cloud-onedrive', name: 'OneDrive', category: 'cloud-storage', marker: 'external', status: 'blocked', summary: 'Microsoft cloud file storage.', whyItMatters: 'Enterprise file workflows.', permissions: 'File read/write (future)', dataTouched: 'File metadata only in preview', currentGate: 'Cloud connection blocked', allowedPreviewAction: 'View blocked card', blockedRuntimeAction: 'Connect · upload · backup', relatedAreas: ['Drafts', 'Evidence'], receiptExpectations: ['Connect blocked'], requiresOAuth: true },
  { id: 'cloud-dropbox', name: 'Dropbox', category: 'cloud-storage', marker: 'external', status: 'blocked', summary: 'Dropbox file sync and sharing.', whyItMatters: 'Cross-platform file handoff.', permissions: 'File read/write (future)', dataTouched: 'File metadata only in preview', currentGate: 'Cloud connection blocked', allowedPreviewAction: 'View blocked card', blockedRuntimeAction: 'Connect · upload', relatedAreas: ['Evidence'], receiptExpectations: ['Connect blocked'], requiresOAuth: true },
  { id: 'local-filesystem-export', name: 'Local filesystem / export', category: 'local-tools', marker: 'local', status: 'preview_only', summary: 'Export packets and indexes to local disk.', whyItMatters: 'Keep custody on-device without cloud.', permissions: 'Local export planning only', dataTouched: 'Export manifest, redaction state', currentGate: 'Browser preview does not write files', allowedPreviewAction: 'Plan local export from Activity/Tasks', blockedRuntimeAction: 'Silent filesystem writes', relatedAreas: ['Activity', 'Tasks'], receiptExpectations: ['Export planned', 'Write blocked'] },
  { id: 'auto-internal', name: 'Internal xi-io Automations', category: 'automation-connectors', marker: 'internal', status: 'preview_only', summary: 'Local dry-run automation recipes in Automations lane.', whyItMatters: 'Differs from Zapier — no external execution.', permissions: 'Local rules only', dataTouched: 'Trigger/condition/action definitions', currentGate: 'Execution blocked', allowedPreviewAction: 'Build · dry-run · action library', blockedRuntimeAction: 'Runtime enable · external webhooks', relatedAreas: ['Automations', 'Activity'], receiptExpectations: ['Dry-run receipt', 'Enable blocked'] },
  { id: 'auto-zapier', name: 'Zapier', category: 'automation-connectors', marker: 'external', status: 'blocked', summary: 'External no-code automation platform.', whyItMatters: 'Hand off to external zaps after explicit gates.', permissions: 'Webhook/API (future)', dataTouched: 'Automation metadata only in preview', currentGate: 'External automation execution blocked', allowedPreviewAction: 'Compare with internal dry-run recipes', blockedRuntimeAction: 'Trigger external zaps', relatedAreas: ['Automations', 'Extensions'], receiptExpectations: ['External automation blocked'] },
  { id: 'auto-make', name: 'Make', category: 'automation-connectors', marker: 'external', status: 'blocked', summary: 'Visual automation scenarios (Integromat).', whyItMatters: 'Enterprise automation alternative to Zapier.', permissions: 'API scenarios (future)', dataTouched: 'Scenario metadata only', currentGate: 'External execution blocked', allowedPreviewAction: 'View blocked card', blockedRuntimeAction: 'Run external scenarios', relatedAreas: ['Automations'], receiptExpectations: ['External automation blocked'] },
  { id: 'auto-n8n', name: 'n8n', category: 'automation-connectors', marker: 'external', status: 'blocked', summary: 'Self-hosted workflow automation.', whyItMatters: 'Operator-controlled automation path.', permissions: 'Workflow hooks (future)', dataTouched: 'Workflow metadata only', currentGate: 'External execution blocked', allowedPreviewAction: 'View blocked card', blockedRuntimeAction: 'Execute workflows', relatedAreas: ['Automations', 'Developer'], receiptExpectations: ['External automation blocked'] },
  { id: 'comm-discord', name: 'Discord', category: 'communication', marker: 'external', status: 'blocked', summary: 'Team chat notifications and bot actions.', whyItMatters: 'Future comms bridge for alerts.', permissions: 'Bot/webhook (future)', dataTouched: 'Channel metadata only in preview', currentGate: 'Outbound communication blocked', allowedPreviewAction: 'View blocked card', blockedRuntimeAction: 'Send messages · post alerts', relatedAreas: ['Activity', 'Automations'], receiptExpectations: ['Outbound blocked'] },
  { id: 'comm-slack', name: 'Slack', category: 'communication', marker: 'external', status: 'blocked', summary: 'Workspace notifications and slash commands.', whyItMatters: 'Enterprise comms integration.', permissions: 'Bot scopes (future)', dataTouched: 'Channel metadata only', currentGate: 'Outbound communication blocked', allowedPreviewAction: 'View blocked card', blockedRuntimeAction: 'Post messages · run commands', relatedAreas: ['Activity', 'Automations'], receiptExpectations: ['Outbound blocked'], requiresOAuth: true },
  { id: 'dev-github', name: 'GitHub', category: 'developer', marker: 'external', status: 'blocked', summary: 'Repository notifications and review reminders.', whyItMatters: 'Link code workflow to inbox tasks.', permissions: 'Read-only notifications (future)', dataTouched: 'Issue/PR metadata only', currentGate: 'Provider blocked · no repo mutation', allowedPreviewAction: 'View fixture notification refs', blockedRuntimeAction: 'Connect · mutate repositories', relatedAreas: ['Tasks', 'Activity'], receiptExpectations: ['Connect blocked'], fixtureLabel: 'GitHub' },
  { id: 'dev-gmail-cli', name: 'Gmail metadata CLI (operator)', category: 'developer', marker: 'developer', status: 'metadata_only', summary: 'Local operator adapter for metadata-only Gmail probes.', whyItMatters: 'Separate from browser connect — tokens never enter product UI.', permissions: 'Operator CLI · gitignored token file', dataTouched: 'Profile, labels, counts, drafts metadata', currentGate: 'Not connected without secrets/ · no body/send', allowedPreviewAction: 'Documented in tools/gmail · status not connected by default', blockedRuntimeAction: 'Body read · draft write · send · UI token storage', relatedAreas: ['Mail', 'Settings'], receiptExpectations: ['Metadata-only sync (CLI)', 'OAuth pending'] },
];

const AUTOMATION_TRIGGER_CATALOG = [
  { id: 'mail-urgent', label: 'Urgent mail arrives', summary: 'When a thread is marked urgent in Mail.' },
  { id: 'mail-time-mentioned', label: 'Time mentioned in mail', summary: 'When mail body/fixture mentions a date or time.' },
  { id: 'draft-queued', label: 'Draft enters approval queue', summary: 'When a draft is submitted for approval.' },
  { id: 'task-blocked', label: 'Task blocked', summary: 'When a task or story moves to blocked status.' },
  { id: 'account-not-connected', label: 'Account not connected', summary: 'When provider connect is still blocked.' },
];

const AUTOMATION_CONDITION_CATALOG = [
  { id: 'always', label: 'Always', summary: 'No extra filter (preview only).' },
  { id: 'family-project', label: 'Family project tag', summary: 'Only when project/family context matches.' },
  { id: 'has-source-thread', label: 'Has source thread', summary: 'Mail-linked object with thread id present.' },
  { id: 'approval-required', label: 'Approval required', summary: 'Human gate must pass before action preview.' },
  { id: 'business-hours', label: 'Business hours (placeholder)', summary: 'Time window check — not connected to real clock.' },
];

const AUTOMATION_GATE_DEFAULT = 'Human approval required before any runtime enablement';

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
  projects: defaultProjectsOps(),
  planning: defaultPlanningOps(),
  bugs: defaultBugsOps(),
  evidence: defaultEvidenceOps(),
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

const TASK_STATUSES = ['backlog', 'ready', 'active', 'blocked', 'review', 'done-preview'];
const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical'];
const TASK_PHASES = ['backlog', 'sprint-1', 'sprint-2', 'waterfall-design', 'waterfall-build'];
const AC_STATES = ['pending', 'pass', 'fail', 'blocked'];
const TASK_COLUMN_MAP = {
  backlog: 'Backlog',
  ready: 'Ready',
  active: 'In progress',
  blocked: 'Blocked',
  review: 'Review',
  'done-preview': 'Done',
  proposed: 'Backlog',
  deferred: 'Blocked',
  reviewed: 'Review',
};

function defaultInboxOps() {
  return {
    mailboxView: 'inbox',
    accountFilter: null,
    labelFilter: null,
    folderFilter: null,
    mailSearchQuery: '',
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
    selectedStoryId: null,
    selectedEpicId: null,
    selectedBugId: null,
    viewMode: 'planning',
    tasks: [],
    receipts: [],
    formOpen: false,
    bugFormOpen: false,
  };
}

function defaultProjectsOps() {
  return {
    selectedProjectId: null,
    items: [],
  };
}

function defaultPlanningOps() {
  return {
    epics: [],
    stories: [],
  };
}

function defaultBugsOps() {
  return {
    items: [],
  };
}

function defaultEvidenceOps() {
  return {
    items: [],
  };
}

function defaultAutomationsOps() {
  return {
    selectedRuleId: null,
    selectedActionId: null,
    rules: [],
    actionLibrary: [],
    receipts: [],
    lastDryRun: null,
    formOpen: false,
  };
}

function defaultExtensionsOps() {
  return {
    selectedInstallId: null,
    selectedProviderId: null,
    categoryFilter: 'all',
    statusFilter: 'all',
    searchQuery: '',
    installs: [],
    receipts: [],
    formOpen: false,
  };
}

function migrateExtensionsOps(ext) {
  return {
    ...defaultExtensionsOps(),
    ...(ext || {}),
    categoryFilter: ext?.categoryFilter || 'all',
    statusFilter: ext?.statusFilter || 'all',
    searchQuery: ext?.searchQuery || '',
    selectedProviderId: ext?.selectedProviderId || null,
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
    batchSelectedIds: [],
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
  return {
    filter: 'user',
    accountFilter: 'all',
    sourceFilter: 'all',
    typeFilter: 'all',
    statusFilter: 'all',
    scopeFilter: 'all',
    outcomeFilter: 'all',
    selectedEntryId: null,
    searchQuery: '',
  };
}

function migrateActivityOps(activity) {
  return {
    ...defaultActivityOps(),
    ...(activity || {}),
  };
}

function laneDisplayLabel(laneId, fallback) {
  if (laneId === 'inbox') return 'Mail';
  if (laneId === 'receipts') return 'Activity';
  if (laneId === 'extensions') return 'Integrations';
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
    projects: state.projects,
    planning: state.planning,
    bugs: state.bugs,
    evidence: state.evidence,
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
  state.projects = {
    ...defaultProjectsOps(),
    ...(stored.projects || {}),
    items: stored.projects?.items || [],
  };
  state.planning = {
    ...defaultPlanningOps(),
    ...(stored.planning || {}),
    epics: stored.planning?.epics || [],
    stories: stored.planning?.stories || [],
  };
  state.bugs = {
    ...defaultBugsOps(),
    ...(stored.bugs || {}),
    items: stored.bugs?.items || [],
  };
  state.evidence = {
    ...defaultEvidenceOps(),
    ...(stored.evidence || {}),
    items: stored.evidence?.items || [],
  };
  state.automations = {
    ...defaultAutomationsOps(),
    ...(stored.automations || {}),
    rules: stored.automations?.rules || [],
    actionLibrary: stored.automations?.actionLibrary || [],
    receipts: stored.automations?.receipts || [],
    lastDryRun: stored.automations?.lastDryRun || null,
  };
  state.extensions = migrateExtensionsOps(stored.extensions);
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
    batchSelectedIds: stored.drafts?.batchSelectedIds || [],
    receipts: stored.drafts?.receipts || [],
  };
  state.sentEvents = {
    ...defaultSentEventsOps(),
    ...(stored.sentEvents || {}),
    events: stored.sentEvents?.events || [],
    receipts: stored.sentEvents?.receipts || [],
  };
  state.activity = migrateActivityOps(stored.activity);
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
  seedCalendarFixtureProposalsIfNeeded();
  seedPlanningFixturesIfNeeded();
  seedAutomationDefaultsIfNeeded();
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
    return upgradePreviewEnvelope({
      ...envelope,
      schemaVersion: 3,
      drafts: {
        ...defaultDraftsOps(),
        items: migrateDraftItemsFromInbox(envelope.inbox),
      },
      sentEvents: envelope.sentEvents || defaultSentEventsOps(),
      activity: envelope.activity || defaultActivityOps(),
    });
  }
  if (envelope.schemaVersion === 9) {
    return {
      ...envelope,
      schemaVersion: STORAGE_SCHEMA_VERSION,
      activity: migrateActivityOps(envelope.activity),
    };
  }
  if (envelope.schemaVersion === 8) {
    return {
      ...envelope,
      schemaVersion: STORAGE_SCHEMA_VERSION,
      extensions: migrateExtensionsOps(envelope.extensions),
    };
  }
  if (envelope.schemaVersion === 7) {
    return upgradePreviewEnvelope({
      ...envelope,
      schemaVersion: 8,
      automations: {
        ...defaultAutomationsOps(),
        ...(envelope.automations || {}),
        actionLibrary: envelope.automations?.actionLibrary || [],
      },
    });
  }
  if (envelope.schemaVersion === 6) {
    const mapTaskStatus = (status) => ({
      proposed: 'backlog',
      deferred: 'blocked',
      reviewed: 'review',
    }[status] || status);
    return {
      ...envelope,
      schemaVersion: STORAGE_SCHEMA_VERSION,
      tasks: {
        ...defaultTasksOps(),
        ...(envelope.tasks || {}),
        tasks: (envelope.tasks?.tasks || []).map((task) => ({
          ...task,
          status: mapTaskStatus(task.status),
        })),
      },
      projects: envelope.projects || defaultProjectsOps(),
      planning: envelope.planning || defaultPlanningOps(),
      bugs: envelope.bugs || defaultBugsOps(),
      evidence: envelope.evidence || defaultEvidenceOps(),
      automations: {
        ...defaultAutomationsOps(),
        ...(envelope.automations || {}),
        actionLibrary: envelope.automations?.actionLibrary || [],
      },
      extensions: migrateExtensionsOps(envelope.extensions),
    };
  }
  if (envelope.schemaVersion === 5) {
    const mapProposal = (entry) => ({
      ...entry,
      status: entry.status || 'proposed',
      reminderProposal: entry.reminderProposal || '',
      draftId: entry.draftId || null,
      projectTag: entry.projectTag || '',
      accountLabel: entry.accountLabel || '',
      providerSyncState: entry.providerSyncState || 'blocked',
    });
    const mapTaskStatus = (status) => ({
      proposed: 'backlog',
      deferred: 'blocked',
      reviewed: 'review',
    }[status] || status);
    return {
      ...envelope,
      schemaVersion: STORAGE_SCHEMA_VERSION,
      calendar: {
        ...defaultCalendarOps(),
        ...(envelope.calendar || {}),
        proposals: (envelope.calendar?.proposals || []).map(mapProposal),
      },
      tasks: {
        ...defaultTasksOps(),
        ...(envelope.tasks || {}),
        tasks: (envelope.tasks?.tasks || []).map((task) => ({
          ...task,
          status: mapTaskStatus(task.status),
        })),
      },
      projects: envelope.projects || defaultProjectsOps(),
      planning: envelope.planning || defaultPlanningOps(),
      bugs: envelope.bugs || defaultBugsOps(),
      evidence: envelope.evidence || defaultEvidenceOps(),
    };
  }
  if (envelope.schemaVersion === 4) {
    return {
      ...envelope,
      schemaVersion: STORAGE_SCHEMA_VERSION,
      drafts: {
        ...defaultDraftsOps(),
        ...(envelope.drafts || {}),
        batchSelectedIds: envelope.drafts?.batchSelectedIds || [],
      },
    };
  }
  if (envelope.schemaVersion === 3) {
    return {
      ...envelope,
      schemaVersion: STORAGE_SCHEMA_VERSION,
      inbox: {
        ...defaultInboxOps(),
        ...(envelope.inbox || {}),
        labelFilter: envelope.inbox?.labelFilter ?? null,
        folderFilter: envelope.inbox?.folderFilter ?? null,
        mailSearchQuery: envelope.inbox?.mailSearchQuery ?? '',
      },
    };
  }
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    laneId: envelope.laneId === IBAL_LEGACY_LANE ? DEFAULT_LANE : envelope.laneId,
    threadId: envelope.threadId,
    focusId: envelope.focusId,
    inbox: { ...defaultInboxOps(), ...(envelope.inbox || {}) },
    calendar: envelope.calendar || defaultCalendarOps(),
    tasks: envelope.tasks || defaultTasksOps(),
    automations: envelope.automations || defaultAutomationsOps(),
    extensions: envelope.extensions || defaultExtensionsOps(),
    settings: envelope.settings || defaultSettingsOps(),
    ibal: envelope.ibal || defaultIbalOps(),
    account: envelope.account || defaultAccountOps(),
    drafts: envelope.drafts || { ...defaultDraftsOps(), items: migrateDraftItemsFromInbox(envelope.inbox) },
    sentEvents: envelope.sentEvents || defaultSentEventsOps(),
    activity: envelope.activity || defaultActivityOps(),
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

function demoteMailDisplayText(text) {
  if (text == null || text === '') return '';
  let value = String(text);
  const replacements = [
    [/Personal Gmail preview/gi, 'Personal Gmail'],
    [/GitHub notifications preview/gi, 'GitHub'],
    [/Provider gate notice preview/gi, 'Provider notice'],
    [/Family sender fixture/gi, 'Family'],
    [/You fixture/gi, 'You'],
    [/GitHub fixture/gi, 'GitHub'],
    [/Settings fixture/gi, 'Settings'],
    [/Ibal fixture/gi, 'Ibal'],
    [/gmail preview/gi, 'Gmail'],
    [/github preview/gi, 'GitHub'],
    [/policy preview/gi, 'Policy'],
    [/settings fixture/gi, 'Settings'],
    [/preview-only/gi, ''],
    [/preview only/gi, ''],
    [/fixture/gi, ''],
    [/\s{2,}/g, ' '],
  ];
  for (const [pattern, replacement] of replacements) {
    value = value.replace(pattern, replacement);
  }
  return value.trim();
}

function formatMessageMeta(meta) {
  if (!meta) return '';
  return demoteMailDisplayText(String(meta).split('/')[0].trim());
}

function threadStatusUserLabel(state) {
  const normalized = String(state || 'preview_only');
  const labels = {
    needs_review: 'Needs review',
    human_required: 'Needs you',
    urgent_thread: 'Urgent',
    preview_only: 'Unread',
    proposal_only: 'Proposal',
    provider_blocked: 'Not connected',
  };
  return labels[normalized] || demoteMailDisplayText(label(normalized)) || 'Unread';
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
  return `<span class="thread-status-chip ${tone}">${escapeHtml(threadStatusUserLabel(normalized))}</span>`;
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

const MAIL_SYSTEM_VIEWS = ['inbox', 'drafts', 'approval-queue', 'sent', 'archive', 'trash', 'spam'];

function mailLayoutMeta() {
  const section = inboxLayoutSection();
  return {
    folders: section.folders || [],
    labels: section.labels || [],
  };
}

function accountById(accountId) {
  return allPreviewAccounts().find((entry) => entry.accountId === accountId) || null;
}

function accountLabelForThread(thread) {
  if (!thread?.accountId) return '';
  const account = accountById(thread.accountId);
  if (account) return account.displayName;
  const fixture = (getPayload().accounts || []).find((entry) => entry.accountId === thread.accountId);
  return fixture?.displayName || thread.accountId;
}

function accountSyncStatusLabel(syncState) {
  const normalized = String(syncState || '').toLowerCase();
  if (normalized === 'connected') return 'Connected';
  if (normalized === 'awaiting_local_connect') return 'Queued';
  if (normalized === 'metadata_only') return 'Metadata only';
  if (normalized === 'provider_blocked' || normalized === 'demo_fixture') return 'Demo';
  return label(syncState || 'not connected');
}

function accountSyncStatusClass(syncState) {
  const normalized = String(syncState || '').toLowerCase();
  if (normalized === 'connected') return 'is-connected';
  if (normalized === 'awaiting_local_connect') return 'is-queued';
  if (normalized === 'metadata_only') return 'is-metadata';
  return 'is-demo';
}

function threadMailbox(thread) {
  return String(thread?.mailbox || 'inbox').toLowerCase();
}

function threadMatchesAccountFilter(thread, accountId) {
  if (!accountId) return true;
  if (thread.accountId === accountId) return true;
  const account = accountById(accountId) || (getPayload().accounts || []).find((entry) => entry.accountId === accountId);
  if (!account) return false;
  const name = account.displayName || '';
  const sender = String(thread.sender || '');
  return sender.includes(name.split(' ')[0]) || sender === name;
}

function threadMatchesSearch(thread, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    thread.sender,
    thread.title,
    thread.summary,
    ...(thread.labels || []),
    ...(thread.messages || []).map((message) => `${message.from} ${message.summary}`),
  ].join(' ').toLowerCase();
  return haystack.includes(q);
}

function baseThreadsForFilters() {
  return inboxThreads().filter((thread) => threadMatchesSearch(thread, state.inbox.mailSearchQuery));
}

function countMailThreads(options = {}) {
  const { mailboxView, accountFilter, labelFilter, folderId } = options;
  return baseThreadsForFilters().filter((thread) => {
    if (accountFilter && !threadMatchesAccountFilter(thread, accountFilter)) return false;
    if (labelFilter && !(thread.labels || []).includes(labelFilter)) return false;
    if (folderId && thread.folder !== folderId) return false;
    const mailbox = threadMailbox(thread);
    const view = mailboxView || 'inbox';
    if (view === 'inbox') return mailbox === 'inbox';
    if (MAIL_SYSTEM_VIEWS.includes(view) && view !== 'inbox' && view !== 'drafts' && view !== 'approval-queue') {
      return mailbox === view;
    }
    if (view === 'priority-inbox') {
      return mailbox === 'inbox' && (thread.state === 'needs_review' || (thread.labels || []).includes('urgent_thread'));
    }
    if (view === 'needs-reply') {
      return mailbox === 'inbox' && (thread.labels || []).includes('needs_reply');
    }
    if (view === 'awaiting-evidence') {
      return mailbox === 'inbox' && ((thread.tags || []).includes('local_verification_required') || thread.state === 'needs_review');
    }
    if (view === 'provider-gates') {
      return mailbox === 'inbox' && ((thread.labels || []).includes('provider_gate') || thread.state === 'provider_blocked');
    }
    return mailbox === 'inbox';
  }).length;
}

function threadsForMailboxView() {
  const view = state.inbox.mailboxView || 'inbox';
  if (view === 'drafts' || view === 'approval-queue') return [];
  const labelFilter = state.inbox.labelFilter;
  const accountFilter = state.inbox.accountFilter;
  const folderFilter = state.inbox.folderFilter;
  return baseThreadsForFilters().filter((thread) => {
    if (accountFilter && !threadMatchesAccountFilter(thread, accountFilter)) return false;
    if (labelFilter && !(thread.labels || []).includes(labelFilter)) return false;
    if (folderFilter && thread.folder !== folderFilter) return false;
    const mailbox = threadMailbox(thread);
    if (MAIL_SYSTEM_VIEWS.includes(view) && ['sent', 'archive', 'trash', 'spam'].includes(view)) {
      return mailbox === view;
    }
    if (view === 'inbox') return mailbox === 'inbox';
    if (view === 'priority-inbox') {
      return mailbox === 'inbox' && (thread.state === 'needs_review' || (thread.labels || []).includes('urgent_thread'));
    }
    if (view === 'needs-reply') {
      return mailbox === 'inbox' && (thread.labels || []).includes('needs_reply');
    }
    if (view === 'awaiting-evidence') {
      return mailbox === 'inbox' && ((thread.tags || []).includes('local_verification_required') || thread.state === 'needs_review');
    }
    if (view === 'provider-gates') {
      return mailbox === 'inbox' && ((thread.labels || []).includes('provider_gate') || thread.state === 'provider_blocked');
    }
    return mailbox === 'inbox';
  });
}

function mailViewTitle() {
  const view = state.inbox.mailboxView || 'inbox';
  if (view === 'drafts') return 'Drafts';
  if (view === 'approval-queue') return 'Approval queue';
  if (view === 'sent') return 'Sent';
  if (view === 'archive') return 'Archive';
  if (view === 'trash') return 'Trash';
  if (view === 'spam') return 'Spam';
  if (state.inbox.labelFilter) {
    const match = mailLayoutMeta().labels.find((entry) => entry.id === state.inbox.labelFilter);
    return match?.label || label(state.inbox.labelFilter);
  }
  if (state.inbox.accountFilter) {
    const account = accountById(state.inbox.accountFilter);
    return account ? `${account.displayName} inbox` : 'Account inbox';
  }
  if (view === 'inbox') return 'All inboxes';
  const smart = (inboxLayoutSection().views || []).find((entry) => mailboxViewId(entry.label) === view);
  return smart?.label || label(view);
}

function threadHasAttachmentIndicator(thread) {
  if (thread?.hasAttachment) return true;
  return (thread?.attachments || []).some((item) => item.state !== 'provider_blocked' || item.label);
}

function renderMailLabelChips(labels) {
  if (!labels?.length) return '';
  return `<div class="thread-label-chips">${labels.slice(0, 3).map((item) => `<span class="thread-label-chip">${escapeHtml(label(item))}</span>`).join('')}</div>`;
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
    state.calendar.proposals = [normalizeCalendarProposal({
      id: proposal.id,
      title: proposal.title,
      dateTime: proposal.dateTime || '',
      notes: proposal.summary || '',
      sourceRef: proposal.threadId ? `inbox-thread:${proposal.threadId}` : '',
      sourceType: 'inbox_local',
      threadId: proposal.threadId || null,
      draftId: proposal.draftId || null,
      createdAt: proposal.createdAt,
      updatedAt: proposal.createdAt,
      state: 'local_preview_proposal',
    }), ...state.calendar.proposals];
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
  const payload = normalizeCalendarProposal({
    title: String(formData.get('title') || '').trim(),
    dateTime: String(formData.get('dateTime') || '').trim(),
    notes: String(formData.get('notes') || '').trim(),
    sourceRef: String(formData.get('sourceRef') || '').trim(),
    sourceType: String(formData.get('sourceType') || 'calendar_local').trim(),
    threadId: String(formData.get('threadId') || '').trim() || null,
    draftId: String(formData.get('draftId') || '').trim() || null,
    reminderProposal: String(formData.get('reminderProposal') || '').trim(),
    projectTag: String(formData.get('projectTag') || '').trim(),
    accountLabel: String(formData.get('accountLabel') || '').trim(),
    status: String(formData.get('status') || 'proposed').trim(),
    state: 'local_preview_proposal',
  });
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
    const proposal = normalizeCalendarProposal({ id, ...payload, createdAt: now, updatedAt: now });
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

function normalizeCalendarProposal(entry) {
  return {
    status: 'proposed',
    reminderProposal: '',
    draftId: null,
    projectTag: '',
    accountLabel: '',
    providerSyncState: 'blocked',
    ...entry,
  };
}

function seedCalendarFixtureProposalsIfNeeded() {
  const existing = new Set((state.calendar.proposals || []).map((entry) => entry.id));
  if (existing.has('calendar-fixture-transport')) return;
  const now = new Date().toISOString();
  const { year, month } = calendarViewMonthParts();
  const monthLabel = new Date(year, month, 1).toLocaleString(undefined, { month: 'short' });
  state.calendar.proposals = [
    normalizeCalendarProposal({
      id: 'calendar-fixture-transport',
      title: 'Create transport event draft',
      dateTime: `${monthLabel} 12, 08:00`,
      notes: 'Proposes a calendar event without writing to a provider. Linked from family transport mail.',
      sourceRef: 'inbox-thread:thread-family-safety-preview',
      sourceType: 'inbox_fixture',
      threadId: 'thread-family-safety-preview',
      draftId: 'draft-sample-reply',
      status: 'proposed',
      reminderProposal: '15 min before pickup window',
      projectTag: 'Family',
      accountLabel: 'Family preview',
      providerSyncState: 'blocked',
      createdAt: now,
      updatedAt: now,
      state: 'local_preview_proposal',
    }),
    normalizeCalendarProposal({
      id: 'calendar-fixture-planning',
      title: 'Schedule planning review block',
      dateTime: `${monthLabel} 15, 15:00`,
      notes: 'Local planning event proposal. Provider calendar sync blocked.',
      sourceRef: 'tasks:planning',
      sourceType: 'calendar_local',
      threadId: null,
      draftId: null,
      status: 'reviewed',
      reminderProposal: '1 day before',
      projectTag: 'Product',
      accountLabel: 'Preview workspace',
      providerSyncState: 'blocked',
      createdAt: now,
      updatedAt: now,
      state: 'local_preview_proposal',
    }),
    ...(state.calendar.proposals || []),
  ];
}

function calendarLinkedThread(proposal) {
  if (!proposal?.threadId) return null;
  return inboxThreads().find((thread) => thread.id === proposal.threadId) || null;
}

function calendarLinkedDraft(proposal) {
  if (!proposal?.draftId) return null;
  return draftById(proposal.draftId) || null;
}

function calendarLinkedTasks(proposal) {
  if (!proposal) return [];
  return (state.tasks.tasks || []).filter(
    (task) => task.calendarId === proposal.id
      || task.sourceRef === `calendar:local:${proposal.id}`
      || (proposal.threadId && task.threadId === proposal.threadId),
  );
}

function calendarExpectedReceipts(proposal) {
  if (!proposal) return [];
  return [
    { title: 'Proposal saved (preview)', summary: 'Local calendar proposal receipt when created or edited' },
    { title: 'Provider sync blocked (preview)', summary: 'No Google/Outlook calendar write until gates clear' },
    { title: 'Reminder proposal (preview)', summary: proposal.reminderProposal || 'Set a reminder before provider sync' },
    { title: 'Activity linkage (preview)', summary: 'Calendar actions appear in Activity when saved or reviewed' },
  ];
}

function calendarConflictPreview(targetProposal) {
  if (!targetProposal?.dateTime) return [];
  const { year, month } = calendarViewMonthParts();
  const targetDay = proposalGridDay(targetProposal, year, month);
  const conflicts = [];
  allCalendarProposals().forEach((proposal) => {
    if (proposal.id === targetProposal.id) return;
    const day = proposalGridDay(proposal, year, month);
    if (day && targetDay && day === targetDay) {
      conflicts.push(`Overlaps with “${proposal.title}” on day ${day} (preview heuristic)`);
    }
  });
  calendarAgendaFixtures().forEach((item, index) => {
    const agendaDays = [10, 12, 15];
    const day = agendaDays[index];
    if (day && targetDay && day === targetDay) {
      conflicts.push(`Fixture agenda “${item.title}” on same day (conflict check placeholder)`);
    }
  });
  return conflicts;
}

function markCalendarProposalReviewed(proposalId) {
  const proposal = allCalendarProposals().find((entry) => entry.id === proposalId);
  if (!proposal) return;
  proposal.status = 'reviewed';
  proposal.updatedAt = new Date().toISOString();
  addCalendarReceipt({
    type: 'review',
    title: 'Calendar proposal marked reviewed',
    proposalId,
    summary: `${proposal.title}. Provider sync remains blocked.`,
  });
  saveState();
  setStatusMessage('Proposal marked reviewed locally. Provider calendar sync remains blocked.', 'calendar');
}

function createCalendarReminderProposal(proposalId) {
  const proposal = allCalendarProposals().find((entry) => entry.id === proposalId);
  if (!proposal) return;
  const reminder = proposal.reminderProposal?.trim()
    || `Reminder for ${proposal.title || 'event'} (preview only)`;
  proposal.reminderProposal = reminder;
  proposal.updatedAt = new Date().toISOString();
  addCalendarReceipt({
    type: 'reminder',
    title: 'Reminder proposal saved (preview)',
    proposalId,
    summary: reminder,
  });
  saveState();
  setStatusMessage('Reminder proposal saved locally. Provider reminders blocked.', 'calendar');
}

function clearCalendarPreviewState() {
  state.calendar = defaultCalendarOps();
  saveState();
  setStatusMessage('All local Calendar preview state cleared. Fixture agenda unchanged.', 'calendar');
}

function migrateTaskStatus(status) {
  return { proposed: 'backlog', deferred: 'blocked', reviewed: 'review' }[status] || status;
}

function allProjects() {
  return state.projects.items || [];
}

function selectedProject() {
  const projects = allProjects();
  return projects.find((entry) => entry.id === state.projects.selectedProjectId) || projects[0] || null;
}

function allEpics(projectId) {
  const pid = projectId || state.projects.selectedProjectId || selectedProject()?.id;
  return (state.planning.epics || []).filter((epic) => !pid || epic.projectId === pid);
}

function allStories(projectId, epicId) {
  const pid = projectId || state.projects.selectedProjectId || selectedProject()?.id;
  const eid = epicId || state.tasks.selectedEpicId;
  return (state.planning.stories || []).filter((story) => {
    if (pid && story.projectId !== pid) return false;
    if (eid && story.epicId !== eid) return false;
    return true;
  });
}

function selectedEpic() {
  return allEpics().find((entry) => entry.id === state.tasks.selectedEpicId) || allEpics()[0] || null;
}

function selectedStory() {
  return allStories().find((entry) => entry.id === state.tasks.selectedStoryId) || allStories()[0] || null;
}

function storyById(storyId) {
  return (state.planning.stories || []).find((entry) => entry.id === storyId) || null;
}

function bugsForStory(storyId) {
  return (state.bugs.items || []).filter((bug) => bug.storyId === storyId);
}

function selectedBug() {
  return (state.bugs.items || []).find((entry) => entry.id === state.tasks.selectedBugId) || null;
}

function evidenceForStory(storyId) {
  return (state.evidence.items || []).filter((entry) => entry.linkedStoryId === storyId);
}

function evidenceForBug(bugId) {
  return (state.evidence.items || []).filter((entry) => entry.linkedBugId === bugId);
}

function seedPlanningFixturesIfNeeded() {
  if (allProjects().some((entry) => entry.id === 'project-xiio-inbox')) return;
  const now = new Date().toISOString();
  state.projects.items = [{
    id: 'project-xiio-inbox',
    name: 'xi-io Inbox preview',
    phase: 'sprint-1',
    summary: 'Capability repair spine for Mail, Drafts, Calendar, Tasks.',
    createdAt: now,
  }];
  state.projects.selectedProjectId = 'project-xiio-inbox';
  state.planning.epics = [
    {
      id: 'epic-mail-workflow',
      projectId: 'project-xiio-inbox',
      title: 'Mail-to-task workflow',
      summary: 'Turn inbox threads and drafts into reviewable work items.',
      status: 'active',
      priority: 'high',
    },
    {
      id: 'epic-planning-spine',
      projectId: 'project-xiio-inbox',
      title: 'Planning spine',
      summary: 'Projects, epics, stories, bugs, and backlog in preview UI.',
      status: 'backlog',
      priority: 'medium',
    },
  ];
  state.planning.stories = [
    {
      id: 'story-family-transport',
      epicId: 'epic-mail-workflow',
      projectId: 'project-xiio-inbox',
      title: 'Family transport follow-up',
      requirement: 'REQ-INBOX-001: Inbox thread must spawn reviewable task proposals.',
      acceptanceCriteria: [
        { id: 'ac-transport-1', text: 'User can open source mail thread from story', state: 'pass' },
        { id: 'ac-transport-2', text: 'Draft consequence task appears after simulate send', state: 'pending' },
        { id: 'ac-transport-3', text: 'Provider task sync remains blocked', state: 'pass' },
      ],
      status: 'ready',
      priority: 'high',
      phase: 'sprint-1',
      sourceThreadId: 'thread-family-safety-preview',
      sourceDraftId: 'draft-sample-reply',
      sourceCalendarId: 'calendar-fixture-transport',
      evidenceIds: ['evidence-transport-note'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'story-github-review',
      epicId: 'epic-mail-workflow',
      projectId: 'project-xiio-inbox',
      title: 'GitHub review reminder follow-up',
      requirement: 'REQ-TASK-001: Task proposals must link to mail source.',
      acceptanceCriteria: [
        { id: 'ac-github-1', text: 'Story shows mail source link', state: 'pending' },
        { id: 'ac-github-2', text: 'Status can move through backlog to done-preview', state: 'pending' },
      ],
      status: 'backlog',
      priority: 'medium',
      phase: 'sprint-1',
      sourceThreadId: 'thread-github-review-preview',
      sourceDraftId: 'draft-sample-approved',
      sourceCalendarId: null,
      evidenceIds: [],
      createdAt: now,
      updatedAt: now,
    },
  ];
  state.tasks.selectedEpicId = 'epic-mail-workflow';
  state.tasks.selectedStoryId = 'story-family-transport';
  state.evidence.items = [{
    id: 'evidence-transport-note',
    label: 'Transport checklist (local note)',
    sourceRef: 'inbox-thread:thread-family-safety-preview',
    linkedStoryId: 'story-family-transport',
    linkedBugId: null,
    note: 'Local-only evidence placeholder. Cloud upload blocked.',
    storageState: 'blocked',
    exportPlaceholder: 'Export packet preview only',
    createdAt: now,
  }];
}

function changeStoryStatus(storyId, status) {
  if (!storyId || !TASK_STATUSES.includes(status)) return;
  state.planning.stories = (state.planning.stories || []).map((entry) => (
    entry.id === storyId ? { ...entry, status, updatedAt: new Date().toISOString() } : entry
  ));
  addTaskReceipt({
    type: 'status',
    title: 'Story status changed (preview)',
    taskId: storyId,
    summary: `Story status set to ${label(status)} locally.`,
  });
  state.tasks.selectedStoryId = storyId;
  saveState();
  setStatusMessage(`Story status changed to ${label(status)} locally.`, 'tasks');
}

function updateAcceptanceCriterion(storyId, acId, acState) {
  if (!storyId || !acId || !AC_STATES.includes(acState)) return;
  state.planning.stories = (state.planning.stories || []).map((story) => {
    if (story.id !== storyId) return story;
    return {
      ...story,
      acceptanceCriteria: (story.acceptanceCriteria || []).map((ac) => (
        ac.id === acId ? { ...ac, state: acState } : ac
      )),
      updatedAt: new Date().toISOString(),
    };
  });
  addTaskReceipt({
    type: 'acceptance',
    title: 'Acceptance criterion updated',
    taskId: storyId,
    summary: `${acId} → ${label(acState)} (preview only).`,
  });
  saveState();
  setStatusMessage(`Acceptance criterion set to ${label(acState)}.`, 'tasks');
}

function createBugFromStory(formData, storyId) {
  const story = storyById(storyId);
  if (!story) return;
  const now = new Date().toISOString();
  const bug = {
    id: createLocalId('bug'),
    storyId,
    projectId: story.projectId,
    title: String(formData.get('title') || '').trim() || `Bug: ${story.title}`,
    requirementRef: String(formData.get('requirementRef') || story.requirement || '').trim(),
    acRef: String(formData.get('acRef') || '').trim(),
    observed: String(formData.get('observed') || '').trim(),
    expected: String(formData.get('expected') || '').trim(),
    actual: String(formData.get('actual') || '').trim(),
    severity: String(formData.get('severity') || 'medium').trim(),
    priority: String(formData.get('priority') || story.priority || 'medium').trim(),
    status: 'backlog',
    evidenceNote: String(formData.get('evidenceNote') || '').trim(),
    evidenceIds: [],
    createdAt: now,
    updatedAt: now,
  };
  state.bugs.items = [bug, ...(state.bugs.items || [])];
  state.tasks.selectedBugId = bug.id;
  state.tasks.selectedStoryId = storyId;
  addTaskReceipt({
    type: 'bug',
    title: 'Bug created from story (preview)',
    taskId: bug.id,
    summary: `${bug.title} linked to ${story.title}. External tracker mutation blocked.`,
  });
  state.tasks.bugFormOpen = false;
  saveState();
  setStatusMessage('Bug created locally. External issue tracker remains blocked.', 'tasks');
}

function addStoryEvidencePlaceholder(storyId) {
  const story = storyById(storyId);
  if (!story) return;
  const now = new Date().toISOString();
  const artifact = {
    id: createLocalId('evidence'),
    label: 'Artifact link placeholder',
    sourceRef: story.sourceThreadId ? `inbox-thread:${story.sourceThreadId}` : 'local-preview',
    linkedStoryId: storyId,
    linkedBugId: null,
    note: 'Local-only evidence note. Cloud storage provider blocked.',
    storageState: 'blocked',
    exportPlaceholder: 'Export packet preview only',
    createdAt: now,
  };
  state.evidence.items = [artifact, ...(state.evidence.items || [])];
  state.planning.stories = (state.planning.stories || []).map((entry) => (
    entry.id === storyId
      ? { ...entry, evidenceIds: [...(entry.evidenceIds || []), artifact.id], updatedAt: now }
      : entry
  ));
  addTaskReceipt({
    type: 'evidence',
    title: 'Evidence placeholder linked',
    taskId: storyId,
    summary: artifact.label,
  });
  saveState();
  setStatusMessage('Evidence placeholder added. Cloud upload blocked.', 'tasks');
}

function taskExpectedReceipts(storyOrTask) {
  return [
    { title: 'Task/story saved (preview)', summary: 'Local receipt when work item is created or updated' },
    { title: 'External tracker blocked (preview)', summary: 'No GitHub/Jira/Linear mutation in Tier 1' },
    { title: 'Evidence storage blocked (preview)', summary: 'Artifact upload uses placeholder only' },
    { title: 'Activity linkage (preview)', summary: 'Status and bug actions appear in Activity' },
  ];
}

function syncInboxTaskProposals() {
  const inboxTasks = (state.inbox.proposals || []).filter((entry) => entry.type === 'task');
  const existing = new Set((state.tasks.tasks || []).map((entry) => entry.id));
  inboxTasks.forEach((proposal) => {
    if (existing.has(proposal.id)) return;
    state.tasks.tasks = [{
      id: proposal.id,
      title: proposal.title,
      status: 'backlog',
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
    status: migrateTaskStatus(String(formData.get('status') || 'backlog').trim()),
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
  if (!taskId || !TASK_STATUSES.includes(migrateTaskStatus(status))) return;
  const next = migrateTaskStatus(status);
  state.tasks.tasks = (state.tasks.tasks || []).map((entry) => (
    entry.id === taskId ? { ...entry, status: next, updatedAt: new Date().toISOString() } : entry
  ));
  addTaskReceipt({
    type: 'status',
    title: 'Local task status changed',
    taskId,
    summary: `Status set to ${label(next)} (preview only).`,
  });
  state.tasks.selectedTaskId = taskId;
  saveState();
  setStatusMessage(`Task status changed to ${label(next)} locally.`, 'tasks');
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
  state.projects = defaultProjectsOps();
  state.planning = defaultPlanningOps();
  state.bugs = defaultBugsOps();
  state.evidence = defaultEvidenceOps();
  seedPlanningFixturesIfNeeded();
  saveState();
  setStatusMessage('All local Tasks planning preview state cleared. Fixture board unchanged.', 'tasks');
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

function allAutomationActions() {
  return state.automations.actionLibrary || [];
}

function automationActionById(actionId) {
  return allAutomationActions().find((entry) => entry.id === actionId) || null;
}

function catalogTrigger(id) {
  return AUTOMATION_TRIGGER_CATALOG.find((entry) => entry.id === id) || null;
}

function catalogCondition(id) {
  return AUTOMATION_CONDITION_CATALOG.find((entry) => entry.id === id) || null;
}

function seedAutomationDefaultsIfNeeded() {
  if (allAutomationActions().some((entry) => entry.id === 'action-draft-reply')) return;
  const now = new Date().toISOString();
  state.automations.actionLibrary = [
    { id: 'action-draft-reply', title: 'Suggest draft reply', summary: 'Create local draft proposal for review.', category: 'mail', gate: 'You approve before send', createdAt: now, source: 'system' },
    { id: 'action-calendar-hold', title: 'Propose calendar hold', summary: 'Create local calendar proposal linked to mail.', category: 'calendar', gate: 'You confirm the event', createdAt: now, source: 'system' },
    { id: 'action-task-followup', title: 'Create follow-up task', summary: 'Add task/story proposal in Tasks lane.', category: 'tasks', gate: 'You review the task', createdAt: now, source: 'system' },
    { id: 'action-activity-receipt', title: 'Record Activity receipt', summary: 'Append dry-run receipt to Activity ledger.', category: 'activity', gate: 'Preview only', createdAt: now, source: 'system' },
  ];
}

function saveActionFromRule(ruleId) {
  const rule = allLocalAutomationRules().find((entry) => entry.id === ruleId);
  if (!rule) return;
  const now = new Date().toISOString();
  const action = {
    id: createLocalId('action'),
    title: rule.proposal?.slice(0, 60) || rule.title,
    summary: rule.proposal || rule.title,
    category: 'custom',
    gate: rule.gate || AUTOMATION_GATE_DEFAULT,
    trigger: rule.trigger,
    condition: rule.condition,
    createdAt: now,
    source: 'user',
  };
  state.automations.actionLibrary = [action, ...(state.automations.actionLibrary || [])];
  state.automations.selectedActionId = action.id;
  addAutomationReceipt({ type: 'action', title: 'Action saved to library (preview)', ruleId, summary: action.title });
  saveState();
  setStatusMessage('Action saved to reusable library. Execution remains blocked.', 'automations');
}

function createRuleFromTemplate(template) {
  if (!template) return;
  const now = new Date().toISOString();
  const id = createLocalId('auto');
  const rule = {
    id,
    title: template.title,
    trigger: template.trigger,
    triggerId: null,
    condition: 'Always',
    conditionId: 'always',
    proposal: template.summary,
    actionId: null,
    gate: template.gate || AUTOMATION_GATE_DEFAULT,
    state: 'dry_run_only',
    enabled: false,
    createdAt: now,
    updatedAt: now,
  };
  state.automations.rules = [rule, ...(state.automations.rules || [])];
  state.automations.selectedRuleId = id;
  state.focusId = `automations:local:${id}`;
  addAutomationReceipt({ type: 'rule', title: 'Rule created from starter template', ruleId: id, summary: rule.title });
  saveState();
  setStatusMessage('Rule created from template. Dry-run before any future enablement.', 'automations');
}

function automationExpectedReceipts(rule) {
  return [
    { title: 'Dry-run receipt (preview)', summary: 'Recorded when Test rule runs locally' },
    { title: 'Execution blocked (preview)', summary: 'Enable/run remains disabled in Tier 1' },
    { title: 'Activity linkage (preview)', summary: rule ? `Actions for “${rule.title}” appear in Activity` : 'Automation receipts appear after dry-run' },
  ];
}

function saveLocalAutomationRule(formData, ruleId) {
  const triggerId = String(formData.get('triggerId') || '').trim();
  const conditionId = String(formData.get('conditionId') || '').trim();
  const actionId = String(formData.get('actionId') || '').trim();
  const triggerEntry = catalogTrigger(triggerId);
  const conditionEntry = catalogCondition(conditionId);
  const actionEntry = automationActionById(actionId);
  const payload = {
    title: String(formData.get('title') || '').trim(),
    triggerId: triggerId || null,
    trigger: triggerEntry?.label || String(formData.get('trigger') || '').trim(),
    conditionId: conditionId || null,
    condition: conditionEntry?.label || String(formData.get('condition') || '').trim(),
    actionId: actionId || null,
    proposal: actionEntry ? `${actionEntry.title}: ${actionEntry.summary}` : String(formData.get('proposal') || '').trim(),
    gate: String(formData.get('gate') || '').trim() || AUTOMATION_GATE_DEFAULT,
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
  const triggerLabel = catalogTrigger(rule.triggerId)?.label || rule.trigger || 'No trigger';
  const conditionLabel = catalogCondition(rule.conditionId)?.label || rule.condition || 'Always';
  const actionEntry = automationActionById(rule.actionId);
  const actionLabel = actionEntry ? `${actionEntry.title}: ${actionEntry.summary}` : (rule.proposal || 'No action');
  state.automations.lastDryRun = {
    ruleId,
    ranAt: new Date().toISOString(),
    steps: [
      { title: 'When (trigger matched — simulated)', summary: triggerLabel, state: 'dry_run_only' },
      { title: 'If (condition evaluated — simulated)', summary: conditionLabel, state: 'preview_only' },
      { title: 'Then (proposal prepared — not executed)', summary: actionLabel, state: 'proposal_only' },
      { title: 'Approval gate required', summary: rule.gate || AUTOMATION_GATE_DEFAULT, state: 'blocked' },
      { title: 'Execution blocked', summary: 'Automation execution, provider mutation, and repo writes remain disabled in Tier 1 preview.', state: 'action_blocked' },
      { title: 'Activity receipt (preview linkage)', summary: 'Dry-run recorded locally; full Activity drill-down in UI-011H.', state: 'preview_only' },
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
  seedAutomationDefaultsIfNeeded();
  saveState();
  setStatusMessage('All local Automations preview state cleared. Starter library re-seeded.', 'automations');
}

function extensionCategoryById(categoryId) {
  return EXTENSION_CATEGORY_CATALOG.find((entry) => entry.id === categoryId) || null;
}

function allExtensionProviders() {
  const fixtures = extensionFixturesRaw();
  return EXTENSION_PROVIDER_CATALOG.map((provider) => {
    const fixture = fixtures.find((entry) => entry.label === provider.fixtureLabel);
    return {
      ...provider,
      fixtureId: fixture ? `ext-fixture:${fixtures.indexOf(fixture)}` : null,
      focusId: `extensions:provider:${provider.id}`,
    };
  });
}

function extensionProviderById(providerId) {
  return allExtensionProviders().find((entry) => entry.id === providerId) || null;
}

function extensionMarkerLabel(marker) {
  return ({
    internal: 'Internal xi-io',
    external: 'External provider',
    local: 'Local tool',
    developer: 'Developer / advanced',
  }[marker] || label(marker));
}

function filteredExtensionProviders() {
  const query = (state.extensions.searchQuery || '').trim().toLowerCase();
  const category = state.extensions.categoryFilter || 'all';
  const status = state.extensions.statusFilter || 'all';
  return allExtensionProviders().filter((provider) => {
    if (category !== 'all' && provider.category !== category) return false;
    if (status !== 'all' && provider.status !== status) return false;
    if (!query) return true;
    const haystack = [
      provider.name,
      provider.summary,
      provider.whyItMatters,
      provider.permissions,
      extensionMarkerLabel(provider.marker),
      extensionCategoryById(provider.category)?.label,
    ].join(' ').toLowerCase();
    return haystack.includes(query);
  });
}

function installForProvider(providerId) {
  return allExtensionInstalls().find((entry) => entry.providerId === providerId)
    || allExtensionInstalls().find((entry) => {
      const provider = extensionProviderById(providerId);
      return provider?.fixtureId && entry.fixtureId === provider.fixtureId;
    })
    || null;
}

function extensionExpectedReceipts(provider) {
  return (provider?.receiptExpectations || []).map((title) => ({
    title,
    summary: 'Recorded in Activity when action occurs (preview/local)',
  }));
}

function extensionFixturesRaw() {
  const extensions = getPayload().laneContent?.extensions || {};
  const section = sectionByType(extensions, 'extension-matrix');
  return section?.providers || [];
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

function previewInstallExtension(providerId, fixtureId) {
  const provider = providerId ? extensionProviderById(providerId) : null;
  const fixture = fixtureId
    ? extensionFixtures().find((entry) => entry.fixtureId === fixtureId)
    : (provider?.fixtureLabel
      ? extensionFixtures().find((entry) => entry.label === provider.fixtureLabel)
      : null);
  const resolvedProviderId = providerId || (fixture
    ? allExtensionProviders().find((entry) => entry.fixtureLabel === fixture.label)?.id
    : null);
  if ((!provider && !fixture) || (resolvedProviderId && installForProvider(resolvedProviderId))) return;
  const id = createLocalId('ext');
  const now = new Date().toISOString();
  const label = provider?.name || fixture?.label || 'Integration';
  const install = {
    id,
    providerId: resolvedProviderId,
    fixtureId: fixture?.fixtureId || provider?.fixtureId || null,
    label,
    permissions: provider?.permissions || fixture?.permissions || '',
    provisionNotes: '',
    state: 'preview_installed',
    installedAt: now,
    updatedAt: now,
  };
  state.extensions.installs = [install, ...(state.extensions.installs || [])];
  state.extensions.selectedInstallId = id;
  state.extensions.selectedProviderId = resolvedProviderId;
  if (resolvedProviderId) state.focusId = `extensions:provider:${resolvedProviderId}`;
  else if (fixture) state.focusId = fixture.focusId;
  addExtensionReceipt({
    type: 'install',
    title: 'Local preview install recorded',
    installId: id,
    summary: `${label} — preview only, not connected.`,
  });
  saveState();
  setStatusMessage(`Preview install recorded for ${label}. No provider connection.`, 'extensions');
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
  setStatusMessage('All local Extensions preview state cleared. Provider catalog unchanged.', 'extensions');
}

function recordExtensionGateView(providerId) {
  const provider = extensionProviderById(providerId);
  if (!provider) return;
  addExtensionReceipt({
    type: 'gate',
    title: 'Provider gate viewed',
    installId: installForProvider(providerId)?.id || null,
    summary: `${provider.name} — ${label(provider.status)} · ${provider.currentGate}`,
  });
  saveState();
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
    recommendation: demoteMailDisplayText(pick?.summary || focus?.safeNext || 'Review what you have selected and choose a next step.'),
    why: demoteMailDisplayText(focus?.summary || pick?.summary || 'Based on your current view.'),
    evidence: demoteMailDisplayText(`From ${label(state.laneId)} · ${focus?.title || 'current selection'}`),
    blockers: demoteMailDisplayText(focus?.blocked || 'Send and automatic actions are not enabled in this build.'),
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
      account_label: 'Family preview',
      project_tag: 'Family',
      risk_flags: ['privacy_sensitive'],
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
      expects_attachment: true,
      account_label: 'Family preview',
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
      task_hint: 'Ready to simulate send',
      account_label: 'GitHub preview',
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
  return preSendChecksDetailed(draft).map((check) => `${check.label}: ${check.detail}`);
}

function draftMissingMetadata(draft) {
  if (!draft) return [];
  const missing = [];
  if (!draft.recipients?.length) missing.push('recipients');
  if (!draft.subject?.trim()) missing.push('subject');
  if (!draft.body?.trim()) missing.push('body');
  if (draft.expects_attachment && !draft.attachment_ref) missing.push('attachment');
  return missing;
}

function draftRiskFlags(draft) {
  if (!draft?.risk_flags?.length) return [];
  return draft.risk_flags;
}

function preSendChecksDetailed(draft) {
  if (!draft) return [];
  const missing = draftMissingMetadata(draft);
  return [
    {
      id: 'recipients',
      label: 'Recipients',
      status: draft.recipients?.length ? 'pass' : 'fail',
      detail: draft.recipients?.length ? draft.recipients.join(', ') : 'Add at least one recipient',
    },
    {
      id: 'subject',
      label: 'Subject',
      status: draft.subject?.trim() ? 'pass' : 'fail',
      detail: draft.subject?.trim() ? draft.subject.trim() : 'Subject required before approval',
    },
    {
      id: 'body',
      label: 'Message body',
      status: draft.body?.trim() ? 'pass' : 'warn',
      detail: draft.body?.trim() ? 'Body present' : 'Body empty — review before send',
    },
    {
      id: 'attachment',
      label: 'Attachments',
      status: draft.expects_attachment && !draft.attachment_ref ? 'warn' : 'pass',
      detail: draft.attachment_ref || (draft.expects_attachment ? 'Expected attachment not linked' : 'No attachment required'),
    },
    {
      id: 'metadata',
      label: 'Required metadata',
      status: missing.length ? 'fail' : 'pass',
      detail: missing.length ? `Missing: ${missing.join(', ')}` : 'Required fields present',
    },
    {
      id: 'tone',
      label: 'Tone / safety review',
      status: 'warn',
      detail: 'Human review recommended before external send (placeholder)',
    },
    {
      id: 'provider',
      label: 'Provider send gate',
      status: 'blocked',
      detail: 'Tier 1 preview — provider send remains blocked',
    },
  ];
}

function draftExpectedReceipts(draft) {
  if (!draft) return [];
  const expected = [
    { title: 'Draft saved (preview)', summary: 'Local save receipt when draft is persisted' },
  ];
  if (draft.approval_state === 'queued') {
    expected.push({ title: 'Approval queued (preview)', summary: 'Draft awaits human approval; send blocked in Tier 1' });
  }
  if (draft.approval_state === 'approved' && draft.status !== 'sent') {
    expected.push({ title: 'Send blocked (preview)', summary: 'Provider send gate blocks real delivery until Tier 2 gates clear' });
  }
  expected.push({ title: 'Consequence preview (preview)', summary: 'Post-send plan listed before simulate send' });
  return expected;
}

function draftReceiptsFor(draftId) {
  return (state.drafts.receipts || []).filter((entry) => entry.draftId === draftId);
}

function batchSelectedDrafts() {
  const ids = new Set(state.drafts.batchSelectedIds || []);
  return queuedDrafts().filter((draft) => ids.has(draft.id));
}

function toggleDraftBatchSelection(draftId) {
  const ids = new Set(state.drafts.batchSelectedIds || []);
  if (ids.has(draftId)) ids.delete(draftId);
  else ids.add(draftId);
  state.drafts.batchSelectedIds = [...ids];
  saveState();
}

function sharedApprovalRisks(drafts) {
  const list = drafts || queuedDrafts();
  const risks = [];
  if (list.some((draft) => !draft.recipients?.length)) risks.push('Missing recipients on one or more drafts');
  if (list.some((draft) => !draft.subject?.trim())) risks.push('Missing subject on one or more drafts');
  if (list.some((draft) => draftMissingMetadata(draft).length)) risks.push('Incomplete metadata on one or more drafts');
  if (list.some((draft) => draft.risk_flags?.length)) risks.push('Risk flags present — review before approval');
  risks.push('Provider send blocked in Tier 1');
  return risks;
}

function batchApprovalPreviewSummary(drafts) {
  const list = drafts || batchSelectedDrafts();
  const target = list.length ? list : queuedDrafts();
  return {
    count: target.length,
    subjects: target.map((draft) => draft.subject || '(no subject)'),
    risks: sharedApprovalRisks(target),
    consequences: target.length === 1
      ? sendConsequencePreview(target[0])
      : ['Activity receipts for each approved draft', 'Simulated send remains blocked', 'Post-send task/calendar proposals per draft where linked'],
  };
}

function approveSelectedBatchDrafts() {
  const selected = batchSelectedDrafts();
  if (!selected.length) {
    setStatusMessage('Select queued drafts to approve, or use Approve all.');
    return;
  }
  selected.forEach((draft) => approveDraftForSend(draft.id));
  addDraftReceipt({
    type: 'approval',
    title: 'Batch approve selected (preview)',
    draftId: null,
    summary: `Approved ${selected.length} draft(s). ${sharedApprovalRisks(selected).join('; ')}`,
  });
  state.drafts.batchSelectedIds = [];
  saveState();
  setStatusMessage(`Approved ${selected.length} selected draft(s). Send remains blocked.`, 'inbox');
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
  const sharedRisks = sharedApprovalRisks(queued);
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
    { action: 'create_receipt', summary: 'Append Activity/receipt for simulated send (local ledger)' },
    { action: 'notify_user', summary: 'Show dry-run status message (no provider delivery)' },
  ];
  if (draft?.project_tag) {
    steps.push({ action: 'project_update', summary: `Update project tag “${draft.project_tag}” (preview only)` });
  }
  steps.push({ action: 'label_update', summary: 'Apply sent label / folder move preview (no provider mutation)' });
  if (draft?.source_thread_id) {
    steps.push({ action: 'archive_thread', summary: `Mark source thread ${draft.source_thread_id} reviewed locally` });
    steps.push({ action: 'follow_up_task', summary: 'Create follow-up task proposal (local only)' });
    steps.push({ action: 'calendar_event', summary: 'Create calendar follow-up proposal (local only)' });
  }
  steps.push({ action: 'follow_up_reminder', summary: 'Schedule follow-up reminder proposal (local only)' });
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
    status: 'backlog',
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
  state.calendar.proposals = [normalizeCalendarProposal({
    id: calId,
    title: `Follow-up hold: ${draft.subject || thread.title}`,
    dateTime: '',
    notes: 'Post-send calendar proposal (simulated). Provider write blocked.',
    sourceRef: `sent-event:${eventId}`,
    sourceType: 'send_simulation',
    threadId: draft.source_thread_id,
    draftId: draft.id,
    status: 'proposed',
    reminderProposal: '1 day after send (preview)',
    createdAt: now,
    updatedAt: now,
    state: 'local_proposal',
  }), ...(state.calendar.proposals || [])];
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
  setStatusMessage('Send simulated. See Activity for the record.', 'inbox');
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
  state.calendar.proposals = [normalizeCalendarProposal({
    id,
    title: inboxProposal.title,
    dateTime: '',
    notes: inboxProposal.summary,
    sourceRef: `inbox-thread:${threadId}`,
    sourceType: 'inbox_local',
    threadId,
    draftId: null,
    createdAt,
    updatedAt: createdAt,
    state: 'local_preview_proposal',
  }), ...(state.calendar.proposals || [])];
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

function laneNavHint() {
  return '';
}

function inspectorRailModeLabel(mode) {
  const labels = {
    thread: 'Mail',
    draft: 'Draft',
    batch: 'Approval',
    sent: 'Sent',
    lane: 'Overview',
  };
  return labels[String(mode || 'lane')] || 'Overview';
}

const ACTIVITY_TYPE_LABELS = {
  draft_saved: 'Draft saved',
  draft_approval_blocked: 'Draft approval blocked',
  send_blocked: 'Send blocked',
  calendar_proposal: 'Calendar proposal',
  task_proposal: 'Task update',
  automation_dry_run: 'Automation dry-run',
  provider_gate_viewed: 'Provider gate viewed',
  extension_connect_blocked: 'Connect blocked',
  evidence_linked: 'Evidence linked',
  settings_gate_changed: 'Settings gate changed',
  local_state_changed: 'Local preview changed',
  send_simulated: 'Send simulated',
  build_evidence: 'Build evidence',
  proposal: 'Proposal',
  blocked: 'Blocked',
};

const ACTIVITY_SCOPE_FILTERS = [
  { id: 'all', label: 'All scopes' },
  { id: 'internal', label: 'Internal xi-io' },
  { id: 'external', label: 'External provider' },
  { id: 'local', label: 'Local only' },
  { id: 'build', label: 'Build evidence' },
];

const ACTIVITY_OUTCOME_FILTERS = [
  { id: 'all', label: 'All outcomes' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'proposed', label: 'Proposed' },
  { id: 'completed', label: 'Completed' },
  { id: 'recorded', label: 'Recorded' },
];

function activityTypeLabel(type) {
  return ACTIVITY_TYPE_LABELS[type] || activityKindLabel(type) || label(type);
}

function activityOutcomeFor(stateValue, type) {
  if (['runtime_blocked', 'action_blocked', 'provider_blocked', 'send_blocked', 'blocked'].includes(String(stateValue))) return 'blocked';
  if (type === 'send_simulated' || type === 'send_sim') return 'completed';
  if (['proposal_only', 'dry_run_only', 'proposal'].includes(String(stateValue))) return 'proposed';
  if (type === 'build_evidence' || type === 'proof') return 'recorded';
  return 'recorded';
}

function activityScopeFor(area, type) {
  if (type === 'build_evidence' || type === 'proof') return 'build';
  if (area === 'extensions' || area === 'settings') return 'external';
  if (area === 'evidence' || area === 'export') return 'local';
  return 'internal';
}

function activityRiskLevel(outcome, type) {
  if (outcome === 'blocked' || type === 'send_blocked') return 'medium';
  if (type === 'send_simulated' || type === 'send_sim') return 'medium';
  if (type === 'build_evidence') return 'low';
  return 'low';
}

function activityEntryFromReceipt(receipt, area, defaults = {}) {
  const type = defaults.activityType || receipt.type || 'local_state_changed';
  const outcome = defaults.outcome || activityOutcomeFor(receipt.state, type);
  const id = `${area}:${receipt.id}`;
  return {
    id,
    activityType: type,
    title: receipt.title || defaults.title || 'Activity recorded',
    summary: receipt.summary || defaults.summary || '',
    status: receipt.state || defaults.status || 'preview_only',
    outcome,
    createdAt: receipt.createdAt || defaults.createdAt || new Date().toISOString(),
    account: defaults.account || 'Preview account',
    sourceObject: defaults.sourceObject || receipt.summary || area,
    sourceLink: defaults.sourceLink || null,
    blockedReason: defaults.blockedReason || (outcome === 'blocked' ? (receipt.limitations || 'Action blocked in Tier 1 preview.') : ''),
    receiptId: receipt.id,
    eventType: receipt.type || type,
    riskLevel: activityRiskLevel(outcome, type),
    relatedGate: defaults.relatedGate || '',
    capabilityArea: defaults.capabilityArea || area,
    safeNext: defaults.safeNext || 'Review source object or adjust local preview state.',
    scope: defaults.scope || activityScopeFor(area, type),
    advanced: defaults.advanced || null,
    focusId: defaults.focusId || `activity:${id}`,
    isBuildEvidence: type === 'build_evidence' || type === 'proof',
  };
}

function mapDraftReceiptToActivity(receipt) {
  const typeMap = {
    save: 'draft_saved',
    queue: 'draft_approval_blocked',
    approve: 'draft_saved',
    reject: 'draft_approval_blocked',
    send_blocked: 'send_blocked',
    send_sim: 'send_simulated',
  };
  const type = typeMap[receipt.type] || 'draft_saved';
  const draft = receipt.draftId ? draftById(receipt.draftId) : null;
  const mailboxView = draft?.approval_state && draft.approval_state !== 'none' ? 'approval-queue' : 'drafts';
  return activityEntryFromReceipt(receipt, 'drafts', {
    activityType: type,
    sourceObject: draft?.subject || receipt.draftId || 'Draft',
    sourceLink: receipt.draftId ? { lane: 'inbox', mailboxView, draftId: receipt.draftId, label: mailboxView === 'approval-queue' ? 'Open Approval Queue' : 'Open draft' } : null,
    capabilityArea: 'Mail / Drafts',
    relatedGate: type === 'send_blocked' ? 'Send blocked in Tier 1' : 'Draft write local only',
    safeNext: type === 'send_blocked' ? 'Review approval queue; provider send remains blocked.' : 'Edit draft or queue for approval.',
    blockedReason: type === 'send_blocked' ? 'Provider send and runtime egress remain disabled.' : '',
    outcome: activityOutcomeFor(receipt.state, type),
  });
}

function collectUnifiedActivityEntries() {
  const entries = [];
  (state.drafts.receipts || []).forEach((r) => entries.push(mapDraftReceiptToActivity(r)));
  (state.inbox.receipts || []).forEach((r) => entries.push(activityEntryFromReceipt(r, 'inbox', {
    activityType: r.type === 'send_blocked' ? 'send_blocked' : 'local_state_changed',
    capabilityArea: 'Mail',
    sourceLink: r.threadId ? { lane: 'inbox', threadId: r.threadId, label: 'Open in Mail' } : null,
    sourceObject: r.threadId || 'Mail thread',
    relatedGate: 'Provider mail read/write blocked',
  })));
  (state.calendar.receipts || []).forEach((r) => entries.push(activityEntryFromReceipt(r, 'calendar', {
    activityType: 'calendar_proposal',
    capabilityArea: 'Calendar',
    sourceLink: r.proposalId ? { lane: 'calendar', proposalId: r.proposalId, label: 'Open calendar proposal' } : null,
    sourceObject: r.proposalId || 'Calendar proposal',
    relatedGate: 'Provider calendar write blocked',
    outcome: 'proposed',
  })));
  (state.tasks.receipts || []).forEach((r) => entries.push(activityEntryFromReceipt(r, 'tasks', {
    activityType: r.type === 'evidence' ? 'evidence_linked' : 'task_proposal',
    capabilityArea: 'Tasks',
    sourceLink: r.taskId ? { lane: 'tasks', taskId: r.taskId, label: 'Open task/story' } : null,
    sourceObject: r.taskId || 'Task',
    relatedGate: 'External tracker sync blocked',
  })));
  (state.automations.receipts || []).forEach((r) => entries.push(activityEntryFromReceipt(r, 'automations', {
    activityType: r.type === 'dry-run' ? 'automation_dry_run' : 'local_state_changed',
    capabilityArea: 'Automations',
    sourceLink: r.ruleId ? { lane: 'automations', ruleId: r.ruleId, label: 'Open automation rule' } : null,
    sourceObject: r.ruleId || 'Automation rule',
    relatedGate: 'Automation execution blocked',
    outcome: r.type === 'dry-run' ? 'proposed' : 'recorded',
  })));
  (state.extensions.receipts || []).forEach((r) => {
    const install = r.installId ? allExtensionInstalls().find((entry) => entry.id === r.installId) : null;
    entries.push(activityEntryFromReceipt(r, 'extensions', {
      activityType: r.type === 'gate' ? 'provider_gate_viewed' : 'extension_connect_blocked',
      capabilityArea: 'Integrations',
      scope: 'external',
      sourceLink: install?.providerId
        ? { lane: 'extensions', providerId: install.providerId, label: 'Open integration' }
        : (install ? { lane: 'extensions', installId: install.id, label: 'Open integration' } : null),
      sourceObject: r.summary || 'Integration',
      relatedGate: 'Provider connect blocked',
      blockedReason: 'OAuth and provider runtime remain disabled in browser preview.',
    }));
  });
  (state.settings.receipts || []).forEach((r) => entries.push(activityEntryFromReceipt(r, 'settings', {
    activityType: 'settings_gate_changed',
    capabilityArea: 'Settings',
    scope: 'external',
    sourceLink: r.key ? { lane: 'settings', settingsKey: r.key, label: 'Open settings gate' } : null,
    sourceObject: r.key || 'Settings',
    relatedGate: 'Runtime gate apply blocked',
  })));
  (state.sentEvents.receipts || []).forEach((r) => entries.push(activityEntryFromReceipt(r, 'sentEvents', {
    activityType: 'send_simulated',
    capabilityArea: 'Mail / Approval Queue',
    outcome: 'completed',
    sourceLink: r.eventId ? { lane: 'inbox', mailboxView: 'approval-queue', label: 'Open Approval Queue' } : null,
  })));
  allSentEvents().forEach((event) => {
    entries.push({
      id: `sentEvents:event:${event.id}`,
      activityType: 'send_simulated',
      title: event.subject || 'Simulated send',
      summary: `Dry-run send for draft ${event.draft_id || 'unknown'}`,
      status: 'dry_run_only',
      outcome: 'completed',
      createdAt: event.created_at || new Date().toISOString(),
      account: 'Preview account',
      sourceObject: event.draft_id ? `draft:${event.draft_id}` : 'Approval Queue',
      sourceLink: event.draft_id ? { lane: 'inbox', mailboxView: 'approval-queue', draftId: event.draft_id, label: 'Open Approval Queue' } : { lane: 'inbox', mailboxView: 'approval-queue', label: 'Open Approval Queue' },
      blockedReason: 'Provider delivery not executed.',
      receiptId: event.id,
      eventType: 'send_sim',
      riskLevel: 'medium',
      relatedGate: 'Send blocked at provider',
      capabilityArea: 'Mail / Approval Queue',
      safeNext: 'Review post-send proposals in Calendar/Tasks.',
      scope: 'internal',
      advanced: null,
      focusId: `sent-event:${event.id}`,
      isBuildEvidence: false,
    });
  });
  (state.evidence.items || []).forEach((item) => {
    entries.push({
      id: `evidence:${item.id}`,
      activityType: 'evidence_linked',
      title: item.title || 'Evidence placeholder',
      summary: item.summary || 'Local artifact reference (no cloud upload).',
      status: item.storageState || 'preview_only',
      outcome: 'proposed',
      createdAt: item.createdAt || new Date().toISOString(),
      account: 'Preview account',
      sourceObject: item.storyId ? `story:${item.storyId}` : 'Evidence',
      sourceLink: item.storyId ? { lane: 'tasks', storyId: item.storyId, label: 'Open story' } : null,
      blockedReason: 'Cloud storage and file upload blocked.',
      receiptId: item.id,
      eventType: 'evidence',
      riskLevel: 'low',
      relatedGate: 'CAP-EVD cloud upload blocked',
      capabilityArea: 'Tasks / Evidence',
      safeNext: 'Review artifact placeholder; export packet remains preview-only.',
      scope: 'local',
      advanced: null,
      focusId: `evidence:${item.id}`,
      isBuildEvidence: false,
    });
  });
  const content = activeLaneContent();
  const section = sectionByType(content, 'receipt-ledger');
  const sectionIndex = (content.sections || []).findIndex((entry) => entry === section);
  (section?.rows || []).forEach((row, index) => {
    const kind = row.kind || 'proof';
    entries.push({
      id: `fixture:ledger:${index}`,
      activityType: kind === 'proof' ? 'build_evidence' : (kind === 'gate' || kind === 'blocked' ? 'blocked' : kind),
      title: row.title,
      summary: row.source || '',
      status: row.state || 'documented',
      outcome: activityOutcomeFor(row.state, kind),
      createdAt: 'Fixture sample',
      account: 'Build / CI',
      sourceObject: row.source || 'Fixture',
      sourceLink: parseActivitySource(row.source),
      blockedReason: kind === 'blocked' || kind === 'gate' ? 'Blocked in Tier 1 preview.' : '',
      receiptId: `fixture-${index}`,
      eventType: kind,
      riskLevel: 'low',
      relatedGate: row.state === 'provider_blocked' ? 'Provider connect' : '',
      capabilityArea: 'Build / validation',
      safeNext: 'Developer context only — not required for daily workflow.',
      scope: 'build',
      advanced: kind === 'proof' ? { commitSha: /[a-f0-9]{7,}/i.test(row.source || '') ? row.source : null, sliceId: row.title, validation: 'Route smoke / npm run check' } : null,
      focusId: `receipts:receipt-ledger:${sectionIndex}:${index}`,
      isBuildEvidence: kind === 'proof',
    });
  });
  return entries.sort((a, b) => {
    if (a.createdAt === 'Fixture sample' && b.createdAt !== 'Fixture sample') return 1;
    if (b.createdAt === 'Fixture sample' && a.createdAt !== 'Fixture sample') return -1;
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
}

function activityPrimaryFilterMatches(entry, filter) {
  if (filter === 'all') return true;
  if (filter === 'build') return entry.isBuildEvidence || entry.scope === 'build';
  if (filter === 'user') return !entry.isBuildEvidence && entry.scope !== 'build';
  if (filter === 'proposals') return entry.outcome === 'proposed';
  if (filter === 'blocked') return entry.outcome === 'blocked';
  if (filter === 'sent') return entry.activityType === 'send_simulated';
  return true;
}

function activitySecondaryFilterMatches(entry) {
  const q = (state.activity.searchQuery || '').trim().toLowerCase();
  if (state.activity.accountFilter !== 'all' && entry.account !== state.activity.accountFilter) return false;
  if (state.activity.typeFilter !== 'all' && entry.activityType !== state.activity.typeFilter) return false;
  if (state.activity.statusFilter !== 'all' && entry.status !== state.activity.statusFilter) return false;
  if (state.activity.scopeFilter !== 'all' && entry.scope !== state.activity.scopeFilter) return false;
  if (state.activity.outcomeFilter !== 'all' && entry.outcome !== state.activity.outcomeFilter) return false;
  if (state.activity.sourceFilter !== 'all' && entry.capabilityArea !== state.activity.sourceFilter) return false;
  if (!q) return true;
  const hay = [entry.title, entry.summary, entry.sourceObject, activityTypeLabel(entry.activityType), entry.capabilityArea].join(' ').toLowerCase();
  return hay.includes(q);
}

function filteredActivityEntries() {
  const filter = state.activity.filter || 'user';
  return collectUnifiedActivityEntries()
    .filter((entry) => activityPrimaryFilterMatches(entry, filter))
    .filter((entry) => activitySecondaryFilterMatches(entry));
}

function selectedActivityEntry() {
  const id = state.activity.selectedEntryId;
  if (!id) return filteredActivityEntries()[0] || null;
  return collectUnifiedActivityEntries().find((entry) => entry.id === id)
    || filteredActivityEntries().find((entry) => entry.focusId === state.focusId)
    || null;
}

function activityKindLabel(kind) {
  const labels = {
    proof: 'Build check',
    proposal: 'Proposal',
    draft: 'Draft',
    gate: 'Blocked',
    blocked: 'Blocked',
    send_sim: 'Sent (simulated)',
  };
  return labels[kind] || demoteMailDisplayText(label(kind));
}

function activityStateLabel(state) {
  const labels = {
    dry_run_only: 'Simulated',
    preview_only: 'Recorded',
    documented: 'Recorded',
    needs_review: 'Needs review',
    provider_blocked: 'Not connected',
  };
  return labels[state] || threadStatusUserLabel(state);
}

function parseActivitySource(source) {
  if (!source) return null;
  const text = String(source);
  if (text.startsWith('draft:')) {
    const draftId = text.replace('draft:', '').trim();
    return draftId ? { lane: 'inbox', mailboxView: 'drafts', draftId, label: 'Open draft' } : null;
  }
  if (text.startsWith('story:')) {
    const storyId = text.replace('story:', '').trim();
    return storyId ? { lane: 'tasks', storyId, label: 'Open story' } : null;
  }
  if (text.startsWith('calendar:')) {
    const proposalId = text.replace('calendar:', '').trim();
    return proposalId ? { lane: 'calendar', proposalId, label: 'Open calendar proposal' } : null;
  }
  const threadMatch = text.match(/thread-[\w-]+/);
  if (threadMatch) return { lane: 'inbox', threadId: threadMatch[0], label: 'Open in Mail' };
  if (text.startsWith('inbox-thread:')) {
    return { lane: 'inbox', threadId: text.replace('inbox-thread:', ''), label: 'Open in Mail' };
  }
  if (text.includes('inbox/')) {
    const threadId = text.split('inbox/').pop()?.split(/[/?#]/)[0];
    if (threadId?.startsWith('thread-')) return { lane: 'inbox', threadId, label: 'Open in Mail' };
  }
  if (text === 'Settings' || text.includes('settings')) return { lane: 'settings', label: 'Open Settings' };
  if (text === 'Calendar') return { lane: 'calendar', label: 'Open Calendar' };
  if (text === 'Inbox') return { lane: 'inbox', label: 'Open Mail' };
  return null;
}

function openActivitySource(target) {
  if (!target) return;
  state.laneId = target.lane;
  if (target.mailboxView) state.inbox.mailboxView = target.mailboxView;
  if (target.threadId) {
    state.threadId = target.threadId;
    state.focusId = `inbox-thread:${target.threadId}`;
    state.inbox.mailboxView = state.inbox.mailboxView || 'inbox';
  }
  if (target.draftId) {
    state.drafts.selectedDraftId = target.draftId;
    state.focusId = `inbox-draft:${target.draftId}`;
    state.inbox.mailboxView = target.mailboxView || 'drafts';
    state.threadId = null;
  }
  if (target.proposalId) {
    state.calendar.selectedProposalId = target.proposalId;
    state.focusId = `calendar:local:${target.proposalId}`;
  }
  if (target.taskId) {
    state.tasks.selectedTaskId = target.taskId;
    state.focusId = `tasks:local:${target.taskId}`;
  }
  if (target.storyId) {
    state.tasks.selectedStoryId = target.storyId;
    state.focusId = `tasks:story:${target.storyId}`;
  }
  if (target.ruleId) {
    state.automations.selectedRuleId = target.ruleId;
    state.focusId = `automations:local:${target.ruleId}`;
  }
  if (target.providerId) {
    state.extensions.selectedProviderId = target.providerId;
    state.focusId = `extensions:provider:${target.providerId}`;
  }
  if (target.installId) {
    state.extensions.selectedInstallId = target.installId;
    state.focusId = `extensions:local:${target.installId}`;
  }
  if (target.settingsKey) {
    state.settings.selectedKey = target.settingsKey;
    state.focusId = target.settingsKey.startsWith('gate:')
      ? `settings:local:gate:${target.settingsKey}`
      : `settings:local:policy:${target.settingsKey}`;
  }
  window.location.hash = `${ROUTE_PREFIX}${target.lane}`;
  saveState();
  renderShell();
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
    if (state.extensions.selectedProviderId) return `extensions:provider:${state.extensions.selectedProviderId}`;
    const install = selectedExtensionInstall();
    return install ? `extensions:local:${install.id}` : 'lane:extensions';
  }
  if (laneId === 'receipts') {
    const entry = selectedActivityEntry();
    return entry?.focusId || 'lane:receipts';
  }
  if (laneId === 'settings') {
    const key = state.settings.selectedKey;
    if (key === 'user:preferences') return 'settings:local:preferences';
    if (key === 'user:accounts') return 'settings:local:accounts';
    if (key?.startsWith('gate:')) return `settings:local:gate:${key}`;
    if (key) return `settings:local:policy:${key}`;
    return 'settings:local:preferences';
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
    filteredExtensionProviders().forEach((provider) => {
      items.push({
        id: provider.focusId,
        kind: extensionMarkerLabel(provider.marker),
        title: provider.name,
        summary: provider.summary,
        meta: `${extensionCategoryById(provider.category)?.label || provider.category} · ${label(provider.status)}`,
        state: provider.status,
        safeNext: provider.allowedPreviewAction,
        blocked: provider.blockedRuntimeAction,
        receipt: (provider.receiptExpectations || []).join('; '),
      });
    });
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
  if (focusId.startsWith('extensions:provider:')) {
    state.extensions.selectedProviderId = focusId.replace('extensions:provider:', '');
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
    <details class="trust-help-panel" aria-label="Help and safety">
      <summary>Help</summary>
      <div class="trust-help-body">
        <p>This build saves drafts locally. Live mail sync and send are not enabled yet.</p>
        <ul>
          ${statements.map((item) => `<li>${escapeHtml(demoteMailDisplayText(item))}</li>`).join('')}
        </ul>
      </div>
    </details>
  `;
}

function renderTopBar() {
  const workspace = getPayload().workspace || {};
  return `
    <header class="app-topbar" role="banner">
      <section class="brand-block" aria-label="Product identity">
        <p class="eyebrow">xi-io</p>
        <h1>Inbox</h1>
      </section>

      <section class="topbar-context trust-cluster" aria-label="Account">
        <button class="account-session-trigger user-card-trigger ${state.account.open ? 'is-open' : ''}" type="button" data-account-action="toggle" aria-expanded="${state.account.open ? 'true' : 'false'}" aria-controls="accountSessionPanel">
          <span class="user-card-avatar" aria-hidden="true">${escapeHtml((activeSessionDisplayName() || 'P').slice(0, 1).toUpperCase())}</span>
          <span class="trust-cluster-line">
            <strong>${escapeHtml(activeSessionDisplayName())}</strong>
            <span>${escapeHtml(selectedAccountFixture()?.displayName || activeWorkspaceLabel())}</span>
          </span>
        </button>
      </section>

      <section class="topbar-command-cluster" aria-label="Search and Ibal">
        <button class="ibal-concierge-btn ${state.ibal.open ? 'is-open' : ''}" type="button" data-ibal-action="toggle" aria-expanded="${state.ibal.open ? 'true' : 'false'}" aria-controls="ibalConciergeDrawer">
          Ask Ibal
        </button>
        <form class="command-box" data-ibal-form="command" aria-label="Search and command entry">
          <span>Search</span>
          <input type="search" name="prompt" autocomplete="off" placeholder="${escapeHtml(workspace.commandPlaceholder || 'Search mail and commands')}" value="${escapeHtml(state.ibal.prompt || '')}" />
        </form>
      </section>

      ${renderTrustRail()}
    </header>
  `;
}

function renderInboxMailNav() {
  const section = inboxLayoutSection();
  const meta = mailLayoutMeta();
  const activeView = state.inbox.mailboxView || 'inbox';
  const draftListCount = allDraftItems().filter((draft) => draft.approval_state === 'none' && draft.status !== 'sent').length;
  const approvalCount = allDraftItems().filter((draft) => ['queued', 'approved'].includes(draft.approval_state) && draft.status !== 'sent').length;
  const sentCount = countMailThreads({ mailboxView: 'sent' });
  const smartViews = (section.views || []).filter((view) => {
    const viewId = mailboxViewId(view.label);
    return !['drafts', 'sent', 'archive', 'trash', 'spam'].includes(viewId);
  });
  const mailNavItem = (viewId, labelText, count, extraActive = false) => {
    const isActive = (activeView === viewId && !state.inbox.labelFilter) || extraActive;
    return `
      <button class="mail-nav-item ${isActive ? 'is-active' : ''}" type="button" data-inbox-action="select-mailbox-view" data-mailbox-view="${escapeHtml(viewId)}" aria-current="${isActive ? 'page' : 'false'}">
        <span>${escapeHtml(labelText)}</span>
        <strong>${count}</strong>
      </button>
    `;
  };
  return `
    <div class="mail-nav-section" aria-label="Mail folders and views">
      <p class="mail-nav-label">Mail</p>
      ${mailNavItem('inbox', 'All inboxes', countMailThreads({ mailboxView: 'inbox' }), activeView === 'inbox' && !state.inbox.accountFilter && !state.inbox.labelFilter)}
      ${mailNavItem('drafts', 'Drafts', draftListCount)}
      ${mailNavItem('sent', 'Sent', sentCount)}
      ${mailNavItem('archive', 'Archive', countMailThreads({ mailboxView: 'archive' }))}
      ${mailNavItem('trash', 'Trash', countMailThreads({ mailboxView: 'trash' }))}
      ${mailNavItem('spam', 'Spam', countMailThreads({ mailboxView: 'spam' }))}
      ${mailNavItem('approval-queue', 'Approval queue', approvalCount)}
      ${smartViews.length ? `<p class="mail-nav-label">Views</p>${smartViews.map((view) => {
    const viewId = mailboxViewId(view.label);
    return mailNavItem(viewId, view.label, view.count || countMailThreads({ mailboxView: viewId }));
  }).join('')}` : ''}
      ${meta.folders.length ? `
        <p class="mail-nav-label">Folders</p>
        ${meta.folders.map((folder) => `
          <button class="mail-nav-item ${state.inbox.folderFilter === folder.id ? 'is-active' : ''}" type="button" data-inbox-action="select-folder-filter" data-folder-id="${escapeHtml(folder.id)}">
            <span>${escapeHtml(folder.label)}</span>
            <strong>${folder.count ?? countMailThreads({ folderId: folder.id, mailboxView: 'inbox' })}</strong>
          </button>
        `).join('')}
      ` : ''}
      ${meta.labels.length ? `
        <p class="mail-nav-label">Labels</p>
        ${meta.labels.map((entry) => `
          <button class="mail-nav-item ${state.inbox.labelFilter === entry.id ? 'is-active' : ''}" type="button" data-inbox-action="select-label-filter" data-label-id="${escapeHtml(entry.id)}">
            <span>${escapeHtml(entry.label)}</span>
            <strong>${entry.count ?? countMailThreads({ labelFilter: entry.id, mailboxView: 'inbox' })}</strong>
          </button>
        `).join('')}
        <p class="form-hint mail-nav-hint">Provider labels load after Gmail metadata connect.</p>
      ` : ''}
      <p class="mail-nav-label">Accounts</p>
      ${allPreviewAccounts().length ? allPreviewAccounts().map((account) => `
        <button class="mail-nav-item ${state.inbox.accountFilter === account.accountId ? 'is-active' : ''}" type="button" data-inbox-action="select-account-filter" data-thread-id="${escapeHtml(account.accountId)}" aria-current="${state.inbox.accountFilter === account.accountId ? 'page' : 'false'}">
          <span>${escapeHtml(account.displayName)}</span>
          <span class="mail-account-state ${accountSyncStatusClass(account.syncState)}">${escapeHtml(accountSyncStatusLabel(account.syncState))}</span>
          <strong>${account.counts?.unread ?? 0}</strong>
        </button>
      `).join('') : '<p class="form-hint mail-nav-hint">No accounts yet. Add Gmail in Settings.</p>'}
    </div>
  `;
}

function renderNavigation() {
  return `
    <nav class="lane-nav mail-nav-pane" aria-label="Primary navigation">
      <p class="lane-nav-label">Menu</p>
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

function homeDashboardStats() {
  const draftCount = allDraftItems().filter((draft) => draft.approval_state === 'none').length;
  const approvalCount = allDraftItems().filter((draft) => ['queued', 'approved'].includes(draft.approval_state)).length;
  return [
    { label: 'Unread conversations', value: inboxThreads().length, action: 'open-lane', lane: 'inbox' },
    { label: 'Drafts', value: draftCount, action: 'open-mailbox', lane: 'inbox', mailboxView: 'drafts' },
    { label: 'Awaiting approval', value: approvalCount, action: 'open-mailbox', lane: 'inbox', mailboxView: 'approval-queue' },
    { label: 'Open tasks', value: allLocalTasks().length, action: 'open-lane', lane: 'tasks' },
    { label: 'Upcoming events', value: allCalendarProposals().length, action: 'open-lane', lane: 'calendar' },
    { label: 'Email accounts', value: allPreviewAccounts().length, action: 'open-lane', lane: 'settings', settingsKey: 'user:accounts' },
  ];
}

function renderHomeWorkspace() {
  const urgentThread = inboxThreads().find((thread) => thread.state === 'needs_review') || inboxThreads()[0];
  const stats = homeDashboardStats();
  return `
    <div class="lane-workspace home-workspace">
      <div class="home-stats-grid" aria-label="At a glance">
        ${stats.map((stat) => `
          <button class="home-stat-card" type="button" data-home-action="${escapeHtml(stat.action)}" data-lane-id="${escapeHtml(stat.lane)}" ${stat.mailboxView ? `data-mailbox-view="${escapeHtml(stat.mailboxView)}"` : ''} ${stat.settingsKey ? `data-settings-key="${escapeHtml(stat.settingsKey)}"` : ''}>
            <strong>${escapeHtml(String(stat.value))}</strong>
            <span>${escapeHtml(stat.label)}</span>
          </button>
        `).join('')}
      </div>
      <section class="home-priority-panel" aria-label="Needs attention">
        <h3>Needs attention</h3>
        ${urgentThread ? `
          <article class="home-priority-card">
            <div>
              <strong>${escapeHtml(demoteMailDisplayText(urgentThread.title))}</strong>
              <p>${escapeHtml(demoteMailDisplayText(urgentThread.summary))}</p>
            </div>
            <button class="inbox-action-btn is-primary" type="button" data-home-action="open-thread" data-thread-id="${escapeHtml(urgentThread.id)}">Open in Mail</button>
          </article>
        ` : '<p class="lane-empty-state">No urgent items right now.</p>'}
        <div class="home-quick-links">
          <button class="inbox-action-btn" type="button" data-home-action="open-lane" data-lane-id="calendar">Calendar</button>
          <button class="inbox-action-btn" type="button" data-home-action="open-lane" data-lane-id="tasks">Tasks</button>
          <button class="inbox-action-btn" type="button" data-home-action="open-lane" data-lane-id="receipts">Activity</button>
          <button class="inbox-action-btn" type="button" data-home-action="open-lane" data-lane-id="settings">Settings</button>
        </div>
      </section>
      <details class="lane-reading-details home-advanced">
        <summary>How this build works (advanced)</summary>
        <p class="form-hint">Local preview with sample mail data. Connect Gmail in Settings when ready. Send and provider sync are not enabled in this build.</p>
      </details>
    </div>
  `;
}

function renderLocalTriageChip(threadId) {
  const triage = inboxTriageFor(threadId);
  if (triage.deferred) return '<span class="thread-status-chip is-neutral">deferred locally</span>';
  if (triage.reviewed) return '<span class="thread-status-chip is-neutral">reviewed locally</span>';
  return '';
}

function renderInboxToolbar() {
  const searchQuery = state.inbox.mailSearchQuery || '';
  return `
    <div class="inbox-toolbar" role="toolbar" aria-label="Inbox actions">
      <button class="inbox-action-btn is-primary" type="button" data-inbox-action="toggle-compose" aria-expanded="${state.inbox.composeOpen ? 'true' : 'false'}">Compose</button>
      <form class="mail-search-form" data-inbox-form="mail-search" aria-label="Search mail">
        <label class="visually-hidden" for="mail-search-input">Search mail</label>
        <input id="mail-search-input" class="mail-search-input" type="search" name="query" autocomplete="off" placeholder="Search conversations" value="${escapeHtml(searchQuery)}" />
        ${searchQuery ? '<button class="inbox-action-btn" type="button" data-inbox-action="clear-mail-search">Clear</button>' : ''}
      </form>
      <div id="inboxStatusRegion" class="inbox-status-region is-compact" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'inbox' ? state.statusMessage : '')}</div>
      <details class="inbox-toolbar-overflow">
        <summary>More</summary>
        <button class="inbox-action-btn" type="button" data-inbox-action="open-activity">View Activity</button>
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
          <p class="form-hint">Saved as a draft. Send is not enabled in this build.</p>
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

function renderPreSendCheckList(draft) {
  const checks = preSendChecksDetailed(draft);
  return `
    <section class="draft-pre-send-checks" aria-label="Pre-send checks">
      <h4>Pre-send checks</h4>
      <ul class="pre-send-check-list">
        ${checks.map((check) => `
          <li class="pre-send-check is-${escapeHtml(check.status)}">
            <span class="pre-send-check-label">${escapeHtml(check.label)}</span>
            <span class="pre-send-check-detail">${escapeHtml(check.detail)}</span>
            <span class="pre-send-check-status">${escapeHtml(label(check.status))}</span>
          </li>
        `).join('')}
      </ul>
    </section>
  `;
}

function renderDraftObjectSummary(draft) {
  const thread = draft.source_thread_id
    ? inboxThreads().find((item) => item.id === draft.source_thread_id)
    : null;
  const missing = draftMissingMetadata(draft);
  const risks = draftRiskFlags(draft);
  return `
    <dl class="draft-object-summary">
      <div><dt>Draft</dt><dd>${escapeHtml(draft.id)}</dd></div>
      ${draft.account_label ? `<div><dt>Account</dt><dd>${escapeHtml(draft.account_label)}</dd></div>` : ''}
      <div><dt>Status</dt><dd>${escapeHtml(label(draft.status || 'drafting'))}</dd></div>
      <div><dt>Approval</dt><dd>${escapeHtml(label(draft.approval_state || 'none'))}</dd></div>
      ${draft.project_tag ? `<div><dt>Project</dt><dd>${escapeHtml(draft.project_tag)}</dd></div>` : ''}
      ${thread ? `<div><dt>Source thread</dt><dd><button class="inbox-link-btn" type="button" data-inbox-action="draft-open-source" data-thread-id="${escapeHtml(thread.id)}">${escapeHtml(demoteMailDisplayText(thread.title))}</button></dd></div>` : ''}
      ${missing.length ? `<div><dt>Missing metadata</dt><dd>${escapeHtml(missing.join(', '))}</dd></div>` : ''}
      ${risks.length ? `<div><dt>Risk flags</dt><dd>${risks.map((flag) => escapeHtml(label(flag))).join(', ')}</dd></div>` : ''}
    </dl>
  `;
}

function renderDraftActivityPanel(draft) {
  const receipts = draftReceiptsFor(draft.id);
  const expected = draftExpectedReceipts(draft);
  return `
    <section class="draft-activity-panel" aria-label="Activity and receipts">
      <h4>Activity and receipts</h4>
      ${receipts.length ? `
        <h5>Recorded locally</h5>
        <ul class="draft-receipt-list">
          ${receipts.slice(0, 5).map((entry) => `<li><strong>${escapeHtml(entry.title)}</strong> · ${escapeHtml(entry.summary)}</li>`).join('')}
        </ul>
      ` : '<p class="form-hint">Save, queue, approve, or simulate send to create local receipts.</p>'}
      <h5>Receipt expectations (preview)</h5>
      <ul class="draft-receipt-expectations">
        ${expected.map((entry) => `<li><strong>${escapeHtml(entry.title)}</strong> · ${escapeHtml(entry.summary)}</li>`).join('')}
      </ul>
      <button class="inbox-action-btn" type="button" data-inbox-action="open-activity">Open Activity</button>
    </section>
  `;
}

function renderBatchApprovalPreview() {
  const preview = batchApprovalPreviewSummary();
  if (!preview.count) return '';
  return `
    <section class="batch-approval-preview" aria-label="Batch approval preview">
      <h4>Batch approval preview (${preview.count})</h4>
      <p class="form-hint">Preview only — no provider send.</p>
      <ul class="batch-approval-subjects">${preview.subjects.map((subject) => `<li>${escapeHtml(subject)}</li>`).join('')}</ul>
      <h5>Shared risks</h5>
      <ul class="rail-risk-list">${preview.risks.map((risk) => `<li>${escapeHtml(risk)}</li>`).join('')}</ul>
      <h5>If approved (preview)</h5>
      <ul class="post-send-plan-list">${preview.consequences.map((step) => `<li>${escapeHtml(demoteMailDisplayText(step))}</li>`).join('')}</ul>
      <div class="inbox-form-actions">
        <button class="inbox-action-btn is-primary" type="button" data-inbox-action="draft-batch-approve-selected">Approve selected</button>
        <button class="inbox-action-btn" type="button" data-inbox-action="draft-batch-approve-all">Approve all queued</button>
        <button class="inbox-action-btn is-blocked" type="button" disabled title="Send blocked in Tier 1">Send blocked</button>
      </div>
    </section>
  `;
}

function renderApprovalQueueToolbar() {
  const queued = queuedDrafts();
  const selected = batchSelectedDrafts();
  return `
    <div class="approval-queue-toolbar" role="toolbar" aria-label="Approval queue actions">
      <span>${queued.length} awaiting review · ${selected.length} selected</span>
      <button class="inbox-action-btn" type="button" data-inbox-action="draft-batch-select-all">Select all queued</button>
      <button class="inbox-action-btn" type="button" data-inbox-action="draft-batch-clear">Clear selection</button>
    </div>
  `;
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
    <details class="inbox-reading-details post-send-preview">
      <summary>${draft.status === 'sent' ? 'After send' : 'If you send'}</summary>
      <ul class="post-send-plan-list">${steps.map((step) => `<li>${escapeHtml(demoteMailDisplayText(typeof step === 'string' ? step : step.summary))}</li>`).join('')}</ul>
      <details class="inbox-reading-details mail-advanced-details">
        <summary>Preview limitations (advanced)</summary>
        <p class="form-hint">Simulated send only. Provider delivery and automation execution remain blocked in this preview.</p>
      </details>
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
      ${draft.task_hint ? `<p class="draft-task-hint-banner">${escapeHtml(demoteMailDisplayText(draft.task_hint))}</p>` : ''}
      ${renderDraftObjectSummary(draft)}
      ${['queued', 'approved', 'needs_review'].includes(draft.status) || draft.approval_state !== 'none' ? renderPreSendCheckList(draft) : ''}
      <form class="inbox-draft-form" data-inbox-form="draft-edit" aria-label="Edit draft">
        <input type="hidden" name="draftId" value="${escapeHtml(draft.id)}" />
        <label for="draft-to-${escapeHtml(draft.id)}">To</label>
        <input id="draft-to-${escapeHtml(draft.id)}" name="to" type="text" autocomplete="off" value="${escapeHtml(draftRecipientsLabel(draft))}" />
        <label for="draft-subject-${escapeHtml(draft.id)}">Subject</label>
        <input id="draft-subject-${escapeHtml(draft.id)}" name="subject" type="text" autocomplete="off" value="${escapeHtml(draft.subject || '')}" />
        <label for="draft-body-${escapeHtml(draft.id)}">Message</label>
        <textarea id="draft-body-${escapeHtml(draft.id)}" name="body" rows="10">${escapeHtml(draft.body || '')}</textarea>
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
            <button class="inbox-action-btn is-primary" type="button" data-inbox-action="draft-simulate-send" data-draft-id="${escapeHtml(draft.id)}">Simulate send</button>
            <button class="inbox-action-btn is-blocked" type="button" disabled>Send blocked</button>
            <button class="inbox-action-btn" type="button" data-inbox-action="draft-dequeue" data-draft-id="${escapeHtml(draft.id)}">Return to drafts</button>
          ` : ''}
          ${draft.status === 'sent' ? `<p class="form-hint">Simulated send complete. See Activity for the record.</p>` : ''}
          <button class="inbox-action-btn is-danger" type="button" data-inbox-action="draft-delete" data-draft-id="${escapeHtml(draft.id)}">Delete draft</button>
        </div>
      </form>
      ${renderDraftActivityPanel(draft)}
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
          <h3>${escapeHtml(demoteMailDisplayText(thread.title))}</h3>
          <p class="inbox-reading-meta">${escapeHtml(demoteMailDisplayText(thread.sender || ''))} · ${escapeHtml(thread.receivedAt || '')}</p>
        </div>
        ${renderThreadStatusChip(thread.state || 'needs_review')}
      </header>
      ${renderMailLabelChips(thread.labels)}
      <div class="mail-reading-actions" role="toolbar" aria-label="Message actions">
        <button class="inbox-action-btn is-primary" type="button" data-inbox-action="toggle-reply" aria-expanded="${state.inbox.replyOpen ? 'true' : 'false'}">Reply</button>
        <button class="inbox-action-btn" type="button" data-inbox-action="toggle-compose">New draft</button>
        <button class="inbox-action-btn" type="button" data-inbox-action="open-activity">Activity</button>
        <button class="inbox-action-btn is-blocked" type="button" disabled title="Send remains blocked in this preview">Send blocked</button>
      </div>
      <div class="message-stack" aria-label="Conversation">
        ${messages.map((message) => `
          <article class="message-row">
            <header class="message-row-head">
              <strong>${escapeHtml(demoteMailDisplayText(message.from))}</strong>
              ${formatMessageMeta(message.meta) ? `<small>${escapeHtml(formatMessageMeta(message.meta))}</small>` : ''}
            </header>
            <p class="message-body">${escapeHtml(demoteMailDisplayText(message.summary))}</p>
          </article>
        `).join('')}
      </div>
      ${attachments.length ? `
        <details class="inbox-reading-details mail-attachment-details">
          <summary>Attachments (${attachments.length}) — preview metadata only</summary>
          <ul class="mail-attachment-list" aria-label="Attachments">
            ${attachments.map((item) => `<li><strong>${escapeHtml(item.label)}</strong> · ${escapeHtml(label(item.state || 'not_loaded'))}</li>`).join('')}
          </ul>
          <p class="form-hint">No file download or provider attachment body in this build.</p>
        </details>
      ` : ''}
      ${state.inbox.replyOpen ? `
        <form class="inbox-draft-form inbox-reply-sheet" data-inbox-form="reply" aria-label="Reply draft">
          <label for="reply-to">To</label>
          <input id="reply-to" name="to" type="text" autocomplete="off" value="${escapeHtml(reply.to || demoteMailDisplayText(thread.sender || ''))}" />
          <label for="reply-subject">Subject</label>
          <input id="reply-subject" name="subject" type="text" autocomplete="off" value="${escapeHtml(reply.subject || (thread.title ? `Re: ${demoteMailDisplayText(thread.title)}` : ''))}" />
          <label for="reply-body">Message</label>
          <textarea id="reply-body" name="body" rows="6">${escapeHtml(reply.body || '')}</textarea>
          <div class="inbox-form-actions">
            <button class="inbox-action-btn is-primary" type="submit" data-inbox-action="reply-save" data-thread-id="${escapeHtml(threadId)}">Save draft</button>
            <button class="inbox-action-btn" type="button" data-inbox-action="reply-clear" data-thread-id="${escapeHtml(threadId)}">Discard</button>
            <button class="inbox-action-btn is-blocked" type="button" disabled>Send blocked</button>
          </div>
        </form>
      ` : ''}
      <details class="inbox-reading-details mail-advanced-details">
        <summary>More about this conversation</summary>
        <dl class="thread-metadata-grid">
          ${(thread.fields || thread.detailFields || []).map((field) => `
            <div><dt>${escapeHtml(field.label)}</dt><dd>${escapeHtml(demoteMailDisplayText(field.value))}</dd></div>
          `).join('')}
        </dl>
        ${evidence.length ? `<ul class="detail-list">${evidence.map((item) => `<li>${escapeHtml(item.label)}: ${escapeHtml(demoteMailDisplayText(item.summary))}</li>`).join('')}</ul>` : ''}
        <p class="form-hint">Preview data only. Live mail sync and send are not enabled.</p>
      </details>
      ${(localReceiptsForThread(threadId).length || localProposalsForThread(threadId).length) ? `
        <details class="inbox-reading-details" open>
          <summary>Activity and receipts</summary>
          ${renderLocalReceiptsPanel(threadId)}
          <button class="inbox-action-btn" type="button" data-inbox-action="open-activity">Open full Activity</button>
        </details>
      ` : `
        <p class="form-hint mail-activity-hint">Actions you take (draft saved, send blocked) appear in <button class="inbox-link-btn" type="button" data-inbox-action="open-activity">Activity</button>.</p>
      `}
    </section>
  `;
}

function renderThreadListRow(thread, selected) {
  const unread = thread.unread === true;
  const accountLabel = accountLabelForThread(thread);
  return `
    <button class="thread-row ${selected?.id === thread.id ? 'is-selected' : ''} ${unread ? 'is-unread' : ''}" type="button" data-thread-id="${escapeHtml(thread.id)}" data-inspector-focus="${escapeHtml(`inbox-thread:${thread.id}`)}" aria-pressed="${selected?.id === thread.id ? 'true' : 'false'}">
      <div class="thread-row-main">
        <div class="thread-row-top">
          <strong class="thread-sender">${escapeHtml(demoteMailDisplayText(thread.sender || thread.title))}</strong>
          <time class="thread-time">${escapeHtml(thread.receivedAt || '')}</time>
        </div>
        <span class="thread-subject">${escapeHtml(demoteMailDisplayText(thread.title))}</span>
        <p class="thread-snippet">${escapeHtml(demoteMailDisplayText(thread.summary))}</p>
        ${renderMailLabelChips(thread.labels)}
        ${accountLabel ? `<span class="thread-account-badge">${escapeHtml(accountLabel)}</span>` : ''}
      </div>
      <div class="thread-row-meta">
        ${threadHasAttachmentIndicator(thread) ? '<span class="thread-attachment-indicator" title="Has attachment">Attach</span>' : ''}
        ${renderLocalTriageChip(thread.id)}
        ${renderThreadStatusChip(thread.state || 'needs_review')}
      </div>
    </button>
  `;
}

function renderDraftListRow(draft, selectedId) {
  const isApprovalQueue = state.inbox.mailboxView === 'approval-queue';
  const isQueued = draft.approval_state === 'queued';
  const batchSelected = (state.drafts.batchSelectedIds || []).includes(draft.id);
  const selected = selectedId === draft.id;
  const batchMarkup = isApprovalQueue && isQueued ? `
    <label class="draft-batch-select">
      <input type="checkbox" ${batchSelected ? 'checked' : ''} data-inbox-action="draft-batch-toggle" data-draft-id="${escapeHtml(draft.id)}" aria-label="Select ${escapeHtml(draft.subject || 'draft')} for batch approval" />
    </label>
  ` : '';
  return `
    <div class="thread-row draft-row ${selected ? 'is-selected' : ''}" data-draft-id="${escapeHtml(draft.id)}" data-inspector-focus="${escapeHtml(`inbox-draft:${draft.id}`)}" tabindex="0" role="button" aria-pressed="${selected ? 'true' : 'false'}">
      ${batchMarkup}
      <div class="thread-row-main">
        <div class="thread-row-top">
          <strong class="thread-sender">${escapeHtml(draftRecipientsLabel(draft) || draft.kind)}</strong>
          <time class="thread-time">${escapeHtml(draft.updated_at || '')}</time>
        </div>
        <span class="thread-subject">${escapeHtml(draft.subject || '(no subject)')}</span>
        <p class="thread-snippet">${escapeHtml((draft.body || '').slice(0, 120))}</p>
        ${draft.task_hint ? `<p class="thread-task-hint">${escapeHtml(draft.task_hint)}</p>` : ''}
        ${draft.account_label ? `<span class="thread-account-badge">${escapeHtml(draft.account_label)}</span>` : ''}
      </div>
      <div class="thread-row-meta">${renderDraftStatusChip(draft)}</div>
    </div>
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
  const listLabel = mailViewTitle();
  const emptyMessage = mailboxView === 'sent'
    ? 'No sent messages in this preview. Approve and simulate send from a draft to add one.'
    : mailboxView === 'archive'
      ? 'Archive is empty. Archive actions are blocked until provider sync is enabled.'
      : mailboxView === 'trash'
        ? 'Trash is empty. Delete actions remain blocked in this build.'
        : mailboxView === 'spam'
          ? 'No spam messages in this preview.'
          : state.inbox.mailSearchQuery
            ? 'No conversations match your search.'
            : 'No conversations in this view.';
  return `
    <div class="inbox-workspace is-mail-workbench">
      ${renderInboxToolbar()}
      ${mailboxView === 'approval-queue' ? renderApprovalQueueToolbar() : ''}
      <p class="mail-view-heading">${escapeHtml(listLabel)}${state.inbox.mailSearchQuery ? ` · searching “${escapeHtml(state.inbox.mailSearchQuery)}”` : ''}</p>
      <div class="inbox-workspace-grid mail-workbench-center">
        <div class="thread-list-panel mail-list-pane" aria-label="${escapeHtml(listLabel)}">
          ${mailboxView === 'drafts' || mailboxView === 'approval-queue' ? (
    visibleDrafts.length
      ? visibleDrafts.map((draft) => renderDraftListRow(draft, selectedDraftId)).join('')
      : `<p class="lane-empty-state">${mailboxView === 'approval-queue'
        ? 'No drafts in approval queue. Submit a draft from the Drafts view.'
        : 'No drafts yet. Compose or reply to create a local draft object.'}</p>`
  ) : visibleThreads.length ? visibleThreads.map((thread) => renderThreadListRow(thread, selected)).join('') : `<p class="lane-empty-state">${emptyMessage}</p>`}
        </div>
        <div class="mail-reading-stack">
          ${renderInboxReadingPane({ ...layoutSection, threads: visibleThreads }, selected)}
          ${mailboxView === 'approval-queue' ? renderBatchApprovalPreview() : ''}
        </div>
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
                  <strong class="thread-sender">${escapeHtml(demoteMailDisplayText(thread.sender || thread.title))}</strong>
                  <time class="thread-time">${escapeHtml(thread.receivedAt || '')}</time>
                </div>
                <span class="thread-subject">${escapeHtml(demoteMailDisplayText(thread.title))}</span>
                <p class="thread-snippet">${escapeHtml(demoteMailDisplayText(thread.summary))}</p>
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

function renderCalendarProviderBanner() {
  return `
    <aside class="calendar-provider-banner" role="note" aria-label="Calendar provider sync status">
      <strong>Provider calendar sync blocked</strong>
      <p>Events and reminders are local preview proposals only. Google Calendar, Outlook, and provider writes remain disabled in Tier 1.</p>
    </aside>
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
          <button class="calendar-day-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" type="button" data-calendar-action="select-day" data-day="${day}" aria-pressed="${isSelected ? 'true' : 'false'}" aria-label="${isToday ? `Today, ${day}` : `Day ${day}`}${events.length ? `, ${events.length} event(s)` : ''}">
            <span class="calendar-day-num">${day}${isToday ? ' · Today' : ''}</span>
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

function renderCalendarWeekStrip() {
  const { year, month } = calendarViewMonthParts();
  const today = new Date();
  const inViewMonth = today.getFullYear() === year && today.getMonth() === month;
  const anchorDay = state.calendar.selectedDay || (inViewMonth ? today.getDate() : 1);
  const anchor = new Date(year, month, anchorDay);
  const mondayOffset = anchor.getDay() === 0 ? -6 : 1 - anchor.getDay();
  const byDay = calendarEventsByDay();
  const cells = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() + mondayOffset + i);
    cells.push(d);
  }
  return `
    <div class="calendar-week-strip" aria-label="Week view">
      ${cells.map((date) => {
    const inMonth = date.getMonth() === month && date.getFullYear() === year;
    const day = date.getDate();
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = inMonth && state.calendar.selectedDay === day;
    const eventCount = inMonth ? (byDay[day] || []).length : 0;
    return `
        <button class="calendar-week-day ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${inMonth ? '' : 'is-outside'}" type="button"
          data-calendar-action="${inMonth ? 'select-day' : 'shift-to-day'}"
          ${inMonth ? `data-day="${day}"` : `data-shift-year="${date.getFullYear()}" data-shift-month="${date.getMonth() + 1}" data-shift-day="${day}"`}
          aria-pressed="${isSelected ? 'true' : 'false'}"
          aria-label="${escapeHtml(date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }))}${eventCount ? `, ${eventCount} event(s)` : ''}">
          <span>${escapeHtml(date.toLocaleDateString(undefined, { weekday: 'short' }))}</span>
          <strong>${day}</strong>
          ${eventCount ? `<span class="calendar-week-event-count">${eventCount} event${eventCount === 1 ? '' : 's'}</span>` : ''}
        </button>
      `;
  }).join('')}
    </div>
  `;
}

function renderCalendarDayAgendaPanel() {
  const day = state.calendar.selectedDay;
  if (!day) return '';
  const events = calendarEventsByDay()[day] || [];
  const { year, month } = calendarViewMonthParts();
  const dayLabel = new Date(year, month, day).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  return `
    <section class="calendar-day-agenda" aria-label="Day agenda for ${escapeHtml(dayLabel)}">
      <header class="calendar-day-agenda-head">
        <h4>${escapeHtml(dayLabel)}</h4>
        <span class="calendar-day-agenda-count">${events.length} event${events.length === 1 ? '' : 's'}</span>
      </header>
      ${events.length ? `
        <ul class="calendar-day-agenda-list">
          ${events.map((event) => `
            <li>
              <button class="calendar-agenda-row ${state.focusId === event.focusId || state.calendar.selectedProposalId === event.id ? 'is-selected' : ''}" type="button"
                data-calendar-action="${event.kind === 'proposal' ? 'select-proposal' : 'select-agenda'}"
                ${event.kind === 'proposal' ? `data-proposal-id="${escapeHtml(event.id)}"` : `data-focus-id="${escapeHtml(event.focusId)}"`}
                aria-pressed="${state.focusId === event.focusId || state.calendar.selectedProposalId === event.id ? 'true' : 'false'}">
                <time>${escapeHtml(event.time || '—')}</time>
                <div>
                  <strong>${escapeHtml(event.title)}</strong>
                  <p>${escapeHtml(event.summary || '')}</p>
                  <span class="calendar-event-kind">${event.kind === 'proposal' ? 'Local proposal' : 'Fixture agenda'}</span>
                </div>
              </button>
            </li>
          `).join('')}
        </ul>
      ` : '<p class="lane-empty-state">No events on this day. Create a local proposal or pick another date.</p>'}
    </section>
  `;
}

function renderCalendarProposalDetail(proposal) {
  const thread = calendarLinkedThread(proposal);
  const draft = calendarLinkedDraft(proposal);
  const tasks = calendarLinkedTasks(proposal);
  const conflicts = calendarConflictPreview(proposal);
  const receipts = (state.calendar.receipts || []).filter((entry) => entry.proposalId === proposal.id);
  const expected = calendarExpectedReceipts(proposal);
  return `
    <section class="lane-reading-pane calendar-event-detail" aria-label="Event details">
      <header class="lane-reading-head">
        <div>
          <h3>${escapeHtml(proposal.title)}</h3>
          <p class="lane-reading-meta">${escapeHtml(proposal.dateTime || 'No time set')}</p>
        </div>
        <span class="thread-status-chip ${proposal.status === 'reviewed' ? 'is-safe' : 'is-warn'}">${escapeHtml(label(proposal.status || 'proposed'))}</span>
      </header>
      <dl class="calendar-object-summary">
        <div><dt>Provider sync</dt><dd>${escapeHtml(label(proposal.providerSyncState || 'blocked'))} — no provider calendar write</dd></div>
        ${proposal.accountLabel ? `<div><dt>Account</dt><dd>${escapeHtml(proposal.accountLabel)}</dd></div>` : ''}
        ${proposal.projectTag ? `<div><dt>Project</dt><dd>${escapeHtml(proposal.projectTag)}</dd></div>` : ''}
        <div><dt>Source</dt><dd>${escapeHtml(proposal.sourceRef || 'none')}</dd></div>
        ${thread ? `<div><dt>Mail thread</dt><dd><button class="inbox-link-btn" type="button" data-calendar-action="open-source-thread" data-thread-id="${escapeHtml(thread.id)}">${escapeHtml(demoteMailDisplayText(thread.title))}</button></dd></div>` : ''}
        ${draft ? `<div><dt>Linked draft</dt><dd><button class="inbox-link-btn" type="button" data-calendar-action="open-source-draft" data-draft-id="${escapeHtml(draft.id)}">${escapeHtml(draft.subject || draft.id)}</button></dd></div>` : ''}
        ${proposal.reminderProposal ? `<div><dt>Reminder proposal</dt><dd>${escapeHtml(proposal.reminderProposal)}</dd></div>` : ''}
        ${tasks.length ? `<div><dt>Linked tasks</dt><dd>${tasks.map((task) => escapeHtml(task.title)).join(', ')}</dd></div>` : ''}
      </dl>
      <p>${escapeHtml(proposal.notes || 'No notes.')}</p>
      ${conflicts.length ? `
        <section class="calendar-conflict-preview" aria-label="Conflict preview">
          <h4>Conflict preview</h4>
          <ul>${conflicts.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
        </section>
      ` : ''}
      <div class="inbox-action-toolbar" role="toolbar" aria-label="Calendar event actions">
        <button class="inbox-action-btn is-primary" type="button" data-calendar-action="edit-event" data-proposal-id="${escapeHtml(proposal.id)}">Edit</button>
        ${proposal.status !== 'reviewed' ? `<button class="inbox-action-btn" type="button" data-calendar-action="mark-reviewed" data-proposal-id="${escapeHtml(proposal.id)}">Mark reviewed</button>` : ''}
        <button class="inbox-action-btn" type="button" data-calendar-action="add-reminder" data-proposal-id="${escapeHtml(proposal.id)}">Save reminder proposal</button>
        <button class="inbox-action-btn" type="button" data-calendar-action="open-activity">Open Activity</button>
        <button class="inbox-action-btn" type="button" data-calendar-action="proposal-clear" data-proposal-id="${escapeHtml(proposal.id)}">Delete</button>
        <button class="inbox-action-btn is-blocked" type="button" disabled title="Provider calendar sync blocked">Sync blocked</button>
      </div>
      <section class="calendar-activity-panel" aria-label="Activity and receipts">
        <h4>Activity and receipts</h4>
        ${receipts.length ? `
          <h5>Recorded locally</h5>
          ${renderCalendarLocalReceipts(proposal.id)}
        ` : '<p class="form-hint">Save or review this proposal to create local receipts.</p>'}
        <h5>Receipt expectations (preview)</h5>
        <ul class="calendar-receipt-expectations">${expected.map((entry) => `<li><strong>${escapeHtml(entry.title)}</strong> · ${escapeHtml(entry.summary)}</li>`).join('')}</ul>
      </section>
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
      <input type="hidden" name="draftId" value="${escapeHtml(selected?.draftId || '')}" />
      <label for="calendar-reminder">Reminder proposal</label>
      <input id="calendar-reminder" name="reminderProposal" type="text" autocomplete="off" value="${escapeHtml(selected?.reminderProposal || '')}" placeholder="e.g. 15 min before" />
      <label for="calendar-project">Project</label>
      <input id="calendar-project" name="projectTag" type="text" autocomplete="off" value="${escapeHtml(selected?.projectTag || '')}" />
      <label for="calendar-account">Account label</label>
      <input id="calendar-account" name="accountLabel" type="text" autocomplete="off" value="${escapeHtml(selected?.accountLabel || '')}" />
      <label for="calendar-status">Status</label>
      <select id="calendar-status" name="status">
        ${['proposed', 'reviewed'].map((status) => `<option value="${status}" ${selected?.status === status ? 'selected' : ''}>${escapeHtml(label(status))}</option>`).join('')}
      </select>
      <p class="form-hint">Preview only — not scheduled on a provider calendar. Provider sync blocked.</p>
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
  if (proposal) return renderCalendarProposalDetail(proposal);
  if (agenda) {
    return `
      <section class="lane-reading-pane calendar-event-detail" aria-label="Fixture event details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(agenda.title)}</h3>
            <p class="lane-reading-meta">${escapeHtml(agenda.time)}</p>
          </div>
          <span class="thread-status-chip is-neutral">Fixture agenda</span>
        </header>
        <p>${escapeHtml(agenda.summary)}</p>
        ${agenda.tags.length ? `<p class="form-hint">${agenda.tags.map((tag) => escapeHtml(label(tag))).join(' · ')}</p>` : ''}
        <p class="form-hint">Provider sync blocked — fixture agenda only.</p>
        ${conflicts.length ? `
          <section class="calendar-conflict-preview" aria-label="Scheduling notes">
            <h4>Scheduling notes</h4>
            ${conflicts.map((item) => `<p><strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(item.summary)}</p>`).join('')}
          </section>
        ` : ''}
        <button class="inbox-action-btn" type="button" data-calendar-action="open-activity">Open Activity</button>
      </section>
    `;
  }
  if (state.calendar.selectedDay) {
    const { year, month } = calendarViewMonthParts();
    const dayLabel = new Date(year, month, state.calendar.selectedDay).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    return `
      <section class="lane-reading-pane is-empty calendar-day-summary" aria-label="Day summary">
        <p class="lane-empty-state">Selected ${escapeHtml(dayLabel)}. Pick an event in the day agenda or create a local proposal.</p>
      </section>
    `;
  }
  return `<section class="lane-reading-pane is-empty" aria-label="Event details"><p class="lane-empty-state">Select a day or event, or create one.</p></section>`;
}

function renderCalendarWorkspace() {
  return `
    <div class="lane-workspace calendar-workspace">
      ${renderCalendarProviderBanner()}
      <div class="lane-toolbar" role="toolbar" aria-label="Calendar actions">
        <button class="inbox-action-btn is-primary" type="button" data-calendar-action="new-event">New event</button>
        <div id="calendarStatusRegion" class="inbox-status-region is-compact" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'calendar' ? state.statusMessage : '')}</div>
        <details class="lane-toolbar-overflow">
          <summary>More</summary>
          <button class="inbox-action-btn is-danger" type="button" data-calendar-action="clear-all">Clear local calendar state</button>
        </details>
      </div>
      <div class="lane-workspace-grid calendar-workspace-grid">
        <div class="calendar-main-pane">
          ${renderCalendarWeekStrip()}
          ${renderCalendarMonthGrid()}
          ${renderCalendarDayAgendaPanel()}
        </div>
        ${renderCalendarReadingPane()}
      </div>
      ${renderCalendarEventSheet()}
    </div>
  `;
}

function renderStorySourceLinks(story) {
  if (!story) return '';
  const links = [];
  if (story.sourceThreadId) {
    links.push(`<button class="task-source-link" type="button" data-tasks-action="open-source-thread" data-thread-id="${escapeHtml(story.sourceThreadId)}">Open mail thread</button>`);
  }
  if (story.sourceDraftId) {
    links.push(`<button class="task-source-link" type="button" data-tasks-action="open-source-draft" data-draft-id="${escapeHtml(story.sourceDraftId)}">Open draft</button>`);
  }
  if (story.sourceCalendarId) {
    links.push(`<button class="task-source-link" type="button" data-tasks-action="open-source-calendar" data-calendar-id="${escapeHtml(story.sourceCalendarId)}">Open calendar proposal</button>`);
  }
  return links.length ? `<div class="task-source-row">${links.join(' ')}</div>` : '';
}

function renderAcceptanceCriteriaList(story) {
  if (!story?.acceptanceCriteria?.length) {
    return '<p class="form-hint">No acceptance criteria yet.</p>';
  }
  return `
    <ul class="acceptance-criteria-list" aria-label="Acceptance criteria">
      ${story.acceptanceCriteria.map((ac) => `
        <li class="acceptance-criterion is-${escapeHtml(ac.state)}">
          <span class="ac-text">${escapeHtml(ac.text)}</span>
          <span class="ac-state-label">${escapeHtml(label(ac.state))}</span>
          <div class="ac-state-actions" role="group" aria-label="Set ${escapeHtml(ac.text)} state">
            ${AC_STATES.map((acState) => `
              <button class="inbox-action-btn ${ac.state === acState ? 'is-primary' : ''}" type="button"
                data-tasks-action="set-ac-state" data-story-id="${escapeHtml(story.id)}" data-ac-id="${escapeHtml(ac.id)}" data-ac-state="${escapeHtml(acState)}"
                aria-pressed="${ac.state === acState ? 'true' : 'false'}">${escapeHtml(label(acState))}</button>
            `).join('')}
          </div>
        </li>
      `).join('')}
    </ul>
  `;
}

function renderEvidenceSection(story, bug) {
  const items = story ? evidenceForStory(story.id) : evidenceForBug(bug?.id);
  return `
    <section class="tasks-evidence-panel" aria-label="Evidence and artifacts">
      <h4>Evidence / artifacts</h4>
      <p class="form-hint">Cloud storage upload blocked. Local placeholder links only.</p>
      ${items.length ? `
        <ul class="tasks-evidence-list">
          ${items.map((entry) => `
            <li>
              <strong>${escapeHtml(entry.label)}</strong> · ${escapeHtml(entry.note || entry.sourceRef)}
              <span class="evidence-state">${escapeHtml(label(entry.storageState || 'blocked'))}</span>
              ${entry.exportPlaceholder ? `<span class="form-hint">${escapeHtml(entry.exportPlaceholder)}</span>` : ''}
            </li>
          `).join('')}
        </ul>
      ` : '<p class="form-hint">No evidence linked yet.</p>'}
      ${story ? `<button class="inbox-action-btn" type="button" data-tasks-action="add-evidence" data-story-id="${escapeHtml(story.id)}">Add artifact placeholder</button>` : ''}
      <button class="inbox-action-btn is-blocked" type="button" disabled title="Cloud evidence upload blocked">Upload blocked</button>
    </section>
  `;
}

function renderStoryDetail(story) {
  if (!story) return '<p class="lane-empty-state">Select a user story.</p>';
  const epic = allEpics().find((entry) => entry.id === story.epicId);
  const bugs = bugsForStory(story.id);
  const receipts = (state.tasks.receipts || []).filter((entry) => entry.taskId === story.id);
  return `
    <section class="tasks-story-detail" aria-label="User story details">
      <header class="lane-reading-head">
        <div>
          <h3>${escapeHtml(story.title)}</h3>
          <p class="lane-reading-meta">User story · ${escapeHtml(label(story.status))} · ${escapeHtml(label(story.priority))} · ${escapeHtml(label(story.phase || 'backlog'))}</p>
        </div>
        <span class="thread-status-chip is-warn">Story</span>
      </header>
      <dl class="tasks-object-summary">
        ${epic ? `<div><dt>Epic</dt><dd>${escapeHtml(epic.title)}</dd></div>` : ''}
        <div><dt>Requirement</dt><dd>${escapeHtml(story.requirement || '—')}</dd></div>
        <div><dt>Phase</dt><dd>${escapeHtml(label(story.phase || 'backlog'))}</dd></div>
      </dl>
      ${renderStorySourceLinks(story)}
      ${renderPlanningStatusButtons(story.id, story.status || 'backlog', 'story')}
      <section class="tasks-ac-panel" aria-label="Acceptance criteria">
        <h4>Acceptance criteria</h4>
        ${renderAcceptanceCriteriaList(story)}
      </section>
      ${renderEvidenceSection(story, null)}
      <section class="tasks-bugs-panel" aria-label="Bugs from story">
        <h4>Bugs (${bugs.length})</h4>
        ${bugs.length ? `<ul class="tasks-bug-list">${bugs.map((bug) => `<li><button class="inbox-link-btn" type="button" data-tasks-action="select-bug" data-bug-id="${escapeHtml(bug.id)}">${escapeHtml(bug.title)}</button> · ${escapeHtml(label(bug.status))}</li>`).join('')}</ul>` : '<p class="form-hint">No bugs filed from this story yet.</p>'}
        <button class="inbox-action-btn is-primary" type="button" data-tasks-action="new-bug" data-story-id="${escapeHtml(story.id)}">Create bug from story</button>
        <button class="inbox-action-btn is-blocked" type="button" disabled title="External tracker blocked">External tracker blocked</button>
      </section>
      <section class="tasks-activity-panel" aria-label="Activity and receipts">
        <h4>Activity and receipts</h4>
        ${receipts.length ? renderTasksLocalReceipts(story.id) : '<p class="form-hint">Change status or file a bug to create receipts.</p>'}
        <ul class="tasks-receipt-expectations">${taskExpectedReceipts(story).map((entry) => `<li><strong>${escapeHtml(entry.title)}</strong> · ${escapeHtml(entry.summary)}</li>`).join('')}</ul>
        <button class="inbox-action-btn" type="button" data-tasks-action="open-activity">Open Activity</button>
      </section>
    </section>
  `;
}

function renderBugDetail(bug) {
  if (!bug) return '';
  const story = storyById(bug.storyId);
  return `
    <section class="tasks-bug-detail" aria-label="Bug details">
      <header class="lane-reading-head">
        <div>
          <h3>${escapeHtml(bug.title)}</h3>
          <p class="lane-reading-meta">Bug · ${escapeHtml(label(bug.status))} · severity ${escapeHtml(label(bug.severity))}</p>
        </div>
        <span class="thread-status-chip is-warn">Bug</span>
      </header>
      <dl class="tasks-object-summary">
        ${story ? `<div><dt>Story</dt><dd>${escapeHtml(story.title)}</dd></div>` : ''}
        <div><dt>Requirement ref</dt><dd>${escapeHtml(bug.requirementRef || '—')}</dd></div>
        <div><dt>AC ref</dt><dd>${escapeHtml(bug.acRef || '—')}</dd></div>
        <div><dt>Observed</dt><dd>${escapeHtml(bug.observed || '—')}</dd></div>
        <div><dt>Expected</dt><dd>${escapeHtml(bug.expected || '—')}</dd></div>
        <div><dt>Actual</dt><dd>${escapeHtml(bug.actual || '—')}</dd></div>
      </dl>
      ${renderEvidenceSection(null, bug)}
      ${renderPlanningStatusButtons(bug.id, bug.status || 'backlog', 'bug')}
    </section>
  `;
}

function renderTasksPlanningWorkspace() {
  const epics = allEpics();
  const stories = allStories(null, state.tasks.selectedEpicId || selectedEpic()?.id);
  const story = selectedStory();
  const bug = selectedBug();
  return `
    <div class="tasks-planning-grid" aria-label="Tasks planning workspace">
      <section class="tasks-epic-panel" aria-label="Epics">
        <h4>Epics</h4>
        <ul class="tasks-epic-list">
          ${epics.map((epic) => `
            <li>
              <button class="tasks-epic-row ${state.tasks.selectedEpicId === epic.id ? 'is-selected' : ''}" type="button"
                data-tasks-action="select-epic" data-epic-id="${escapeHtml(epic.id)}" aria-pressed="${state.tasks.selectedEpicId === epic.id ? 'true' : 'false'}">
                <strong>${escapeHtml(epic.title)}</strong>
                <span>${escapeHtml(label(epic.status))} · ${escapeHtml(label(epic.priority))}</span>
              </button>
            </li>
          `).join('')}
        </ul>
      </section>
      <section class="tasks-story-panel" aria-label="User stories">
        <h4>User stories</h4>
        <ul class="tasks-story-list">
          ${stories.length ? stories.map((entry) => `
            <li>
              <button class="tasks-story-row ${state.tasks.selectedStoryId === entry.id ? 'is-selected' : ''}" type="button"
                data-tasks-action="select-story" data-story-id="${escapeHtml(entry.id)}" aria-pressed="${state.tasks.selectedStoryId === entry.id ? 'true' : 'false'}">
                <strong>${escapeHtml(entry.title)}</strong>
                <span>${escapeHtml(label(entry.status))} · ${escapeHtml(label(entry.priority))}</span>
              </button>
            </li>
          `).join('') : '<li class="form-hint">No stories in this epic.</li>'}
        </ul>
      </section>
      <div class="tasks-detail-panel">
        ${bug ? renderBugDetail(bug) : renderStoryDetail(story)}
      </div>
    </div>
  `;
}

function renderTasksProjectSelector() {
  const projects = allProjects();
  const selected = state.projects.selectedProjectId || projects[0]?.id || '';
  return `
    <label class="tasks-project-select" for="tasks-project-picker">
      <span>Project</span>
      <select id="tasks-project-picker" name="projectId">
        ${projects.map((project) => `<option value="${escapeHtml(project.id)}" ${project.id === selected ? 'selected' : ''}>${escapeHtml(project.name)} (${escapeHtml(label(project.phase))})</option>`).join('')}
      </select>
    </label>
  `;
}

function renderTasksViewToggle() {
  const mode = state.tasks.viewMode || 'planning';
  return `
    <div class="tasks-view-toggle" role="tablist" aria-label="Tasks view">
      <button class="inbox-action-btn ${mode === 'planning' ? 'is-primary' : ''}" type="button" data-tasks-action="view-planning" role="tab" aria-selected="${mode === 'planning' ? 'true' : 'false'}">Planning</button>
      <button class="inbox-action-btn ${mode === 'board' ? 'is-primary' : ''}" type="button" data-tasks-action="view-board" role="tab" aria-selected="${mode === 'board' ? 'true' : 'false'}">Board</button>
    </div>
  `;
}

function renderTasksProviderBanner() {
  return `
    <aside class="tasks-provider-banner" role="note" aria-label="Task provider sync status">
      <strong>External tracker and provider sync blocked</strong>
      <p>Tasks, stories, and bugs are local preview objects only. No GitHub Issues, Jira, Linear, or provider task write in Tier 1.</p>
    </aside>
  `;
}

function renderPlanningStatusButtons(itemId, currentStatus, kind) {
  if (!itemId) return '';
  const action = kind === 'bug' ? 'set-bug-status' : 'set-story-status';
  const attr = kind === 'bug' ? 'data-bug-id' : 'data-story-id';
  return `
    <div class="tasks-status-bar" aria-label="Local ${kind} status changes">
      <span class="form-hint">Status:</span>
      ${TASK_STATUSES.map((status) => `
        <button class="inbox-action-btn ${currentStatus === status ? 'is-primary' : ''}" type="button" data-tasks-action="${action}" ${attr}="${escapeHtml(itemId)}" data-task-status="${escapeHtml(status)}" aria-pressed="${currentStatus === status ? 'true' : 'false'}">${escapeHtml(label(status))}</button>
      `).join('')}
    </div>
  `;
}

function changeBugStatus(bugId, status) {
  if (!bugId || !TASK_STATUSES.includes(migrateTaskStatus(status))) return;
  const next = migrateTaskStatus(status);
  state.bugs.items = (state.bugs.items || []).map((entry) => (
    entry.id === bugId ? { ...entry, status: next, updatedAt: new Date().toISOString() } : entry
  ));
  addTaskReceipt({ type: 'status', title: 'Bug status changed (preview)', taskId: bugId, summary: `Bug status set to ${label(next)}.` });
  state.tasks.selectedBugId = bugId;
  saveState();
  setStatusMessage(`Bug status changed to ${label(next)} locally.`, 'tasks');
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
  const columnDefs = [
    { label: 'Backlog', state: 'backlog' },
    { label: 'Ready', state: 'ready' },
    { label: 'In progress', state: 'active' },
    { label: 'Blocked', state: 'blocked' },
    { label: 'Review', state: 'review' },
    { label: 'Done', state: 'done-preview' },
  ];
  const columns = columnDefs.map((def) => ({ ...def, items: [] }));
  const content = activeLaneContent();
  const section = sectionByType(content, 'task-board');
  const sectionIndex = (content.sections || []).findIndex((entry) => entry === section);
  (section?.columns || []).forEach((column, columnIndex) => {
    const mappedLabel = { Proposed: 'Backlog', Blocked: 'Blocked', Review: 'Review', Done: 'Done' }[column.label] || column.label;
    const col = columns.find((entry) => entry.label === mappedLabel) || columns[0];
    (column.items || []).forEach((item, index) => {
      col.items.push({
        kind: 'fixture',
        focusId: `tasks:task-board:${sectionIndex}:${columnIndex}-${index}`,
        title: item.title,
        summary: item.summary,
        meta: item.meta,
        state: item.state,
      });
    });
  });
  allLocalTasks().forEach((task) => {
    const colLabel = TASK_COLUMN_MAP[task.status] || 'Backlog';
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
  allStories().forEach((story) => {
    const colLabel = TASK_COLUMN_MAP[story.status] || 'Backlog';
    const col = columns.find((entry) => entry.label === colLabel) || columns[0];
    col.items.push({
      kind: 'story',
      id: story.id,
      focusId: `tasks:story:${story.id}`,
      title: story.title,
      summary: story.requirement || '',
      story,
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
      : item.kind === 'story'
        ? state.tasks.selectedStoryId === item.id
        : state.focusId === item.focusId;
    return `
              <button class="tasks-kanban-card ${isSelected ? 'is-selected' : ''}" type="button"
                data-tasks-action="${item.kind === 'local' ? 'select-task' : item.kind === 'story' ? 'select-story' : 'select-fixture'}"
                ${item.kind === 'local' ? `data-task-id="${escapeHtml(item.id)}"` : item.kind === 'story' ? `data-story-id="${escapeHtml(item.id)}"` : `data-focus-id="${escapeHtml(item.focusId)}"`}
                data-inspector-focus="${escapeHtml(item.focusId)}">
                <strong>${escapeHtml(item.title)}</strong>
                <span class="tasks-card-kind">${item.kind === 'story' ? 'Story' : item.kind === 'local' ? 'Task' : 'Fixture'}</span>
                <p>${escapeHtml(demoteMailDisplayText(item.summary || (item.kind === 'local' && item.task?.dueDate ? `Due ${item.task.dueDate}` : '')))}</p>
                ${item.kind === 'story' && item.story ? renderStorySourceLinks(item.story) : renderTaskSourceLink(item)}
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

function renderTasksBugForm(storyId) {
  const story = storyById(storyId);
  return `
    <form class="inbox-draft-form" data-tasks-form="bug" aria-label="Create bug from story">
      <input type="hidden" name="storyId" value="${escapeHtml(storyId || '')}" />
      <label for="bug-title">Bug title</label>
      <input id="bug-title" name="title" type="text" autocomplete="off" value="${story ? `Bug: ${story.title}` : ''}" />
      <label for="bug-requirement">Requirement reference</label>
      <input id="bug-requirement" name="requirementRef" type="text" autocomplete="off" value="${escapeHtml(story?.requirement || '')}" />
      <label for="bug-ac">Acceptance criterion reference</label>
      <input id="bug-ac" name="acRef" type="text" autocomplete="off" placeholder="e.g. ac-transport-2" />
      <label for="bug-observed">Observed problem</label>
      <textarea id="bug-observed" name="observed" rows="2"></textarea>
      <label for="bug-expected">Expected result</label>
      <textarea id="bug-expected" name="expected" rows="2"></textarea>
      <label for="bug-actual">Actual result</label>
      <textarea id="bug-actual" name="actual" rows="2"></textarea>
      <label for="bug-severity">Severity</label>
      <select id="bug-severity" name="severity">
        ${['low', 'medium', 'high', 'critical'].map((level) => `<option value="${level}">${escapeHtml(label(level))}</option>`).join('')}
      </select>
      <label for="bug-priority">Priority</label>
      <select id="bug-priority" name="priority">
        ${TASK_PRIORITIES.map((level) => `<option value="${level}">${escapeHtml(label(level))}</option>`).join('')}
      </select>
      <label for="bug-evidence">Evidence note (local only)</label>
      <textarea id="bug-evidence" name="evidenceNote" rows="2" placeholder="Local evidence note — no cloud upload"></textarea>
      <p class="form-hint">Preview only — external issue tracker mutation blocked.</p>
      <div class="inbox-form-actions">
        <button class="inbox-action-btn is-primary" type="submit" data-tasks-action="bug-save">Save bug</button>
        <button class="inbox-action-btn" type="button" data-tasks-action="close-bug-form">Cancel</button>
        <button class="inbox-action-btn is-blocked" type="button" disabled>Tracker sync blocked</button>
      </div>
    </form>
  `;
}

function renderTasksBugSheet() {
  const storyId = state.tasks.selectedStoryId || '';
  return `
    <div class="lane-compose-root tasks-compose-root ${state.tasks.bugFormOpen ? 'is-open' : ''}" aria-hidden="${state.tasks.bugFormOpen ? 'false' : 'true'}">
      <button class="lane-compose-backdrop" type="button" data-tasks-action="close-bug-form" aria-label="Close"></button>
      <section class="lane-compose-sheet" role="dialog" aria-modal="true" aria-label="Create bug from story">
        <header class="lane-compose-head">
          <h3>Create bug from story</h3>
          <button class="inbox-action-btn" type="button" data-tasks-action="close-bug-form">Close</button>
        </header>
        ${renderTasksBugForm(storyId)}
      </section>
    </div>
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
  const story = state.tasks.viewMode === 'board' && state.tasks.selectedStoryId
    ? storyById(state.tasks.selectedStoryId)
    : null;
  const bug = state.tasks.selectedBugId ? selectedBug() : null;
  const fixture = taskBoardFixtures().find((entry) => entry.focusId === state.focusId);
  const links = taskLinkFixtures();
  if (bug && state.tasks.viewMode === 'board') return renderBugDetail(bug);
  if (story && state.tasks.viewMode === 'board') return renderStoryDetail(story);
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
        ${renderTaskStatusButtons(task.id, migrateTaskStatus(task.status || 'backlog'))}
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
            <p class="lane-reading-meta">${escapeHtml(fixture.column)}</p>
          </div>
        </header>
        <p>${escapeHtml(demoteMailDisplayText(fixture.summary))}</p>
        <div class="task-source-row">${renderTaskSourceLink(fixture)}</div>
        ${fixture.meta ? `<p class="form-hint">${escapeHtml(demoteMailDisplayText(fixture.meta))}</p>` : ''}
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
  const mode = state.tasks.viewMode || 'planning';
  return `
    <div class="lane-workspace tasks-workspace">
      ${renderTasksProviderBanner()}
      <div class="lane-toolbar" role="toolbar" aria-label="Tasks actions">
        ${renderTasksProjectSelector()}
        ${renderTasksViewToggle()}
        <button class="inbox-action-btn is-primary" type="button" data-tasks-action="new-task">New task</button>
        <div id="tasksStatusRegion" class="inbox-status-region is-compact" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'tasks' ? state.statusMessage : '')}</div>
        <details class="lane-toolbar-overflow">
          <summary>More</summary>
          <button class="inbox-action-btn is-danger" type="button" data-tasks-action="clear-all">Clear local tasks state</button>
        </details>
      </div>
      <div class="lane-workspace-grid tasks-workspace-grid ${mode === 'board' ? 'is-kanban' : 'is-planning'}">
        ${mode === 'planning' ? renderTasksPlanningWorkspace() : renderTasksKanbanBoard()}
        ${mode === 'board' ? renderTasksReadingPane() : ''}
      </div>
      ${renderTasksTaskSheet()}
      ${renderTasksBugSheet()}
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

function renderAutomationsExecutionBanner() {
  return `
    <div class="automations-execution-banner" role="note">
      <strong>Execution blocked</strong>
      <span>Rules save locally. Dry-run simulates When→If→Then. Enable, provider writes, and runtime automation remain disabled in Tier 1 preview.</span>
    </div>
  `;
}

function renderAutomationsBuilderBlock(label, value, hint) {
  return `
    <div class="automation-builder-block">
      <span class="rule-flow-label">${escapeHtml(label)}</span>
      <p>${escapeHtml(value || 'Not set')}</p>
      ${hint ? `<span class="form-hint">${escapeHtml(hint)}</span>` : ''}
    </div>
  `;
}

function renderAutomationsVisualBuilder(rule) {
  const trigger = catalogTrigger(rule.triggerId);
  const condition = catalogCondition(rule.conditionId);
  const action = automationActionById(rule.actionId);
  return `
    <div class="automation-visual-builder" aria-label="Visual rule builder">
      ${renderAutomationsBuilderBlock('When', trigger?.label || rule.trigger, trigger?.summary || 'Pick a trigger in Edit')}
      <div class="rule-flow-arrow" aria-hidden="true">→</div>
      ${renderAutomationsBuilderBlock('If', condition?.label || rule.condition, condition?.summary || 'Add a condition row')}
      <div class="rule-flow-arrow" aria-hidden="true">→</div>
      ${renderAutomationsBuilderBlock('Then', action ? action.title : (rule.proposal || 'Pick an action'), action?.summary || rule.proposal || 'Choose from action library')}
    </div>
  `;
}

function renderAutomationsActionLibraryPanel() {
  const actions = allAutomationActions();
  const selectedId = state.automations.selectedActionId;
  return `
    <aside class="automations-action-library" aria-label="Reusable action library">
      <p class="settings-section-label">Action library</p>
      <p class="form-hint">System defaults plus actions you save from rules. Pick when building a rule.</p>
      ${actions.length ? actions.map((action) => `
        <button class="automations-list-row automations-action-row ${action.id === selectedId ? 'is-selected' : ''}" type="button" data-automations-action="select-action" data-action-id="${escapeHtml(action.id)}">
          <span class="automations-list-badge">${escapeHtml(action.source === 'system' ? 'default' : 'saved')}</span>
          <div>
            <strong>${escapeHtml(action.title)}</strong>
            <p>${escapeHtml(action.summary)}</p>
            <span class="automation-rule-meta">${escapeHtml(label(action.category || 'custom'))} · gate: ${escapeHtml(action.gate || AUTOMATION_GATE_DEFAULT)}</span>
          </div>
        </button>
      `).join('') : '<p class="form-hint">Library empty — clear state re-seeds defaults.</p>'}
    </aside>
  `;
}

function renderAutomationsRuleForm(ruleId) {
  const selected = ruleId
    ? allLocalAutomationRules().find((entry) => entry.id === ruleId)
    : selectedAutomationRule();
  const id = ruleId || selected?.id || '';
  const triggerOptions = AUTOMATION_TRIGGER_CATALOG.map((entry) => `
    <option value="${escapeHtml(entry.id)}" ${selected?.triggerId === entry.id ? 'selected' : ''}>${escapeHtml(entry.label)}</option>
  `).join('');
  const conditionOptions = AUTOMATION_CONDITION_CATALOG.map((entry) => `
    <option value="${escapeHtml(entry.id)}" ${selected?.conditionId === entry.id ? 'selected' : ''}>${escapeHtml(entry.label)}</option>
  `).join('');
  const actionOptions = allAutomationActions().map((entry) => `
    <option value="${escapeHtml(entry.id)}" ${selected?.actionId === entry.id ? 'selected' : ''}>${escapeHtml(entry.title)}</option>
  `).join('');
  return `
    <form class="inbox-draft-form automations-rule-form" data-automations-form="rule" aria-label="Automation rule builder">
      <input type="hidden" name="ruleId" value="${escapeHtml(id)}" />
      <label for="auto-title">Rule name</label>
      <input id="auto-title" name="title" type="text" autocomplete="off" value="${escapeHtml(selected?.title || '')}" />
      <div class="automation-form-builder-row">
        <div class="automation-builder-block">
          <label for="auto-trigger-id">When (trigger)</label>
          <select id="auto-trigger-id" name="triggerId">
            <option value="">Choose trigger…</option>
            ${triggerOptions}
          </select>
        </div>
        <div class="automation-builder-block">
          <label for="auto-condition-id">If (condition)</label>
          <select id="auto-condition-id" name="conditionId">
            <option value="">Choose condition…</option>
            ${conditionOptions}
          </select>
        </div>
        <div class="automation-builder-block">
          <label for="auto-action-id">Then (action)</label>
          <select id="auto-action-id" name="actionId">
            <option value="">Choose from library…</option>
            ${actionOptions}
          </select>
        </div>
      </div>
      <label for="auto-proposal">Custom action text (optional if library action selected)</label>
      <textarea id="auto-proposal" name="proposal" rows="2">${escapeHtml(selected?.proposal || '')}</textarea>
      <label for="auto-gate">Approval gate</label>
      <input id="auto-gate" name="gate" type="text" autocomplete="off" value="${escapeHtml(selected?.gate || AUTOMATION_GATE_DEFAULT)}" />
      <input type="hidden" name="trigger" value="${escapeHtml(selected?.trigger || '')}" />
      <input type="hidden" name="condition" value="${escapeHtml(selected?.condition || '')}" />
      <p class="form-hint">Visual builder saves locally. Automatic run is not enabled in this build.</p>
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
    const expectedReceipts = automationExpectedReceipts(rule);
    return `
      <section class="lane-reading-pane" aria-label="Rule details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(rule.title)}</h3>
            <p class="lane-reading-meta">${rule.state === 'enabled' ? 'Enabled' : 'Off'} · dry-run only · not running in this build</p>
          </div>
        </header>
        ${renderAutomationsVisualBuilder(rule)}
        <p class="form-hint">Requires: ${escapeHtml(rule.gate || AUTOMATION_GATE_DEFAULT)}</p>
        <div class="inbox-action-toolbar">
          <button class="inbox-action-btn is-primary" type="button" data-automations-action="dry-run" data-rule-id="${escapeHtml(rule.id)}">Test rule</button>
          <button class="inbox-action-btn" type="button" data-automations-action="edit-rule" data-rule-id="${escapeHtml(rule.id)}">Edit</button>
          <button class="inbox-action-btn" type="button" data-automations-action="save-as-action" data-rule-id="${escapeHtml(rule.id)}">Save as action</button>
          <button class="inbox-action-btn" type="button" data-automations-action="open-activity">Open Activity</button>
          <button class="inbox-action-btn" type="button" data-automations-action="rule-clear" data-rule-id="${escapeHtml(rule.id)}">Delete</button>
          <button class="inbox-action-btn is-blocked" type="button" disabled>Turn on blocked</button>
        </div>
        <details class="lane-reading-details">
          <summary>Expected receipts (preview)</summary>
          <ul class="automation-expected-receipts">
            ${expectedReceipts.map((entry) => `<li><strong>${escapeHtml(entry.title)}</strong> — ${escapeHtml(entry.summary)}</li>`).join('')}
          </ul>
        </details>
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
            <p class="lane-reading-meta">starter example · ${escapeHtml(label(template.state))}</p>
          </div>
        </header>
        <div class="automation-visual-builder" aria-label="Template flow">
          ${renderAutomationsBuilderBlock('When', template.trigger, 'Fixture trigger — map to catalog when editing')}
          <div class="rule-flow-arrow" aria-hidden="true">→</div>
          ${renderAutomationsBuilderBlock('If', 'Always', 'Adjust conditions after creating rule')}
          <div class="rule-flow-arrow" aria-hidden="true">→</div>
          ${renderAutomationsBuilderBlock('Then', template.summary, 'Pick a library action or custom text')}
        </div>
        <p class="form-hint">Gate: ${escapeHtml(template.gate)}</p>
        <div class="inbox-action-toolbar">
          <button class="inbox-action-btn is-primary" type="button" data-automations-action="use-template" data-focus-id="${escapeHtml(template.focusId)}">Create rule from template</button>
        </div>
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
      ${renderAutomationsExecutionBanner()}
      <div class="lane-toolbar" role="toolbar" aria-label="Automations actions">
        <button class="inbox-action-btn is-primary" type="button" data-automations-action="new-rule">New rule</button>
        <div id="automationsStatusRegion" class="inbox-status-region is-compact" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'automations' ? state.statusMessage : '')}</div>
        <details class="lane-toolbar-overflow">
          <summary>More</summary>
          <button class="inbox-action-btn is-danger" type="button" data-automations-action="clear-all">Clear local automations state</button>
        </details>
      </div>
      <div class="lane-workspace-grid automations-workspace-grid automations-workspace-grid-three">
        <div class="automations-item-list" aria-label="Rules and starter examples">
          <p class="settings-section-label">Your rules</p>
          ${rules.length ? rules.map((rule) => `
            <button class="automations-list-row ${rule.id === selectedId ? 'is-selected' : ''}" type="button" data-automations-action="select-rule" data-rule-id="${escapeHtml(rule.id)}" data-inspector-focus="${escapeHtml(`automations:local:${rule.id}`)}">
              <span class="automations-list-badge">${rule.state === 'enabled' ? 'on' : 'off'}</span>
              <div><strong>${escapeHtml(rule.title)}</strong><p>${escapeHtml(rule.trigger || 'No trigger yet')}</p></div>
            </button>
          `).join('') : '<p class="form-hint">No rules yet. Create one or start from a starter example below.</p>'}
          <p class="settings-section-label">Starter examples</p>
          <p class="form-hint">Primary templates — select to preview, then create a local rule.</p>
          ${templates.map((item) => `
            <button class="automations-list-row ${state.focusId === item.focusId ? 'is-selected' : ''}" type="button" data-automations-action="select-template" data-focus-id="${escapeHtml(item.focusId)}" data-inspector-focus="${escapeHtml(item.focusId)}">
              <span class="automations-list-badge">example</span>
              <div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(demoteMailDisplayText(item.summary))}</p></div>
            </button>
          `).join('')}
        </div>
        ${renderAutomationsReadingPane()}
        ${renderAutomationsActionLibraryPanel()}
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

function renderExtensionsTaxonomyBanner() {
  return `
    <div class="extensions-taxonomy-banner" role="note">
      <strong>Integration taxonomy</strong>
      <span>Internal xi-io capabilities are built in. External providers require OAuth and gates. Local tools stay on-device. Nothing in this preview connects to live providers.</span>
    </div>
  `;
}

function renderExtensionsFilterBar() {
  const category = state.extensions.categoryFilter || 'all';
  const status = state.extensions.statusFilter || 'all';
  const query = state.extensions.searchQuery || '';
  return `
    <div class="extensions-filter-bar" role="search">
      <div class="extensions-category-tabs" role="tablist" aria-label="Extension categories">
        <button class="extensions-filter-chip ${category === 'all' ? 'is-active' : ''}" type="button" role="tab" aria-selected="${category === 'all' ? 'true' : 'false'}" data-extensions-action="filter-category" data-category-id="all">All</button>
        ${EXTENSION_CATEGORY_CATALOG.map((entry) => `
          <button class="extensions-filter-chip ${category === entry.id ? 'is-active' : ''}" type="button" role="tab" aria-selected="${category === entry.id ? 'true' : 'false'}" data-extensions-action="filter-category" data-category-id="${escapeHtml(entry.id)}">${escapeHtml(entry.label)}</button>
        `).join('')}
      </div>
      <div class="extensions-status-filters" aria-label="Status filters">
        ${EXTENSION_STATUS_FILTERS.map((entry) => `
          <button class="extensions-filter-chip is-compact ${status === entry.id ? 'is-active' : ''}" type="button" aria-pressed="${status === entry.id ? 'true' : 'false'}" data-extensions-action="filter-status" data-status-id="${escapeHtml(entry.id)}">${escapeHtml(entry.label)}</button>
        `).join('')}
      </div>
      <form class="extensions-search-form" data-extensions-form="search" aria-label="Search extensions">
        <label class="visually-hidden" for="extensions-search-input">Search extensions</label>
        <input id="extensions-search-input" class="extensions-search-input" type="search" name="query" autocomplete="off" placeholder="Search providers and tools" value="${escapeHtml(query)}" />
        ${query ? '<button class="inbox-action-btn" type="button" data-extensions-action="clear-search">Clear</button>' : ''}
        <button class="inbox-action-btn" type="submit">Search</button>
      </form>
    </div>
  `;
}

function renderExtensionProviderCard(provider) {
  const install = installForProvider(provider.id);
  const isSelected = state.extensions.selectedProviderId === provider.id
    || state.focusId === provider.focusId
    || (install && state.focusId === `extensions:local:${install.id}`);
  return `
    <button class="extensions-provider-card ${isSelected ? 'is-selected' : ''}" type="button" data-extensions-action="select-provider" data-provider-id="${escapeHtml(provider.id)}" data-inspector-focus="${escapeHtml(provider.focusId)}" aria-pressed="${isSelected ? 'true' : 'false'}">
      <header class="extensions-provider-card-head">
        <strong>${escapeHtml(provider.name)}</strong>
        <span class="extensions-marker extensions-marker-${escapeHtml(provider.marker)}">${escapeHtml(extensionMarkerLabel(provider.marker))}</span>
      </header>
      <p>${escapeHtml(demoteMailDisplayText(provider.summary))}</p>
      <div class="extensions-provider-card-meta">
        <span>${escapeHtml(extensionCategoryById(provider.category)?.label || provider.category)}</span>
        <em>${escapeHtml(label(provider.status))}</em>
        ${install ? '<span class="extensions-install-badge">Preview added</span>' : ''}
      </div>
    </button>
  `;
}

function renderExtensionsProviderCatalog() {
  const providers = filteredExtensionProviders();
  const category = state.extensions.categoryFilter || 'all';
  if (!providers.length) {
    return '<p class="form-hint">No extensions match the current filters.</p>';
  }
  if (category === 'all') {
    return EXTENSION_CATEGORY_CATALOG.map((cat) => {
      const inCategory = providers.filter((entry) => entry.category === cat.id);
      if (!inCategory.length) return '';
      return `
        <section class="extensions-category-section" aria-label="${escapeHtml(cat.label)}">
          <header class="extensions-category-head">
            <h3>${escapeHtml(cat.label)}</h3>
            <p>${escapeHtml(cat.summary)}</p>
          </header>
          <div class="extensions-provider-grid">${inCategory.map(renderExtensionProviderCard).join('')}</div>
        </section>
      `;
    }).join('');
  }
  return `<div class="extensions-provider-grid">${providers.map(renderExtensionProviderCard).join('')}</div>`;
}

function renderExtensionProviderDetail(provider) {
  const install = installForProvider(provider.id);
  const expectedReceipts = extensionExpectedReceipts(provider);
  const boundaryItems = extensionSecretBoundaryItems();
  return `
    <section class="lane-reading-pane" aria-label="Extension details">
      <header class="lane-reading-head">
        <div>
          <h3>${escapeHtml(provider.name)}</h3>
          <p class="lane-reading-meta">${escapeHtml(extensionMarkerLabel(provider.marker))} · ${escapeHtml(label(provider.status))}${install ? ' · preview added locally' : ''}</p>
        </div>
      </header>
      <dl class="extensions-detail-grid">
        <div><dt>Category</dt><dd>${escapeHtml(extensionCategoryById(provider.category)?.label || provider.category)}</dd></div>
        <div><dt>What it does</dt><dd>${escapeHtml(provider.summary)}</dd></div>
        <div><dt>Why it matters</dt><dd>${escapeHtml(provider.whyItMatters)}</dd></div>
        <div><dt>Permissions required</dt><dd>${escapeHtml(provider.permissions)}</dd></div>
        <div><dt>Data touched</dt><dd>${escapeHtml(provider.dataTouched)}</dd></div>
        <div><dt>Current gate</dt><dd>${escapeHtml(provider.currentGate)}</dd></div>
        <div><dt>Allowed now (preview)</dt><dd>${escapeHtml(provider.allowedPreviewAction)}</dd></div>
        <div><dt>Blocked runtime</dt><dd>${escapeHtml(provider.blockedRuntimeAction)}</dd></div>
        <div><dt>Related areas</dt><dd>${escapeHtml((provider.relatedAreas || []).join(' · '))}</dd></div>
      </dl>
      ${provider.adapterNote ? `<p class="form-hint extensions-adapter-note">${escapeHtml(provider.adapterNote)}</p>` : ''}
      ${provider.requiresOAuth ? '<p class="form-hint">Requires OAuth when enabled — tokens never stored in product UI.</p>' : ''}
      <div class="inbox-action-toolbar">
        ${install
    ? `<button class="inbox-action-btn" type="button" data-extensions-action="select-install" data-install-id="${escapeHtml(install.id)}">View install notes</button>`
    : `<button class="inbox-action-btn is-primary" type="button" data-extensions-action="preview-install" data-provider-id="${escapeHtml(provider.id)}">Add preview install</button>`}
        <button class="inbox-action-btn is-blocked" type="button" disabled title="${escapeHtml(provider.blockedRuntimeAction)}">Connect blocked</button>
        <button class="inbox-action-btn is-blocked" type="button" disabled>Run blocked</button>
        <button class="inbox-action-btn" type="button" data-extensions-action="open-activity">Open Activity</button>
      </div>
      <details class="lane-reading-details">
        <summary>Activity / receipt expectations</summary>
        <ul class="extensions-expected-receipts">
          ${expectedReceipts.map((entry) => `<li><strong>${escapeHtml(entry.title)}</strong> — ${escapeHtml(entry.summary)}</li>`).join('')}
        </ul>
      </details>
      ${boundaryItems.length ? `
        <details class="lane-reading-details">
          <summary>Secret boundary</summary>
          <ul class="extensions-boundary-list">${boundaryItems.map((item) => `
            <li><strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(item.summary)}</li>
          `).join('')}</ul>
        </details>
      ` : ''}
      ${install && (state.extensions.receipts || []).filter((r) => r.installId === install.id).length ? `
        <details class="lane-reading-details"><summary>Receipts</summary>${renderExtensionsLocalReceipts(install.id)}</details>
      ` : ''}
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
  const install = selectedExtensionInstall();
  const provider = state.extensions.selectedProviderId
    ? extensionProviderById(state.extensions.selectedProviderId)
    : allExtensionProviders().find((entry) => entry.focusId === state.focusId);
  if (install && state.focusId === `extensions:local:${install.id}`) {
    const linkedProvider = install.providerId ? extensionProviderById(install.providerId) : null;
    return `
      <section class="lane-reading-pane" aria-label="Install details">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(install.label)}</h3>
            <p class="lane-reading-meta">Preview added locally · not connected${linkedProvider ? ` · ${label(linkedProvider.status)}` : ''}</p>
          </div>
        </header>
        <p><strong>Permissions:</strong> ${escapeHtml(install.permissions || 'Not set')}</p>
        ${install.provisionNotes ? `<p><strong>Notes:</strong> ${escapeHtml(install.provisionNotes)}</p>` : ''}
        <p class="form-hint">Install records planning intent only. OAuth, credentials, and provider runtime remain blocked.</p>
        <div class="inbox-action-toolbar">
          <button class="inbox-action-btn is-primary" type="button" data-extensions-action="edit-provision" data-install-id="${escapeHtml(install.id)}">Edit notes</button>
          <button class="inbox-action-btn" type="button" data-extensions-action="remove-install" data-install-id="${escapeHtml(install.id)}">Remove</button>
          <button class="inbox-action-btn is-blocked" type="button" disabled>Connect blocked</button>
          <button class="inbox-action-btn" type="button" data-extensions-action="open-activity">Open Activity</button>
        </div>
        ${(state.extensions.receipts || []).filter((r) => r.installId === install.id).length ? `
          <details class="lane-reading-details"><summary>Receipts</summary>${renderExtensionsLocalReceipts(install.id)}</details>
        ` : ''}
      </section>
    `;
  }
  if (provider) {
    return renderExtensionProviderDetail(provider);
  }
  return `<section class="lane-reading-pane is-empty" aria-label="Integration details"><p class="lane-empty-state">Select an extension or provider to view gates, permissions, and blocked actions.</p></section>`;
}

function renderExtensionsWorkspace() {
  return `
    <div class="lane-workspace extensions-workspace">
      ${renderExtensionsTaxonomyBanner()}
      <div class="lane-toolbar" role="toolbar" aria-label="Extensions actions">
        <div id="extensionsStatusRegion" class="inbox-status-region is-compact" role="status" aria-live="polite">${escapeHtml(state.statusMessage && state.laneId === 'extensions' ? state.statusMessage : '')}</div>
        <details class="lane-toolbar-overflow">
          <summary>More</summary>
          <button class="inbox-action-btn is-danger" type="button" data-extensions-action="clear-all">Clear local extensions state</button>
        </details>
      </div>
      ${renderExtensionsFilterBar()}
      <div class="extensions-workspace-layout">
        <div class="extensions-catalog-pane" aria-label="Extension catalog">
          ${renderExtensionsProviderCatalog()}
        </div>
        <div class="extensions-detail-pane">
          ${renderExtensionsReadingPane()}
        </div>
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

function renderEmailAccountsBlock() {
  const accounts = allPreviewAccounts();
  const activeAccount = selectedAccountFixture();
  const activeAccountId = activeAccount?.accountId || '';
  return `
    <div class="settings-accounts-block">
      <div class="inbox-form-actions">
        <h3>Email accounts (${accounts.length})</h3>
        <button class="inbox-action-btn is-primary" type="button" data-account-action="add-account">Add Gmail account</button>
      </div>
      ${state.account.accountFormOpen ? `
        <form class="inbox-draft-form" data-account-form="connect" aria-label="Add Gmail account">
          <label for="settings-account-email-input">Gmail address</label>
          <input id="settings-account-email-input" name="email" type="email" required autocomplete="email" placeholder="you@gmail.com" />
          <p class="form-hint">Connect uses the local metadata adapter (GMAIL-001C). Tokens stay in tools/gmail/data/ — never in this browser preview.</p>
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
    </div>
  `;
}

function renderUserPreferencesPane() {
  const prefs = state.settings.userPrefs || defaultSettingsOps().userPrefs;
  return `
    <section class="lane-reading-pane" aria-label="User preferences">
      <header class="lane-reading-head">
        <div>
          <h3>Preferences</h3>
          <p class="lane-reading-meta">Display and notification choices · saved locally in preview</p>
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

function renderUserAccountsPane() {
  return `
    <section class="lane-reading-pane" aria-label="Email accounts">
      <header class="lane-reading-head">
        <div>
          <h3>Email accounts</h3>
          <p class="lane-reading-meta">Add Gmail, then finish connect in the local CLI · metadata only</p>
        </div>
      </header>
      ${renderEmailAccountsBlock()}
      <details class="lane-reading-details settings-advanced-hint">
        <summary>How Gmail connect works (advanced)</summary>
        <pre class="settings-cli-hint">${escapeHtml(gmailConnectInstructions())}</pre>
        <p class="form-hint">No passwords or OAuth tokens are stored in this preview. Send and message bodies remain blocked.</p>
      </details>
    </section>
  `;
}

function renderSettingsReadingPane() {
  const key = state.settings.selectedKey;
  if (key === 'user:preferences') return renderUserPreferencesPane();
  if (key === 'user:accounts') return renderUserAccountsPane();
  const gate = isSettingsGateKey(key) ? settingsGateFixtures().find((entry) => entry.gateKey === key) : null;
  const policy = !gate ? settingsPolicyFixtures().find((entry) => entry.policyKey === key) : null;
  const gateOverride = gate ? gateOverrideFor(gate.gateKey) : null;
  const policyOverride = policy ? policyOverrideFor(policy.policyKey) : null;
  if (gate) {
    return `
      <section class="lane-reading-pane" aria-label="Advanced connection control">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(gate.label)}</h3>
            <p class="lane-reading-meta">${escapeHtml(label(gate.state))} · preview only · not applied</p>
          </div>
        </header>
        <p>${escapeHtml(gate.summary)}</p>
        <p><strong>Status in preview:</strong> ${escapeHtml(gateOverride?.previewControl || gate.control)}</p>
        ${gateOverride?.notes ? `<p><strong>Your notes:</strong> ${escapeHtml(gateOverride.notes)}</p>` : ''}
        <div class="inbox-action-toolbar">
          <button class="inbox-action-btn is-primary" type="button" data-settings-action="edit-item" data-settings-key="${escapeHtml(gate.gateKey)}">Edit notes</button>
          <button class="inbox-action-btn is-blocked" type="button" disabled>Connect blocked</button>
        </div>
        <details class="lane-reading-details settings-advanced-hint">
          <summary>Technical detail (advanced)</summary>
          <p class="form-hint">Provider gate fixture · runtime connect and policy apply remain blocked in static preview.</p>
        </details>
        ${(state.settings.receipts || []).filter((r) => r.key === gate.gateKey).length ? `
          <details class="lane-reading-details"><summary>Receipts</summary>${renderSettingsLocalReceipts(gate.gateKey)}</details>
        ` : ''}
      </section>
    `;
  }
  if (policy) {
    return `
      <section class="lane-reading-pane" aria-label="Advanced privacy rule">
        <header class="lane-reading-head">
          <div>
            <h3>${escapeHtml(policy.label)}</h3>
            <p class="lane-reading-meta">${escapeHtml(label(policyOverride?.previewValue || policy.value))} · preview only</p>
          </div>
        </header>
        <p>${escapeHtml(policy.summary)}</p>
        ${policyOverride?.notes ? `<p><strong>Your notes:</strong> ${escapeHtml(policyOverride.notes)}</p>` : ''}
        <div class="inbox-action-toolbar">
          <button class="inbox-action-btn is-primary" type="button" data-settings-action="edit-item" data-settings-key="${escapeHtml(policy.policyKey)}">Edit preview value</button>
          <button class="inbox-action-btn is-blocked" type="button" disabled>Apply blocked</button>
        </div>
        <details class="lane-reading-details settings-advanced-hint">
          <summary>Technical detail (advanced)</summary>
          <p class="form-hint">Default fixture value: ${escapeHtml(policy.value)}. Runtime policy apply remains blocked.</p>
        </details>
        ${(state.settings.receipts || []).filter((r) => r.key === policy.policyKey).length ? `
          <details class="lane-reading-details"><summary>Receipts</summary>${renderSettingsLocalReceipts(policy.policyKey)}</details>
        ` : ''}
      </section>
    `;
  }
  return `<section class="lane-reading-pane is-empty" aria-label="Setting details"><p class="lane-empty-state">Select a setting from the list.</p></section>`;
}

function renderSettingsWorkspace() {
  const gates = settingsGateFixtures();
  const policies = settingsPolicyFixtures();
  const selectedKey = state.settings.selectedKey;
  const accountCount = allPreviewAccounts().length;
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
        <div class="settings-item-list" aria-label="Settings categories">
          <p class="settings-section-label">Your settings</p>
          <button class="settings-list-row ${selectedKey === 'user:preferences' ? 'is-selected' : ''}" type="button" data-settings-action="select-preferences" data-settings-key="user:preferences" data-inspector-focus="settings:local:preferences">
            <span class="settings-list-badge">prefs</span>
            <div><strong>Preferences</strong><p>Density, default mailbox, notifications</p></div>
          </button>
          <button class="settings-list-row ${selectedKey === 'user:accounts' ? 'is-selected' : ''}" type="button" data-settings-action="select-accounts" data-settings-key="user:accounts" data-inspector-focus="settings:local:accounts">
            <span class="settings-list-badge">mail</span>
            <div><strong>Email accounts</strong><p>${accountCount ? `${accountCount} queued or active` : 'Add and connect Gmail'}</p></div>
          </button>
          <details class="settings-advanced-section">
            <summary>Advanced · provider &amp; privacy (preview)</summary>
            <div class="settings-advanced-list">
              ${gates.map((gate) => `
                <button class="settings-list-row ${selectedKey === gate.gateKey ? 'is-selected' : ''}" type="button" data-settings-action="select-gate" data-settings-key="${escapeHtml(gate.gateKey)}" data-inspector-focus="${escapeHtml(`settings:local:gate:${gate.gateKey}`)}">
                  <span class="settings-list-badge">conn</span>
                  <div><strong>${escapeHtml(gate.label)}</strong><p>${escapeHtml(gate.control)}</p></div>
                </button>
              `).join('')}
              ${policies.map((policy) => `
                <button class="settings-list-row ${selectedKey === policy.policyKey ? 'is-selected' : ''}" type="button" data-settings-action="select-policy" data-settings-key="${escapeHtml(policy.policyKey)}" data-inspector-focus="${escapeHtml(`settings:local:policy:${policy.policyKey}`)}">
                  <span class="settings-list-badge">rule</span>
                  <div><strong>${escapeHtml(policy.label)}</strong><p>${escapeHtml(policy.value)}</p></div>
                </button>
              `).join('')}
            </div>
          </details>
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
  return activityPrimaryFilterMatches({ isBuildEvidence: kind === 'proof', scope: kind === 'proof' ? 'build' : 'internal', outcome: kind === 'blocked' || kind === 'gate' ? 'blocked' : 'recorded', activityType: kind }, filter);
}

function activityLedgerRows() {
  return filteredActivityEntries().map((entry) => ({
    kind: entry.activityType,
    title: entry.title,
    source: entry.sourceObject,
    state: entry.status,
    focusId: entry.focusId,
    entry,
  }));
}

function renderActivityDetailPanel(entry) {
  if (!entry) {
    return '<section class="lane-reading-pane is-empty" aria-label="Activity details"><p class="lane-empty-state">Select an activity item to see what happened, why it was blocked, and what to review next.</p></section>';
  }
  const sourceLink = entry.sourceLink;
  return `
    <section class="lane-reading-pane activity-detail-pane" aria-label="Activity details">
      <header class="lane-reading-head">
        <div>
          <h3>${escapeHtml(entry.title)}</h3>
          <p class="lane-reading-meta">${escapeHtml(activityTypeLabel(entry.activityType))} · ${escapeHtml(label(entry.outcome))} · ${escapeHtml(activityStateLabel(entry.status))}</p>
        </div>
      </header>
      <dl class="activity-detail-grid">
        <div><dt>When</dt><dd>${escapeHtml(entry.createdAt)}</dd></div>
        <div><dt>Account</dt><dd>${escapeHtml(entry.account)}</dd></div>
        <div><dt>Source object</dt><dd>${escapeHtml(entry.sourceObject)}</dd></div>
        <div><dt>Capability area</dt><dd>${escapeHtml(entry.capabilityArea)}</dd></div>
        <div><dt>Explanation</dt><dd>${escapeHtml(entry.summary)}</dd></div>
        ${entry.blockedReason ? `<div><dt>Why blocked</dt><dd>${escapeHtml(entry.blockedReason)}</dd></div>` : ''}
        <div><dt>Receipt id</dt><dd><code>${escapeHtml(entry.receiptId)}</code></dd></div>
        <div><dt>Event type</dt><dd>${escapeHtml(entry.eventType)}</dd></div>
        <div><dt>Risk level</dt><dd>${escapeHtml(entry.riskLevel)}</dd></div>
        ${entry.relatedGate ? `<div><dt>Related gate</dt><dd>${escapeHtml(entry.relatedGate)}</dd></div>` : ''}
        <div><dt>Safe next step</dt><dd>${escapeHtml(entry.safeNext)}</dd></div>
      </dl>
      <div class="inbox-action-toolbar">
        ${sourceLink ? `<button class="inbox-action-btn is-primary" type="button" data-activity-action="open-source" data-lane-id="${escapeHtml(sourceLink.lane)}" ${sourceLink.threadId ? `data-thread-id="${escapeHtml(sourceLink.threadId)}"` : ''} ${sourceLink.draftId ? `data-draft-id="${escapeHtml(sourceLink.draftId)}"` : ''} ${sourceLink.mailboxView ? `data-mailbox-view="${escapeHtml(sourceLink.mailboxView)}"` : ''} ${sourceLink.proposalId ? `data-proposal-id="${escapeHtml(sourceLink.proposalId)}"` : ''} ${sourceLink.taskId ? `data-task-id="${escapeHtml(sourceLink.taskId)}"` : ''} ${sourceLink.storyId ? `data-story-id="${escapeHtml(sourceLink.storyId)}"` : ''} ${sourceLink.ruleId ? `data-rule-id="${escapeHtml(sourceLink.ruleId)}"` : ''} ${sourceLink.providerId ? `data-provider-id="${escapeHtml(sourceLink.providerId)}"` : ''} ${sourceLink.installId ? `data-install-id="${escapeHtml(sourceLink.installId)}"` : ''} ${sourceLink.settingsKey ? `data-settings-key="${escapeHtml(sourceLink.settingsKey)}"` : ''}>${escapeHtml(sourceLink.label)}</button>` : ''}
        <button class="inbox-action-btn is-blocked" type="button" disabled title="Export requires storage gate and redaction review">Export Activity Packet (preview blocked)</button>
      </div>
      ${entry.advanced ? `
        <details class="lane-reading-details activity-advanced">
          <summary>Build evidence (developer)</summary>
          <ul class="activity-advanced-list">
            ${entry.advanced.sliceId ? `<li><strong>Slice / check:</strong> ${escapeHtml(entry.advanced.sliceId)}</li>` : ''}
            ${entry.advanced.commitSha ? `<li><strong>Commit SHA:</strong> <code>${escapeHtml(entry.advanced.commitSha)}</code></li>` : ''}
            ${entry.advanced.validation ? `<li><strong>Validation:</strong> ${escapeHtml(entry.advanced.validation)}</li>` : ''}
          </ul>
        </details>
      ` : ''}
    </section>
  `;
}

function renderActivitySecondaryFilters() {
  const a = state.activity;
  const types = [...new Set(collectUnifiedActivityEntries().map((e) => e.activityType))];
  const areas = [...new Set(collectUnifiedActivityEntries().map((e) => e.capabilityArea))];
  return `
    <div class="activity-secondary-filters" aria-label="Refine activity">
      <form class="activity-search-form" data-activity-form="search">
        <label class="visually-hidden" for="activity-search-input">Search activity</label>
        <input id="activity-search-input" class="activity-search-input" type="search" name="query" value="${escapeHtml(a.searchQuery || '')}" placeholder="Search activity" />
        ${a.searchQuery ? '<button class="inbox-action-btn" type="button" data-activity-action="clear-search">Clear</button>' : ''}
      </form>
      <label class="activity-filter-select-label">Source area
        <select data-activity-action="set-source-filter">
          <option value="all" ${a.sourceFilter === 'all' ? 'selected' : ''}>All areas</option>
          ${areas.map((area) => `<option value="${escapeHtml(area)}" ${a.sourceFilter === area ? 'selected' : ''}>${escapeHtml(area)}</option>`).join('')}
        </select>
      </label>
      <label class="activity-filter-select-label">Action type
        <select data-activity-action="set-type-filter">
          <option value="all" ${a.typeFilter === 'all' ? 'selected' : ''}>All types</option>
          ${types.map((type) => `<option value="${escapeHtml(type)}" ${a.typeFilter === type ? 'selected' : ''}>${escapeHtml(activityTypeLabel(type))}</option>`).join('')}
        </select>
      </label>
      <div class="activity-chip-row" aria-label="Scope filters">
        ${ACTIVITY_SCOPE_FILTERS.map((entry) => `
          <button class="activity-filter-btn is-compact ${a.scopeFilter === entry.id ? 'is-active' : ''}" type="button" aria-pressed="${a.scopeFilter === entry.id ? 'true' : 'false'}" data-activity-action="set-scope-filter" data-scope-filter="${escapeHtml(entry.id)}">${escapeHtml(entry.label)}</button>
        `).join('')}
      </div>
      <div class="activity-chip-row" aria-label="Outcome filters">
        ${ACTIVITY_OUTCOME_FILTERS.map((entry) => `
          <button class="activity-filter-btn is-compact ${a.outcomeFilter === entry.id ? 'is-active' : ''}" type="button" aria-pressed="${a.outcomeFilter === entry.id ? 'true' : 'false'}" data-activity-action="set-outcome-filter" data-outcome-filter="${escapeHtml(entry.id)}">${escapeHtml(entry.label)}</button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderActivityLedgerTable() {
  const rows = activityLedgerRows();
  const selected = selectedActivityEntry();
  return `
    <div class="receipt-ledger-table" role="table" aria-label="Activity feed">
      <div class="receipt-ledger-head" role="row">
        <span role="columnheader">Type</span>
        <span role="columnheader">What happened</span>
        <span role="columnheader">Source</span>
        <span role="columnheader">Outcome</span>
      </div>
      ${rows.length ? rows.map((row) => {
    const entry = row.entry;
    const focused = selected?.id === entry.id || state.focusId === row.focusId;
    return `
        <div class="receipt-ledger-row-wrap ${focused ? 'is-inspector-focused' : ''}" role="row">
          <button class="receipt-ledger-row is-inspector-focusable ${focused ? 'is-inspector-focused' : ''}" type="button" data-activity-action="select-entry" data-entry-id="${escapeHtml(entry.id)}" data-inspector-focus="${escapeHtml(row.focusId)}" aria-selected="${focused ? 'true' : 'false'}">
            <span class="receipt-kind receipt-kind-${escapeHtml(row.kind)}" role="cell">${escapeHtml(activityTypeLabel(entry.activityType))}</span>
            <strong role="cell">${escapeHtml(demoteMailDisplayText(row.title))}</strong>
            <span role="cell">${escapeHtml(demoteMailDisplayText(row.source))}</span>
            <span class="receipt-state" role="cell">${escapeHtml(label(entry.outcome))}</span>
          </button>
        </div>
      `;
  }).join('') : '<p class="lane-empty-state">No activity for this filter. Try another tab or clear filters.</p>'}
    </div>
  `;
}

function renderActivityWorkspace() {
  const filter = state.activity.filter || 'user';
  const groupsSection = sectionByType(activeLaneContent(), 'receipt-groups');
  const selected = selectedActivityEntry();
  return `
    <div class="lane-workspace activity-workspace">
      <header class="activity-page-head">
        <h3 class="activity-page-title">Activity</h3>
        <p class="activity-subtitle">Receipts and audit trail — what happened, what was proposed, what was blocked, and why.</p>
      </header>
      <div class="lane-toolbar" role="toolbar" aria-label="Activity filters">
        <div class="activity-filter-bar" role="tablist" aria-label="Primary activity filter">
          ${ACTIVITY_FILTERS.map((entry) => `
            <button class="activity-filter-btn ${filter === entry.id ? 'is-active' : ''}" type="button" role="tab" aria-selected="${filter === entry.id ? 'true' : 'false'}" data-activity-action="set-filter" data-activity-filter="${escapeHtml(entry.id)}">${escapeHtml(entry.label)}</button>
          `).join('')}
        </div>
      </div>
      ${renderActivitySecondaryFilters()}
      <div class="activity-workspace-grid">
        <div class="activity-feed-pane">${renderActivityLedgerTable()}</div>
        ${renderActivityDetailPanel(selected)}
      </div>
      ${groupsSection ? `
        <details class="lane-reading-details activity-advanced">
          <summary>Receipt classes (advanced)</summary>
          ${renderReceiptGroups(groupsSection)}
        </details>
      ` : ''}
      <p class="form-hint activity-export-hint">Export Activity Packet remains preview-only until storage, redaction, and provider gates pass. No file write or cloud upload in this build.</p>
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
      <header class="lane-header${['home', 'inbox', 'calendar', 'tasks', 'automations', 'extensions', 'settings', 'receipts'].includes(lane.id) ? ' is-compact' : ''}">
        <div>
          ${['home', 'inbox', 'calendar', 'tasks', 'automations', 'extensions', 'settings', 'receipts'].includes(lane.id) ? '' : `<p class="eyebrow">${escapeHtml(content.eyebrow || lane.id)}</p>`}
          <h2>${escapeHtml({ home: 'Home', inbox: 'Inbox', calendar: 'Calendar', tasks: 'Tasks', automations: 'Automations', extensions: 'Integrations', settings: 'Settings', receipts: 'Activity' }[lane.id] || (content.title || lane.label))}</h2>
          ${['home', 'inbox', 'calendar', 'tasks', 'automations', 'extensions', 'settings', 'receipts'].includes(lane.id) ? '' : `<p>${escapeHtml(content.summary || lane.description || '')}</p>`}
        </div>
        ${['home', 'inbox', 'calendar', 'tasks', 'automations', 'extensions', 'settings', 'receipts'].includes(lane.id) ? '' : `
        <div class="lane-status-line">
          <span>${escapeHtml(label(content.proofState || lane.status || 'preview_only'))}</span>
          <span>${escapeHtml(label(lane.status || 'preview_only'))}</span>
        </div>`}
      </header>

      ${['home', 'inbox', 'calendar', 'tasks', 'automations', 'extensions', 'settings', 'receipts'].includes(lane.id) ? '' : `
      <section class="metric-grid" aria-label="${escapeHtml(lane.label)} preview metrics">
        ${(content.metrics || content.primary || []).map(renderMetricCard).join('')}
      </section>`}

      <div class="lane-content ${escapeHtml(content.layout || `${lane.id}-layout`)}${lane.id === 'inbox' ? ' is-inbox-lane' : ''}${lane.id === 'receipts' ? ' is-receipts-lane' : ''}${lane.id === 'ibal' ? ' is-ibal-lane' : ''}${lane.id === 'settings' ? ' is-settings-lane' : ''}${lane.id === 'calendar' ? ' is-calendar-lane' : ''}${lane.id === 'tasks' ? ' is-tasks-lane' : ''}${lane.id === 'automations' ? ' is-automations-lane' : ''}${lane.id === 'extensions' ? ' is-extensions-lane' : ''}${lane.id === 'home' ? ' is-home-lane' : ''}">
        ${lane.id === 'home' ? renderHomeWorkspace() : ''}
        ${lane.id === 'inbox' ? renderInboxWorkspace() : ''}
        ${lane.id === 'calendar' ? renderCalendarWorkspace() : ''}
        ${lane.id === 'tasks' ? renderTasksWorkspace() : ''}
        ${lane.id === 'automations' ? renderAutomationsWorkspace() : ''}
        ${lane.id === 'extensions' ? renderExtensionsWorkspace() : ''}
        ${lane.id === 'settings' ? renderSettingsWorkspace() : ''}
        ${lane.id === 'receipts' ? renderActivityWorkspace() : ''}
        ${['home', 'inbox', 'calendar', 'tasks', 'automations', 'extensions', 'settings', 'receipts'].includes(lane.id) ? '' : (content.sections || []).map(renderLaneSection).join('')}
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
    const sharedRisks = sharedApprovalRisks(queued);
    const batchPreview = batchApprovalPreviewSummary(batchSelectedDrafts().length ? batchSelectedDrafts() : queued);
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
      sendConsequences: batchPreview.consequences,
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
      summary: `Unified activity feed from local receipts across Mail, Calendar, Tasks, Automations, and Integrations. ${collectUnifiedActivityEntries().length} entries visible before filters.`,
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
        <button class="inbox-action-btn is-blocked" type="button" disabled>Send blocked</button>
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
        <p class="inspector-rail-mode">${escapeHtml(inspectorRailModeLabel(railMode))}</p>
        <h2 class="inspector-selected-title">${escapeHtml(demoteMailDisplayText(inspector.title || lane.label))}</h2>
        <p class="inspector-command-hint">${escapeHtml(demoteMailDisplayText(inspector.safeNext || 'Choose an action below.'))}</p>
      </header>
      <section class="inspector-block inspector-commands">
        <h3>Actions</h3>
        ${inboxRail}
        <div class="inspector-ibal-actions">
          <button class="inbox-action-btn" type="button" data-ibal-action="toggle-open">Ask Ibal</button>
        </div>
      </section>
      ${inboxOutcomes}
      <details class="inspector-meta-collapsed">
        <summary>More context (advanced)</summary>
        ${renderInspectorBlock('Selected', demoteMailDisplayText(inspector.context || 'Nothing selected yet.'))}
        ${renderInspectorBlock('Why it matters', demoteMailDisplayText(inspector.why || 'Context helps you decide the next step.'))}
        ${renderInspectorBlock('Sources', demoteMailDisplayText(inspector.evidence || 'No linked sources.'))}
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
      <p>${escapeHtml(demoteMailDisplayText(proposal.recommendation))}</p>
      <dl class="ibal-proposal-meta">
        <div><dt>Why</dt><dd>${escapeHtml(demoteMailDisplayText(proposal.why))}</dd></div>
        <div><dt>Based on</dt><dd>${escapeHtml(demoteMailDisplayText(proposal.evidence))}</dd></div>
        <div><dt>Limits</dt><dd>${escapeHtml(demoteMailDisplayText(proposal.blockers))}</dd></div>
        <div><dt>Suggested next</dt><dd>${escapeHtml(demoteMailDisplayText(proposal.safeNext))}</dd></div>
      </dl>
      ${proposal.criteria?.length ? `<ul class="ibal-proposal-criteria">${proposal.criteria.map((item) => `<li>${escapeHtml(demoteMailDisplayText(item))}</li>`).join('')}</ul>` : ''}
      <div class="inbox-form-actions">
        <button class="inbox-action-btn is-primary" type="button" data-ibal-action="save-receipt" data-proposal-id="${escapeHtml(proposal.id)}">Save to Activity</button>
      </div>
    </article>
  `;
}

function renderAccountSessionPanel() {
  const workspaces = workspaceOptions();
  const activeAccount = selectedAccountFixture();
  const activeWorkspaceId = state.account.workspaceId || workspaces[0]?.id || '';
  return `
    <div class="account-session-root ${state.account.open ? 'is-open' : ''}" aria-hidden="${state.account.open ? 'false' : 'true'}">
      <button class="account-session-backdrop" type="button" data-account-action="close" aria-label="Close account session panel"></button>
      <aside id="accountSessionPanel" class="account-session-panel" role="dialog" aria-modal="true" aria-label="Your account" tabindex="-1">
        <header class="account-session-head">
          <div class="user-card-header">
            <span class="user-card-avatar is-large" aria-hidden="true">${escapeHtml((activeSessionDisplayName() || 'P').slice(0, 1).toUpperCase())}</span>
            <div>
              <p class="section-eyebrow">Your account</p>
              <h2>${escapeHtml(activeSessionDisplayName())}</h2>
              <p>${escapeHtml(activeAccount?.displayName || 'No email account active')}${activeAccount ? ` · ${escapeHtml(activeAccount.syncState === 'awaiting_local_connect' ? 'Awaiting connect' : label(activeAccount.syncState))}` : ''}</p>
            </div>
          </div>
          <button class="inbox-action-btn" type="button" data-account-action="close">Close</button>
        </header>
        <section class="account-switch-list" aria-label="Email accounts">
          ${renderEmailAccountsBlock()}
        </section>
        <details class="lane-reading-details account-advanced">
          <summary>Workspace and display name (advanced)</summary>
          <form class="inbox-draft-form" data-account-form="session" aria-label="Workspace preferences">
            <label for="account-workspace">Workspace</label>
            <select id="account-workspace" name="workspaceId">
              ${workspaces.map((entry) => `
                <option value="${escapeHtml(entry.id)}" ${entry.id === activeWorkspaceId ? 'selected' : ''}>${escapeHtml(entry.label)}</option>
              `).join('')}
            </select>
            <label for="account-display-name">Display name</label>
            <input id="account-display-name" name="sessionDisplayName" type="text" autocomplete="off" value="${escapeHtml(state.account.sessionDisplayName || '')}" placeholder="${escapeHtml(activeAccount?.displayName || 'Your name')}" />
            <div class="inbox-form-actions">
              <button class="inbox-action-btn is-primary" type="submit" data-account-action="session-save">Save</button>
            </div>
          </form>
        </details>
        <section class="account-receipt-list" aria-label="Account activity">
          <h3>Recent activity (${(state.account.receipts || []).length})</h3>
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
            <p class="section-eyebrow">Assistant</p>
            <h2>Ibal</h2>
            <p>Suggests next steps. Does not send mail or run automations for you.</p>
          </div>
          <button class="inbox-action-btn" type="button" data-ibal-action="close" aria-label="Close concierge">Close</button>
        </header>
        <form class="ibal-concierge-prompt" data-ibal-form="prompt" aria-label="Ask Ibal">
          <label for="ibal-prompt-input">Ask Ibal</label>
          <input id="ibal-prompt-input" name="prompt" type="text" autocomplete="off" placeholder="What should I focus on next?" value="${escapeHtml(state.ibal.prompt || '')}" />
          <button class="inbox-action-btn is-primary" type="submit" data-ibal-action="submit">Get suggestion</button>
        </form>
        <div class="ibal-message-list" aria-label="Concierge conversation">
          ${messages.length ? messages.map((message) => `
            <article class="ibal-message is-${escapeHtml(message.role)}">
              <header><strong>${message.role === 'ibal' ? 'Ibal' : 'You'}</strong><span>${escapeHtml(new Date(message.createdAt).toLocaleString())}</span></header>
              <p>${escapeHtml(demoteMailDisplayText(message.text))}</p>
              ${message.proposal ? renderIbalProposalCard(message.proposal) : ''}
            </article>
          `).join('') : '<p class="form-hint">Ask about your mail, tasks, or calendar. Ibal suggests — you decide.</p>'}
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
  if (action === 'select-accounts') {
    state.settings.selectedKey = 'user:accounts';
    state.focusId = 'settings:local:accounts';
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

function handleExtensionsAction(action, params = {}) {
  const {
    installId, fixtureId, providerId, categoryId, statusId,
  } = params;
  if (action === 'filter-category') {
    state.extensions.categoryFilter = categoryId || 'all';
    saveState();
    renderShell();
    return;
  }
  if (action === 'filter-status') {
    state.extensions.statusFilter = statusId || 'all';
    saveState();
    renderShell();
    return;
  }
  if (action === 'clear-search') {
    state.extensions.searchQuery = '';
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-provider') {
    if (!providerId) return;
    state.extensions.selectedProviderId = providerId;
    state.focusId = `extensions:provider:${providerId}`;
    const install = installForProvider(providerId);
    state.extensions.selectedInstallId = install?.id || null;
    recordExtensionGateView(providerId);
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-fixture') {
    if (!fixtureId) return;
    const fixture = extensionFixtures().find((entry) => entry.fixtureId === fixtureId);
    if (!fixture) return;
    const provider = allExtensionProviders().find((entry) => entry.fixtureLabel === fixture.label);
    if (provider) {
      handleExtensionsAction('select-provider', { providerId: provider.id });
      return;
    }
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
    previewInstallExtension(providerId, fixtureId);
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
    const install = allExtensionInstalls().find((entry) => entry.id === installId);
    if (install?.providerId) state.extensions.selectedProviderId = install.providerId;
    saveState();
    renderShell();
    return;
  }
  if (action === 'open-activity') {
    state.laneId = 'receipts';
    ensureRoute();
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

function handleAutomationsAction(action, ruleId, focusId, actionId) {
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
  if (action === 'use-template') {
    const template = automationTemplateFixtures().find((entry) => entry.focusId === focusId);
    if (!template) return;
    createRuleFromTemplate(template);
    renderShell();
    return;
  }
  if (action === 'save-as-action') {
    if (!ruleId) return;
    saveActionFromRule(ruleId);
    renderShell();
    return;
  }
  if (action === 'select-action') {
    if (!actionId) return;
    state.automations.selectedActionId = actionId;
    saveState();
    renderShell();
    return;
  }
  if (action === 'open-activity') {
    state.laneId = 'receipts';
    ensureRoute();
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

function handleTasksAction(action, params = {}) {
  const taskId = params.taskId;
  const status = params.taskStatus;
  const focusId = params.focusId;
  const storyId = params.storyId;
  const epicId = params.epicId;
  const bugId = params.bugId;
  const acId = params.acId;
  const acState = params.acState;
  const threadId = params.threadId;
  const draftId = params.draftId;
  const calendarId = params.calendarId;
  const projectId = params.projectId || params.value;
  const laneId = params.laneId;
  if (action === 'view-planning') {
    state.tasks.viewMode = 'planning';
    saveState();
    renderShell();
    return;
  }
  if (action === 'view-board') {
    state.tasks.viewMode = 'board';
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-project') {
    if (!projectId) return;
    state.projects.selectedProjectId = projectId;
    const epics = allEpics(projectId);
    state.tasks.selectedEpicId = epics[0]?.id || null;
    state.tasks.selectedStoryId = allStories(projectId, epics[0]?.id)[0]?.id || null;
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-epic') {
    if (!epicId) return;
    state.tasks.selectedEpicId = epicId;
    state.tasks.selectedStoryId = allStories(null, epicId)[0]?.id || null;
    state.tasks.selectedBugId = null;
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-story') {
    if (!storyId) return;
    state.tasks.selectedStoryId = storyId;
    state.tasks.selectedBugId = null;
    state.focusId = `tasks:story:${storyId}`;
    state.tasks.formOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-bug') {
    if (!bugId) return;
    state.tasks.selectedBugId = bugId;
    const bug = selectedBug();
    if (bug) state.tasks.selectedStoryId = bug.storyId;
    saveState();
    renderShell();
    return;
  }
  if (action === 'set-story-status') {
    changeStoryStatus(storyId, status);
    renderShell();
    return;
  }
  if (action === 'set-bug-status') {
    changeBugStatus(bugId, status);
    renderShell();
    return;
  }
  if (action === 'set-ac-state') {
    updateAcceptanceCriterion(storyId, acId, acState);
    renderShell();
    return;
  }
  if (action === 'new-bug') {
    if (storyId) state.tasks.selectedStoryId = storyId;
    state.tasks.bugFormOpen = true;
    saveState();
    renderShell();
    return;
  }
  if (action === 'close-bug-form') {
    state.tasks.bugFormOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'add-evidence') {
    addStoryEvidencePlaceholder(storyId);
    renderShell();
    return;
  }
  if (action === 'open-activity') {
    state.laneId = 'receipts';
    ensureRoute();
    saveState();
    renderShell();
    return;
  }
  if (action === 'open-source-thread') {
    if (!threadId) return;
    state.laneId = 'inbox';
    state.inbox.mailboxView = 'inbox';
    ensureRoute();
    selectInboxThread(threadId);
    return;
  }
  if (action === 'open-source-draft') {
    if (!draftId) return;
    state.laneId = 'inbox';
    state.inbox.mailboxView = 'drafts';
    state.drafts.selectedDraftId = draftId;
    state.focusId = `inbox-draft:${draftId}`;
    ensureRoute();
    saveState();
    renderShell();
    return;
  }
  if (action === 'open-source-calendar') {
    if (!calendarId) return;
    state.laneId = 'calendar';
    state.calendar.selectedProposalId = calendarId;
    state.focusId = `calendar:local:${calendarId}`;
    ensureRoute();
    saveState();
    renderShell();
    return;
  }
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
    const lane = laneId || focusId;
    const thread = threadId || status;
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

function handleHomeAction(action, laneId, threadId, mailboxView, settingsKey, draftId) {
  if (action === 'open-thread' && threadId) {
    openActivitySource({ lane: 'inbox', threadId, label: 'Open in Mail' });
    return;
  }
  if (action === 'open-mailbox' && laneId && mailboxView) {
    state.laneId = laneId;
    state.inbox.mailboxView = mailboxView;
    state.threadId = null;
    state.focusId = defaultFocusIdForLane(laneId);
    if (draftId) {
      state.drafts.selectedDraftId = draftId;
      state.focusId = `inbox-draft:${draftId}`;
    }
    window.location.hash = `${ROUTE_PREFIX}${laneId}`;
    saveState();
    renderShell();
    return;
  }
  if (action === 'open-lane' && laneId) {
    state.laneId = laneId;
    if (settingsKey) {
      state.settings.selectedKey = settingsKey;
      state.focusId = settingsKey === 'user:accounts' ? 'settings:local:accounts' : defaultFocusIdForLane(laneId);
    } else {
      state.focusId = defaultFocusIdForLane(laneId);
    }
    window.location.hash = `${ROUTE_PREFIX}${laneId}`;
    saveState();
    renderShell();
  }
}

function handleActivityAction(action, params = {}) {
  const {
    activityFilter: filterId,
    entryId,
    laneId,
    threadId,
    mailboxView,
    draftId,
    proposalId,
    taskId,
    storyId,
    ruleId,
    providerId,
    installId,
    settingsKey,
    scopeFilter,
    outcomeFilter,
    sourceFilter,
    typeFilter,
  } = params;
  if (action === 'set-filter' && filterId) {
    state.activity.filter = filterId;
    saveState();
    renderShell();
    return;
  }
  if (action === 'set-scope-filter') {
    state.activity.scopeFilter = scopeFilter || 'all';
    saveState();
    renderShell();
    return;
  }
  if (action === 'set-outcome-filter') {
    state.activity.outcomeFilter = outcomeFilter || 'all';
    saveState();
    renderShell();
    return;
  }
  if (action === 'set-source-filter') {
    state.activity.sourceFilter = sourceFilter || 'all';
    saveState();
    renderShell();
    return;
  }
  if (action === 'set-type-filter') {
    state.activity.typeFilter = typeFilter || 'all';
    saveState();
    renderShell();
    return;
  }
  if (action === 'clear-search') {
    state.activity.searchQuery = '';
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-entry' && entryId) {
    state.activity.selectedEntryId = entryId;
    const entry = collectUnifiedActivityEntries().find((item) => item.id === entryId);
    if (entry) state.focusId = entry.focusId;
    saveState();
    renderShell();
    return;
  }
  if (action === 'open-source') {
    openActivitySource({
      lane: laneId || 'inbox',
      threadId: threadId || null,
      mailboxView: mailboxView || null,
      draftId: draftId || null,
      proposalId: proposalId || null,
      taskId: taskId || null,
      storyId: storyId || null,
      ruleId: ruleId || null,
      providerId: providerId || null,
      installId: installId || null,
      settingsKey: settingsKey || null,
      label: 'Open',
    });
  }
}

function handleCalendarAction(action, proposalId, focusId, shiftYear, shiftMonth, shiftDay, threadId, draftId) {
  if (action === 'shift-to-day' && shiftYear && shiftMonth && shiftDay) {
    state.calendar.viewMonth = `${shiftYear}-${String(shiftMonth).padStart(2, '0')}`;
    state.calendar.selectedDay = Number(shiftDay);
    saveState();
    renderShell();
    return;
  }
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
    const proposal = allCalendarProposals().find((entry) => entry.id === proposalId);
    const { year, month } = calendarViewMonthParts();
    const day = proposal ? proposalGridDay(proposal, year, month) : null;
    state.calendar.selectedProposalId = proposalId;
    state.focusId = `calendar:local:${proposalId}`;
    if (day) state.calendar.selectedDay = day;
    state.calendar.formOpen = false;
    saveState();
    renderShell();
    return;
  }
  if (action === 'mark-reviewed') {
    markCalendarProposalReviewed(proposalId);
    renderShell();
    return;
  }
  if (action === 'add-reminder') {
    createCalendarReminderProposal(proposalId);
    renderShell();
    return;
  }
  if (action === 'open-activity') {
    state.laneId = 'receipts';
    ensureRoute();
    saveState();
    renderShell();
    return;
  }
  if (action === 'open-source-thread') {
    if (!threadId) return;
    state.laneId = 'inbox';
    state.inbox.mailboxView = 'inbox';
    state.inbox.labelFilter = null;
    state.inbox.folderFilter = null;
    ensureRoute();
    selectInboxThread(threadId);
    return;
  }
  if (action === 'open-source-draft') {
    if (!draftId) return;
    state.laneId = 'inbox';
    state.inbox.mailboxView = 'drafts';
    state.drafts.selectedDraftId = draftId;
    state.focusId = `inbox-draft:${draftId}`;
    ensureRoute();
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

function handleInboxAction(action, threadId, mailboxView, draftId, filterId) {
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
    state.inbox.labelFilter = null;
    state.inbox.folderFilter = null;
    if (mailboxView !== 'inbox') state.inbox.accountFilter = null;
    syncMailboxThreadSelection();
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-label-filter') {
    if (!filterId) return;
    state.inbox.labelFilter = state.inbox.labelFilter === filterId ? null : filterId;
    state.inbox.mailboxView = 'inbox';
    state.inbox.folderFilter = null;
    syncMailboxThreadSelection();
    saveState();
    renderShell();
    return;
  }
  if (action === 'select-folder-filter') {
    if (!filterId) return;
    state.inbox.folderFilter = state.inbox.folderFilter === filterId ? null : filterId;
    state.inbox.mailboxView = 'inbox';
    state.inbox.labelFilter = null;
    syncMailboxThreadSelection();
    saveState();
    renderShell();
    return;
  }
  if (action === 'clear-mail-search') {
    state.inbox.mailSearchQuery = '';
    syncMailboxThreadSelection();
    saveState();
    renderShell();
    return;
  }
  if (action === 'open-activity') {
    state.laneId = 'receipts';
    ensureRoute();
    saveState();
    renderShell();
    return;
  }
  if (action === 'draft-open-source') {
    if (!threadId) return;
    state.inbox.mailboxView = 'inbox';
    state.inbox.labelFilter = null;
    state.inbox.folderFilter = null;
    selectInboxThread(threadId);
    return;
  }
  if (action === 'draft-batch-toggle') {
    if (!draftId) return;
    toggleDraftBatchSelection(draftId);
    renderShell();
    return;
  }
  if (action === 'draft-batch-select-all') {
    state.drafts.batchSelectedIds = queuedDrafts().map((draft) => draft.id);
    saveState();
    renderShell();
    return;
  }
  if (action === 'draft-batch-clear') {
    state.drafts.batchSelectedIds = [];
    saveState();
    renderShell();
    return;
  }
  if (action === 'draft-batch-approve-selected') {
    if (window.confirm('Approve selected queued drafts locally? Send remains blocked in Tier 1.')) {
      approveSelectedBatchDrafts();
      renderShell();
    }
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
      if (extensionsForm.dataset.extensionsForm === 'search') {
        state.extensions.searchQuery = String(formData.get('query') || '').trim();
        saveState();
        renderShell();
        return;
      }
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
      if (tasksForm.dataset.tasksForm === 'bug') {
        createBugFromStory(formData, String(formData.get('storyId') || '').trim());
      } else {
        const taskId = String(formData.get('taskId') || '').trim() || null;
        saveLocalTask(formData, taskId);
      }
      renderShell();
      return;
    }

    const activityForm = event.target.closest?.('[data-activity-form]');
    if (activityForm) {
      event.preventDefault();
      const formData = new FormData(activityForm);
      state.activity.searchQuery = String(formData.get('query') || '').trim();
      saveState();
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
    if (form.dataset.inboxForm === 'mail-search') {
      state.inbox.mailSearchQuery = String(formData.get('query') || '').trim();
      syncMailboxThreadSelection();
      saveState();
      setStatusMessage(state.inbox.mailSearchQuery ? `Showing matches for “${state.inbox.mailSearchQuery}”.` : 'Search cleared.');
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
      handleExtensionsAction(extensionsAction.dataset.extensionsAction, extensionsAction.dataset);
      return;
    }

    const automationsAction = event.target.closest?.('[data-automations-action]');
    if (automationsAction?.dataset.automationsAction && automationsAction.dataset.automationsAction !== 'rule-save') {
      event.preventDefault();
      handleAutomationsAction(
        automationsAction.dataset.automationsAction,
        automationsAction.dataset.ruleId,
        automationsAction.dataset.focusId,
        automationsAction.dataset.actionId,
      );
      return;
    }

    const tasksAction = event.target.closest?.('[data-tasks-action]');
    if (tasksAction?.dataset.tasksAction && !['task-save', 'bug-save'].includes(tasksAction.dataset.tasksAction)) {
      event.preventDefault();
      handleTasksAction(tasksAction.dataset.tasksAction, tasksAction.dataset);
      return;
    }

    const homeAction = event.target.closest?.('[data-home-action]');
    if (homeAction?.dataset.homeAction) {
      event.preventDefault();
      handleHomeAction(
        homeAction.dataset.homeAction,
        homeAction.dataset.laneId,
        homeAction.dataset.threadId,
        homeAction.dataset.mailboxView,
        homeAction.dataset.settingsKey,
        homeAction.dataset.draftId,
      );
      return;
    }

    const activityAction = event.target.closest?.('[data-activity-action]');
    if (activityAction?.dataset.activityAction) {
      event.preventDefault();
      handleActivityAction(activityAction.dataset.activityAction, activityAction.dataset);
      return;
    }

    const calendarAction = event.target.closest?.('[data-calendar-action]');
    if (calendarAction?.dataset.calendarAction && calendarAction.dataset.calendarAction !== 'proposal-save') {
      event.preventDefault();
      handleCalendarAction(
        calendarAction.dataset.calendarAction,
        calendarAction.dataset.proposalId,
        calendarAction.dataset.focusId || calendarAction.dataset.day,
        calendarAction.dataset.shiftYear,
        calendarAction.dataset.shiftMonth,
        calendarAction.dataset.shiftDay,
        calendarAction.dataset.threadId,
        calendarAction.dataset.draftId,
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
        inboxAction.dataset.labelId || inboxAction.dataset.folderId,
      );
      return;
    }

    const draftRow = event.target.closest?.('[data-draft-id]');
    if (draftRow?.dataset.draftId && !event.target.closest?.('[data-inbox-action]')) {
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

  document.addEventListener('change', (event) => {
    if (event.target?.id === 'tasks-project-picker') {
      handleTasksAction('select-project', { projectId: event.target.value });
      return;
    }
    const activitySelect = event.target.closest?.('[data-activity-action]');
    if (activitySelect?.dataset.activityAction === 'set-source-filter') {
      handleActivityAction('set-source-filter', { sourceFilter: activitySelect.value });
      return;
    }
    if (activitySelect?.dataset.activityAction === 'set-type-filter') {
      handleActivityAction('set-type-filter', { typeFilter: activitySelect.value });
    }
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
