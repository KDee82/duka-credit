import config from './config.js';

const { grok, claude, maxTokens, temperature } = config;

async function sendViaGrok(messages, systemPrompt, apiKey) {
  const res = await fetch(grok.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: grok.model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `Grok error ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function sendViaClaude(messages, systemPrompt, apiKey) {
  const res = await fetch(claude.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
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

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `Claude error ${res.status}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

export async function getReply(messages, systemPrompt, { grokApiKey, claudeApiKey }) {
  if (grokApiKey) {
    try {
      return await sendViaGrok(messages, systemPrompt, grokApiKey);
    } catch (err) {
      if (!claudeApiKey) throw err;
      console.warn(`[TinaAi] Grok failed (${err.message}), falling back to Claude`);
    }
  }

  if (!claudeApiKey) throw new Error('No AI API key configured');
  return sendViaClaude(messages, systemPrompt, claudeApiKey);
}
