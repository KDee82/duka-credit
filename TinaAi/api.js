import TINAAI_CONFIG from './config';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function sendMessage(messages, apiKey) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: TINAAI_CONFIG.model,
      max_tokens: TINAAI_CONFIG.maxTokens,
      system: TINAAI_CONFIG.systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to get response from TinaAi');
  }

  const data = await response.json();
  return data.content[0].text;
}
