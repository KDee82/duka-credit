import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: join(__dirname, '.env') });

import express from 'express';
import { getReply } from './tinaai.js';
import { buildSystemPrompt } from './character.js';
import {
  loadSession,
  addMessage,
  updateProfile,
  resetHistory,
  forgetAll,
  removeLastMessage,
  removeNote,
} from './memory.js';

const PORT = process.env.PORT || process.env.TEST_PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

function getKeys() {
  return {
    grokApiKey: process.env.GROK_API_KEY,
    claudeApiKey: process.env.CLAUDE_API_KEY,
  };
}

app.post('/api/chat', async (req, res) => {
  const { message, chatId = 'web-test' } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'message required' });
  const { profile, history } = loadSession(chatId);
  const systemPrompt = buildSystemPrompt(profile);
  addMessage(chatId, 'user', message);
  try {
    const keys = getKeys();
    const reply = await getReply(
      [...history, { role: 'user', content: message }],
      systemPrompt,
      keys,
    );
    addMessage(chatId, 'assistant', reply);
    const provider = keys.grokApiKey ? 'grok' : 'claude';
    res.json({ reply, provider });
  } catch (err) {
    removeLastMessage(chatId);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/session/:chatId', (req, res) => {
  res.json(loadSession(req.params.chatId));
});

app.post('/api/profile', (req, res) => {
  const { chatId = 'web-test', ...updates } = req.body;
  updateProfile(chatId, updates);
  res.json(loadSession(chatId).profile);
});

app.post('/api/reset', (req, res) => {
  const { chatId = 'web-test', full = false } = req.body;
  if (full) forgetAll(chatId); else resetHistory(chatId);
  res.json({ ok: true });
});

app.delete('/api/note', (req, res) => {
  const { chatId = 'web-test', index } = req.body;
  const removed = removeNote(chatId, index);
  res.json({ removed });
});

app.get('/api/status', (_req, res) => {
  const keys = getKeys();
  res.json({
    grok: !!keys.grokApiKey,
    claude: !!keys.claudeApiKey,
    primary: keys.grokApiKey ? 'grok' : (keys.claudeApiKey ? 'claude' : 'none'),
  });
});

app.get('/api/test', async (_req, res) => {
  try {
    const keys = getKeys();
    const reply = await getReply(
      [{ role: 'user', content: 'Say "OK" and nothing else.' }],
      'You are a test bot. Reply with only "OK".',
      keys,
    );
    res.json({ ok: true, reply });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  const keys = getKeys();
  console.log(`\n🤖 TinaAi Test UI\n`);
  console.log(` http://localhost:${PORT}\n`);
  console.log(` Grok: ${keys.grokApiKey ? '✓ configured' : '✗ not set'}`);
  console.log(` Claude: ${keys.claudeApiKey ? '✓ configured' : '✗ not set'}\n`);
});
