import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH  = join(__dirname, '.env');
dotenvConfig({ path: ENV_PATH });

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

const PORT = process.env.PORT || process.env.TEST_PORT || 3035;

// Admin token — shown once in console; set ADMIN_TOKEN in .env to pin it
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || (
  Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)
);

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// ── Helpers ──────────────────────────────────────────────────────────────────

function getKeys() {
  return {
    grokApiKey:   process.env.GROK_API_KEY,
    claudeApiKey: process.env.CLAUDE_API_KEY,
  };
}

function parseEnvFile() {
  if (!existsSync(ENV_PATH)) return {};
  const vars = {};
  for (const line of readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const eq = line.indexOf('=');
    if (eq > 0) {
      const k = line.slice(0, eq).trim();
      const v = line.slice(eq + 1).trim();
      if (k) vars[k] = v;
    }
  }
  return vars;
}

function writeEnvFile(vars) {
  const content = Object.entries(vars)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n') + '\n';
  writeFileSync(ENV_PATH, content, 'utf8');
}

function mask(v) {
  if (!v) return null;
  return v.slice(0, 6) + '••••' + v.slice(-4);
}

// ── Chat ─────────────────────────────────────────────────────────────────────

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

// ── Session / Profile ────────────────────────────────────────────────────────

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
  res.json({ removed: removeNote(chatId, index) });
});

// ── Status / Test ────────────────────────────────────────────────────────────

app.get('/api/status', (_req, res) => {
  const keys = getKeys();
  res.json({
    grok:    !!keys.grokApiKey,
    claude:  !!keys.claudeApiKey,
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

// ── API Keys management ───────────────────────────────────────────────────────

app.get('/api/keys', (_req, res) => {
  res.json({
    grok:     mask(process.env.GROK_API_KEY),
    claude:   mask(process.env.CLAUDE_API_KEY),
    telegram: mask(process.env.TELEGRAM_BOT_TOKEN),
  });
});

app.post('/api/keys', (req, res) => {
  const auth = (req.headers.authorization || '').replace('Bearer ', '');
  if (auth !== ADMIN_TOKEN) return res.status(401).json({ error: 'Invalid admin token' });

  const { grokApiKey, claudeApiKey, telegramToken } = req.body;
  const env = parseEnvFile();

  if (grokApiKey)    { env.GROK_API_KEY = grokApiKey;           process.env.GROK_API_KEY = grokApiKey; }
  if (claudeApiKey)  { env.CLAUDE_API_KEY = claudeApiKey;       process.env.CLAUDE_API_KEY = claudeApiKey; }
  if (telegramToken) { env.TELEGRAM_BOT_TOKEN = telegramToken;  process.env.TELEGRAM_BOT_TOKEN = telegramToken; }

  writeEnvFile(env);
  res.json({ ok: true, message: 'Keys saved and applied live' });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  const keys = getKeys();
  console.log(`\n🤖 TinaAi Test UI`);
  console.log(`   http://localhost:${PORT}\n`);
  console.log(`   Grok:        ${keys.grokApiKey   ? '✓ configured' : '✗ not set'}`);
  console.log(`   Claude:      ${keys.claudeApiKey ? '✓ configured' : '✗ not set'}`);
  console.log(`   Admin token: ${ADMIN_TOKEN}\n`);
});
