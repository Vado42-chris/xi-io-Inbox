export function buildSystemPrompt() {
  return [
    'You are an independent peer reviewer for the xi-io Inbox product repository.',
    'Review only the supplied slice scope. Do not invent PASS for live OAuth proof, UI-003E, or PR merge readiness.',
    'AI proposes; it must not claim send/delete/provider mutation capabilities were added.',
    'Never include secrets, API keys, tokens, or real private mail bodies in the receipt.',
    'Output must be valid Markdown matching the xi-io peer review receipt shape exactly.',
    'For each review section, use **Pass**, **Partial**, or **Fail** with bullet evidence.',
    'If no blocking findings, say "None." under Blocking findings.',
    'End with a fenced decision value block containing exactly one decision token from the profile.',
  ].join('\n');
}

export function buildUserPrompt({
  profile,
  gitContext,
  fileBundleText,
  diffText,
  customTitle,
}) {
  const title = customTitle || profile.title;
  const sections = profile.reviewSections
    .map((section) => `- ${section.heading}: ${section.focus}`)
    .join('\n');

  const filesTable = (profile.files.length ? profile.files : [{ path: '(see attached bundle)', focus: 'operator supplied' }])
    .map((file) => `| ${file.path} | ${file.focus || ''} |`)
    .join('\n');

  return [
    `# Peer review task: ${title}`,
    '',
    '## Repository context',
    `- Branch: \`${gitContext.branch}\``,
    `- Reviewed commit SHA: \`${gitContext.head}\``,
    `- Working tree: ${gitContext.status}`,
    '',
    '## Slice scope',
    profile.implementationReceipt
      ? `Implementation receipt: \`${profile.implementationReceipt}\``
      : 'Implementation receipt: operator supplied / generic profile',
    profile.boundaryDoc ? `Boundary doc: \`${profile.boundaryDoc}\`` : '',
    `Prior decision token: \`${profile.priorDecisionToken}\``,
    '',
    '## Excluded scope (do not review as in-scope work)',
    ...profile.excludedScope.map((item) => `- ${item}`),
    '',
    '## Files reviewed',
    '| File | Focus |',
    '| --- | --- |',
    filesTable,
    '',
    '## Required review sections',
    sections,
    '',
    '## Suggested validation commands (operator should run before finalizing receipt)',
    ...profile.checks.map((cmd) => `- \`${cmd}\``),
    '',
    '## Decision tokens',
    `- PASS: \`${profile.passDecisionToken}\``,
    `- PARTIAL: \`${profile.partialDecisionToken}\``,
    '',
    '## Output contract',
    'Produce a complete peer review receipt Markdown document with these headings in order:',
    '1. Title (# SLICE-ID — Peer Review)',
    '2. Date (YYYY-MM-DD)',
    '3. Branch',
    '4. Reviewed commit SHA',
    '5. Scope',
    '6. Excluded scope',
    '7. Files reviewed (table)',
    '8. One section per required review heading listed above',
    '9. Validation result (table with suggested checks — mark as "Not run by reviewer" unless evidence supplied)',
    '10. Blocking findings',
    '11. Non-blocking findings',
    '12. Next recommended pass',
    '13. Decision value (fenced code block with exactly one token)',
    '',
    'Add a final line:',
    '`Reviewer: Ollama governance peer review (draft — human/agent must validate before commit)`',
    '',
    '## Git diff (listed files)',
    '```diff',
    diffText,
    '```',
    '',
    '## File contents',
    fileBundleText,
  ].filter(Boolean).join('\n');
}
