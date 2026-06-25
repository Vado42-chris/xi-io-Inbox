/**
 * FIX-BATCH-007 Automations owner-mode overlay.
 *
 * Patches only the rendered Automations workspace. Default owner view is one calm
 * status card plus dry-run guidance; rule builder, library, templates, and receipts
 * stay behind Advanced. Scaffold mode remains recoverable via showWorkflowScaffold.
 */
const OWNER_AUTOMATIONS_UX = true;
const AUTOMATIONS_OWNER_PATCH_ATTR = 'data-owner-automations-patched';

function automationsScaffoldEnabled() {
  try {
    const raw = window.localStorage.getItem('xiioInbox.preview.state');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.settings?.userPrefs?.showWorkflowScaffold === true;
  } catch {
    return false;
  }
}

function automationsOwnerText(root, selector) {
  return root.querySelector(selector)?.textContent?.trim() || '';
}

function automationsOwnerRuleCount(root) {
  return root.querySelectorAll('[data-automations-action="select-rule"]').length;
}

function automationsOwnerDryRunHint(root) {
  const details = Array.from(root.querySelectorAll('.lane-reading-details')).find((entry) => (
    automationsOwnerText(entry, 'summary').toLowerCase().includes('dry-run')
  ));
  if (!details) return '';
  const step = details.querySelector('.dry-run-step strong, .dry-run-pipeline strong');
  return step?.textContent?.trim() || '';
}

function automationsOwnerStatusCard(root) {
  const rules = automationsOwnerRuleCount(root);
  const dryRunHint = automationsOwnerDryRunHint(root);
  return `
    <section class="automations-owner-status-card" aria-label="Automations status">
      <div>
        <p class="automations-owner-eyebrow">Owner automations</p>
        <h3>Preview only — nothing runs automatically</h3>
        <p>Automations in this build are dry-run and proposal-only. Changes outside xi-io stay blocked until you approve a later runtime gate.</p>
      </div>
      <dl class="automations-owner-status-grid" aria-label="Automations preview summary">
        <div><dt>Saved rules</dt><dd>${rules}</dd></div>
        <div><dt>Runtime</dt><dd>Blocked safely</dd></div>
        <div><dt>Last test</dt><dd>${dryRunHint || 'None yet'}</dd></div>
      </dl>
    </section>
  `;
}

function automationsOwnerDryRunCard() {
  return `
    <section class="automations-owner-dryrun-card" aria-label="Automation dry-run status">
      <header>
        <h3>Automation status</h3>
        <span class="thread-status-chip is-neutral">Preview only · blocked safely</span>
      </header>
      <p>Rules can be tested with dry-run preview locally. Provider writes, live execution, and automatic runs are not enabled in this build.</p>
      <p class="automations-owner-proof-note"><strong>Proof saved</strong> when you test a rule in Advanced. Full proof notes stay one click away under Activity.</p>
    </section>
  `;
}

function moveAutomationsAdvanced(root) {
  if (root.querySelector('.automations-owner-advanced')) return;

  const banner = root.querySelector('.automations-execution-banner');
  const toolbar = root.querySelector('.lane-toolbar');
  const grid = root.querySelector('.automations-workspace-grid');
  const compose = root.querySelector('.automations-compose-root');

  const advanced = document.createElement('details');
  advanced.className = 'automations-owner-advanced';
  advanced.innerHTML = '<summary>Advanced automation details</summary><div class="automations-owner-advanced-body"></div>';
  const body = advanced.querySelector('.automations-owner-advanced-body');

  if (banner) body.appendChild(banner);
  if (toolbar) body.appendChild(toolbar);
  if (grid) body.appendChild(grid);
  if (compose) body.appendChild(compose);

  root.appendChild(advanced);
}

function patchAutomationsWorkspace() {
  if (!OWNER_AUTOMATIONS_UX || automationsScaffoldEnabled()) return;
  const workspace = document.querySelector('.automations-workspace');
  if (!workspace || workspace.getAttribute(AUTOMATIONS_OWNER_PATCH_ATTR) === 'true') return;

  workspace.setAttribute(AUTOMATIONS_OWNER_PATCH_ATTR, 'true');
  workspace.classList.add('owner-automations-workspace');

  workspace.insertAdjacentHTML('afterbegin', automationsOwnerDryRunCard());
  workspace.insertAdjacentHTML('afterbegin', automationsOwnerStatusCard(workspace));

  moveAutomationsAdvanced(workspace);
}

const automationsOwnerObserver = new MutationObserver(() => patchAutomationsWorkspace());

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', patchAutomationsWorkspace, { once: true });
} else {
  patchAutomationsWorkspace();
}

automationsOwnerObserver.observe(document.body, { childList: true, subtree: true });
