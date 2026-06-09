import TINAAI_CONFIG from './config';

async function sendViaGrok(messages, grokApiKey) {
  const { grok, systemPrompt, maxTokens, temperature } = TINAAI_CONFIG;

  const response = await fetch(grok.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${grokApiKey}`,
    },
    body: JSON.stringify({
      model: grok.model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `Grok error ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function sendViaClaude(messages, claudeApiKey) {
  const { claude, systemPrompt, maxTokens, temperature } = TINAAI_CONFIG;

  const response = await fetch(claude.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': claudeApiKey,
      'anthropic-version': claude.version,
    },
    body: JSON.stringify({
      model: claude.model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || `Claude error ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

export async function sendMessage(messages, { grokApiKey, claudeApiKey }) {
  if (grokApiKey) {
    try {
      return await sendViaGrok(messages, grokApiKey);
    } catch (err) {
      if (!claudeApiKey) throw err;
      console.warn('Grok failed, falling back to Claude:', err.message);
    }
  }

  if (!claudeApiKey) {
    throw new Error('No API key provided for TinaAi');
  }

  return sendViaClaude(messages, claudeApiKey);
}
