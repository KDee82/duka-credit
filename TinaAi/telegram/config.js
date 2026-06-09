const config = {
  name: 'TinaAi',
  systemPrompt: `You are TinaAi, a helpful assistant for the Duka Credit app.
You help shopkeepers manage customer credit, track transactions, and answer questions
about their business finances. Be concise, friendly, and practical.`,
  maxTokens: 1024,
  temperature: 0.7,

  grok: {
    apiUrl: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-3-beta',
  },

  claude: {
    apiUrl: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-6',
    version: '2023-06-01',
  },
};

export default config;
