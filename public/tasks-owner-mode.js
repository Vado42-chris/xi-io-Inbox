/**
 * FIX-BATCH-006 Tasks owner-mode overlay.
 *
 * Patches only the rendered Tasks workspace. Owner mode makes Tasks a personal
 * task surface first and moves PM/backlog scaffold to Advanced. Scaffold mode
 * remains recoverable through showWorkflowScaffold.
 */
const OWNER_TASKS_UX = true;
const TASKS_OWNER_PATCH_ATTR = 'data-owner-tasks-patched';

function tasksScaffoldEnabled() {
  try {
    const raw = window.localStorage.getItem('xiioInbox.preview.state');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.settings?.userPrefs?.showWorkflowScaffold === true;
  } catch {
    return false;
  }
}

function tasksOwnerText(root, selector) {
  return root.querySelector(selector)?.textContent?.trim() || '';
}

function tasksOwnerVisiblePersonalTasks(root) {
  return Array.from(root.querySelectorAll('[data-tasks-action="select-task"]')).map((button) => ({
    title: tasksOwnerText(button, 'strong') || button.textContent.trim() || 'Untitled task',
    summary: tasksOwnerText(button, 'p') || '',
    taskId: button.getAttribute('data-task-id') || '',
  })).filter((item) => item.taskId);
}

function tasksOwnerStatusCard(root) {
  const personalTasks = tasksOwnerVisiblePersonalTasks(root).length;
  const storyCount = root.querySelectorAll('.tasks-story-row, [data-tasks-action="select-story"]').length;
  const bugCount = root.querySelectorAll('[data-tasks-action="select-bug"]').length;
  return `
    <section class="tasks-owner-status-card" aria-label="Tasks status">
      <div>
        <p class="tasks-owner-eyebrow">Owner tasks</p>
        <h3>Personal tasks first, backlog detail only when needed</h3>
        <p>This view is for the things you need to do. Epics, stories, bugs, acceptance criteria, evidence, and provider sync stay behind Advanced or scaffold mode.</p>
      </div>
      <dl class="tasks-owner-status-grid" aria-label="Tasks preview summary">
        <div><dt>Personal tasks</dt><dd>${personalTasks}</dd></div>
        <div><dt>Backlog items</dt><dd>${storyCount}</dd></div>
        <div><dt>Bugs</dt><dd>${bugCount}</dd></div>
      </dl>
    </section>
  `;
}

function tasksOwnerSimpleList(root) {
  const tasks = tasksOwnerVisiblePersonalTasks(root);
  if (!tasks.length) {
    return `
      <section class="tasks-owner-list-card" aria-label="Personal task list">
        <header>
          <h3>Your tasks</h3>
          <span class="thread-status-chip is-neutral">owner mode</span>
        </header>
        <p class="lane-empty-state">No personal tasks are visible yet. Create a task, or open Advanced to review backlog, stories, bugs, and evidence scaffolding.</p>
        <div class="tasks-owner-actions" role="toolbar" aria-label="Task actions">
          <button class="inbox-action-btn is-primary" type="button" data-tasks-action="new-task">New task</button>
        </div>
      </section>
    `;
  }
  return `
    <section class="tasks-owner-list-card" aria-label="Personal task list">
      <header>
        <h3>Your tasks</h3>
        <span class="thread-status-chip is-neutral">${tasks.length} task${tasks.length === 1 ? '' : 's'}</span>
      </header>
      <div class="tasks-owner-simple-list">
        ${tasks.map((task) => `
          <button class="tasks-owner-simple-row" type="button" data-tasks-action="select-task" data-task-id="${task.taskId}">
            <strong>${task.title}</strong>
            ${task.summary ? `<p>${task.summary}</p>` : ''}
          </button>
        `).join('')}
      </div>
      <div class="tasks-owner-actions" role="toolbar" aria-label="Task actions">
        <button class="inbox-action-btn is-primary" type="button" data-tasks-action="new-task">New task</button>
      </div>
    </section>
  `;
}

function tasksOwnerSetupCard(root) {
  const provider = tasksOwnerText(root, '.tasks-provider-banner strong') || 'External task sync locked';
  return `
    <aside class="tasks-owner-setup-card" role="note" aria-label="Task provider status">
      <strong>${provider}</strong>
      <p>Tasks save locally in this preview. External trackers, evidence upload, and provider task sync stay blocked.</p>
    </aside>
  `;
}

function moveTasksAdvanced(root) {
  if (root.querySelector('.tasks-owner-advanced')) return;

  const provider = root.querySelector('.tasks-provider-banner');
  const project = root.querySelector('.tasks-project-select');
  const toggle = root.querySelector('.tasks-view-toggle');
  const grid = root.querySelector('.tasks-workspace-grid');
  const toolbarOverflow = root.querySelector('.lane-toolbar-overflow');

  const advanced = document.createElement('details');
  advanced.className = 'tasks-owner-advanced';
  advanced.innerHTML = '<summary>Advanced task planning details</summary><div class="tasks-owner-advanced-body"></div>';
  const body = advanced.querySelector('.tasks-owner-advanced-body');

  if (project) body.appendChild(project);
  if (toggle) body.appendChild(toggle);
  if (grid) body.appendChild(grid);
  if (provider) {
    root.insertAdjacentHTML('afterbegin', tasksOwnerSetupCard(root));
    body.appendChild(provider);
  }
  if (toolbarOverflow) body.appendChild(toolbarOverflow);

  const toolbar = root.querySelector('.lane-toolbar');
  if (toolbar) toolbar.insertAdjacentElement('afterend', advanced);
  else root.appendChild(advanced);
}

function patchTasksWorkspace() {
  if (!OWNER_TASKS_UX || tasksScaffoldEnabled()) return;
  const tasks = document.querySelector('.tasks-workspace');
  if (!tasks || tasks.getAttribute(TASKS_OWNER_PATCH_ATTR) === 'true') return;

  tasks.setAttribute(TASKS_OWNER_PATCH_ATTR, 'true');
  tasks.classList.add('owner-tasks-workspace');

  const toolbar = tasks.querySelector('.lane-toolbar');
  if (toolbar) {
    toolbar.classList.add('tasks-owner-toolbar');
    const newTask = toolbar.querySelector('[data-tasks-action="new-task"]');
    if (newTask) newTask.textContent = 'New task';
  }

  const toolbarTarget = tasks.querySelector('.lane-toolbar') || tasks;
  toolbarTarget.insertAdjacentHTML('afterend', tasksOwnerSimpleList(tasks));
  toolbarTarget.insertAdjacentHTML('afterend', tasksOwnerStatusCard(tasks));

  moveTasksAdvanced(tasks);
}

const tasksOwnerObserver = new MutationObserver(() => patchTasksWorkspace());

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', patchTasksWorkspace, { once: true });
} else {
  patchTasksWorkspace();
}

tasksOwnerObserver.observe(document.body, { childList: true, subtree: true });
