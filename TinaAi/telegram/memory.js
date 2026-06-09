import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = join(__dir, 'data');
const DATA_FILE = join(DATA_DIR, 'memory.json');

const MAX_HISTORY = 30; // messages kept per chat

// ── Storage helpers ──────────────────────────────────────────────────────────

function load() {
  if (!existsSync(DATA_FILE)) return {};
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function save(store) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
}

function getSession(store, chatId) {
  const key = String(chatId);
  if (!store[key]) {
    store[key] = {
      profile: { firstSeen: new Date().toISOString().split('T')[0] },
      history: [],
    };
  }
  return store[key];
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Returns { profile, history } for a chat. */
export function loadSession(chatId) {
  const store = load();
  return getSession(store, chatId);
}

/** Append a message and persist. Trims history to MAX_HISTORY. */
export function addMessage(chatId, role, content) {
  const store = load();
  const session = getSession(store, chatId);

  session.history.push({ role, content });
  if (session.history.length > MAX_HISTORY) {
    session.history = session.history.slice(-MAX_HISTORY);
  }

  session.profile.lastSeen = new Date().toISOString().split('T')[0];
  save(store);
}

/** Merge profile fields and persist. */
export function updateProfile(chatId, updates) {
  const store = load();
  const session = getSession(store, chatId);

  if (updates.note) {
    // Append a note rather than overwrite
    session.profile.notes = session.profile.notes || [];
    if (!session.profile.notes.includes(updates.note)) {
      session.profile.notes.push(updates.note);
    }
    delete updates.note;
  }

  Object.assign(session.profile, updates);
  save(store);
}

/** Clear conversation history but keep profile. */
export function resetHistory(chatId) {
  const store = load();
  const session = getSession(store, chatId);
  session.history = [];
  save(store);
}

/** Wipe everything for this chat — profile + history. */
export function forgetAll(chatId) {
  const store = load();
  delete store[String(chatId)];
  save(store);
}

/** Remove a specific note by index (1-based). */
export function removeNote(chatId, index) {
  const store = load();
  const session = getSession(store, chatId);
  const notes = session.profile.notes || [];
  if (index < 1 || index > notes.length) return false;
  notes.splice(index - 1, 1);
  session.profile.notes = notes;
  save(store);
  return true;
}
