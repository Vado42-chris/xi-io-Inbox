/**
 * FIX-BATCH-004 Ibal drawer owner-mode overlay.
 *
 * Patches rendered Ibal concierge DOM only. No provider/runtime changes.
 */
const OWNER_IBAL_UX = true;
const IBAL_OWNER_PATCH_ATTR = 'data-owner-ibal-patched';
const PREVIEW_STORAGE_KEY = 'xiioInbox.preview.state';

function ownerIbalUxEnabled() {
  if (!OWNER_IBAL_UX) return false;
  try {
    const stored = JSON.parse(localStorage.getItem(PREVIEW_STORAGE_KEY) || 'null');
    return stored?.settings?.userPrefs?.showWorkflowScaffold !== true;
  } catch {
    return true;
  }
}

function ownerMailContextCopy(originalText) {
  const threadMatch = String(originalText || '').match(/· ([^·]+)\. Imported/i);
  const threadTitle = threadMatch?.[1]?.trim() || 'your current screen';
  return `Looking at ${threadTitle}. Suggestions only — Ibal cannot send mail or change accounts for you.`;
}

function proposalTitleFromCard(card) {
  return card?.querySelector('header strong')?.textContent?.trim() || '';
}

function dedupeSelectedProposal(drawer) {
  const selectedSection = drawer.querySelector('.ibal-selected-proposal');
  if (!selectedSection) return;

  const selectedTitle = proposalTitleFromCard(selectedSection.querySelector('.ibal-proposal-card'));
  if (!selectedTitle) return;

  const duplicateInChat = Array.from(drawer.querySelectorAll('.ibal-message-list .ibal-proposal-card'))
    .some((card) => proposalTitleFromCard(card) === selectedTitle);

  selectedSection.hidden = duplicateInChat;
  selectedSection.classList.toggle('is-owner-hidden-duplicate', duplicateInChat);
}

function wrapIbalAdvanced(drawer) {
  const receipts = drawer.querySelector('.ibal-receipt-list');
  const clearControl = drawer.querySelector('.ibal-clear-control');
  if (!receipts || drawer.querySelector('.ibal-owner-advanced')) return;

  const advanced = document.createElement('details');
  advanced.className = 'lane-reading-details ibal-owner-advanced';
  advanced.innerHTML = '<summary>Advanced</summary>';

  const body = document.createElement('div');
  body.className = 'ibal-owner-advanced-body';
  body.append(receipts);
  if (clearControl) body.append(clearControl);
  advanced.append(body);

  drawer.append(advanced);
}

function syncIbalOwnerChrome() {
  if (!ownerIbalUxEnabled()) {
    document.body.classList.remove('is-ibal-drawer-open');
    return;
  }

  const root = document.querySelector('.ibal-concierge-root');
  document.body.classList.toggle('is-ibal-drawer-open', Boolean(root?.classList.contains('is-open')));

  const drawer = document.getElementById('ibalConciergeDrawer');
  if (drawer?.classList.contains('is-owner-ibal-drawer')) {
    dedupeSelectedProposal(drawer);
  }
}

function patchIbalDrawer() {
  syncIbalOwnerChrome();
  if (!ownerIbalUxEnabled()) return;

  const drawer = document.getElementById('ibalConciergeDrawer');
  if (!drawer || drawer.getAttribute(IBAL_OWNER_PATCH_ATTR) === 'true') return;

  drawer.setAttribute(IBAL_OWNER_PATCH_ATTR, 'true');
  drawer.classList.add('is-owner-ibal-drawer');

  const contextHint = drawer.querySelector('.ibal-concierge-head .form-hint');
  if (contextHint) {
    contextHint.textContent = ownerMailContextCopy(contextHint.textContent);
    contextHint.classList.add('is-owner-mail-context');
  }

  drawer.querySelectorAll('.ibal-proposal-card .ibal-proposal-meta, .ibal-proposal-card .ibal-proposal-criteria')
    .forEach((node) => {
      node.classList.add('is-owner-collapsed-meta');
    });

  dedupeSelectedProposal(drawer);
  wrapIbalAdvanced(drawer);
}

const observer = new MutationObserver(() => patchIbalDrawer());

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', patchIbalDrawer, { once: true });
} else {
  patchIbalDrawer();
}

observer.observe(document.body, { childList: true, subtree: true });
