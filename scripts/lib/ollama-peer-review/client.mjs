function normalizeHost(host) {
  return host.replace(/\/+$/, '');
}

export async function chatCompletion({
  host,
  model,
  apiKey,
  systemPrompt,
  userPrompt,
  timeoutMs = 120_000,
}) {
  const base = normalizeHost(host);
  const url = `${base}/api/chat`;
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const body = {
    model,
    stream: false,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Ollama request failed (${response.status}): ${text.slice(0, 500)}`);
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`Ollama returned non-JSON response: ${text.slice(0, 500)}`);
    }

    const content = parsed.message?.content || parsed.response || '';
    if (!content.trim()) {
      throw new Error('Ollama returned empty review content');
    }

    return {
      content: content.trim(),
      model: parsed.model || model,
      evalCount: parsed.eval_count ?? null,
      promptEvalCount: parsed.prompt_eval_count ?? null,
    };
  } finally {
    clearTimeout(timer);
  }
}
