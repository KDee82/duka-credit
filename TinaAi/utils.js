export function buildUserMessage(text) {
  return { role: 'user', content: text };
}

export function buildAssistantMessage(text) {
  return { role: 'assistant', content: text };
}

export function formatTimestamp(date = new Date()) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function createChatSession() {
  return {
    id: Date.now().toString(),
    messages: [],
    createdAt: new Date().toISOString(),
  };
}
