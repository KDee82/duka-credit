import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { getReply } from './tinaai.js';
import { buildSystemPrompt, CHARACTER } from './character.js';
import {
  loadSession,
  addMessage,
  updateProfile,
  resetHistory,
  forgetAll,
  removeNote,
} from './memory.js';

const BOT_TOKEN  = process.env.TELEGRAM_BOT_TOKEN;
const GROK_KEY   = process.env.GROK_API_KEY;
const CLAUDE_KEY = process.env.CLAUDE_API_KEY;

if (!BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is not set in .env');
  process.exit(1);
}
if (!GROK_KEY && !CLAUDE_KEY) {
  console.error('At least one of GROK_API_KEY or CLAUDE_API_KEY must be set in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const keys = { grokApiKey: GROK_KEY, claudeApiKey: CLAUDE_KEY };

// ── Helpers ──────────────────────────────────────────────────────────────────

function greeting(profile) {
  const name = profile.name ? `, ${profile.name}` : '';
  const shop = profile.shopName ? ` for *${profile.shopName}*` : '';
  return (
    `👋 Hi${name}! I'm *${CHARACTER.name}*${shop} — your intelligent assistant.\n\n` +
    `I'm highly capable across multiple areas:\n\n` +
    `💼 *Business & Finance* — credit tracking, balances, cash flow, financial advice\n` +
    `💻 *Coding & Tech* — write, debug & explain code in any language\n` +
    `🤝 *Customer Care* — draft responses, handle complaints, retain customers\n` +
    `✍️ *Messaging & Writing* — WhatsApp, SMS, emails, letters, reminders\n` +
    `🧠 *General Intelligence* — research, analysis, problem-solving, ideas\n\n` +
    `Just ask me anything. Use /help for all commands.`
  );
}

// ── Commands ─────────────────────────────────────────────────────────────────

bot.start((ctx) => {
  const { profile } = loadSession(ctx.chat.id);
  return ctx.reply(greeting(profile), { parse_mode: 'Markdown' });
});

bot.help((ctx) => {
  return ctx.reply(
    `*${CHARACTER.name} Commands*\n\n` +
    `*Profile*\n` +
    `/setname <name>   — Save your name\n` +
    `/setshop <name>   — Save your shop name\n` +
    `/setlocation <loc> — Save your location\n` +
    `/addnote <text>   — Add a note to your profile\n` +
    `/removenote <n>   — Remove note by number\n\n` +
    `*Memory*\n` +
    `/memory   — Show what I remember about you\n` +
    `/reset    — Clear conversation history (keeps profile)\n` +
    `/forget   — Erase all memory including profile\n\n` +
    `*Other*\n` +
    `/help  — Show this message\n` +
    `/start — Welcome message`,
    { parse_mode: 'Markdown' }
  );
});

// Profile setters
bot.command('setname', (ctx) => {
  const name = ctx.message.text.replace('/setname', '').trim();
  if (!name) return ctx.reply('Usage: /setname Your Name');
  updateProfile(ctx.chat.id, { name });
  return ctx.reply(`Got it! I'll call you *${name}* from now on.`, { parse_mode: 'Markdown' });
});

bot.command('setshop', (ctx) => {
  const shopName = ctx.message.text.replace('/setshop', '').trim();
  if (!shopName) return ctx.reply('Usage: /setshop My Shop Name');
  updateProfile(ctx.chat.id, { shopName });
  return ctx.reply(`Shop saved as *${shopName}*.`, { parse_mode: 'Markdown' });
});

bot.command('setlocation', (ctx) => {
  const location = ctx.message.text.replace('/setlocation', '').trim();
  if (!location) return ctx.reply('Usage: /setlocation Nairobi');
  updateProfile(ctx.chat.id, { location });
  return ctx.reply(`Location saved as *${location}*.`, { parse_mode: 'Markdown' });
});

bot.command('addnote', (ctx) => {
  const note = ctx.message.text.replace('/addnote', '').trim();
  if (!note) return ctx.reply('Usage: /addnote something to remember');
  updateProfile(ctx.chat.id, { note });
  return ctx.reply(`Note added: _${note}_`, { parse_mode: 'Markdown' });
});

bot.command('removenote', (ctx) => {
  const n = parseInt(ctx.message.text.replace('/removenote', '').trim(), 10);
  if (isNaN(n)) return ctx.reply('Usage: /removenote <number>  (see /memory for note numbers)');
  const removed = removeNote(ctx.chat.id, n);
  return ctx.reply(removed ? `Note #${n} removed.` : `No note at that number. Use /memory to check.`);
});

// Memory viewer
bot.command('memory', (ctx) => {
  const { profile, history } = loadSession(ctx.chat.id);
  const lines = ['*What I remember about you:*\n'];

  if (profile.name)     lines.push(`👤 Name: ${profile.name}`);
  if (profile.shopName) lines.push(`🏪 Shop: ${profile.shopName}`);
  if (profile.location) lines.push(`📍 Location: ${profile.location}`);
  if (profile.firstSeen) lines.push(`📅 First chat: ${profile.firstSeen}`);
  if (profile.lastSeen)  lines.push(`🕐 Last seen: ${profile.lastSeen}`);

  if (profile.notes && profile.notes.length) {
    lines.push('\n📝 Notes:');
    profile.notes.forEach((n, i) => lines.push(`  ${i + 1}. ${n}`));
  }

  lines.push(`\n💬 Conversation history: ${history.length} message(s) stored`);

  if (lines.length === 2) lines.push('Nothing stored yet. Use /setname and /setshop to get started.');

  return ctx.reply(lines.join('\n'), { parse_mode: 'Markdown' });
});

// Reset / forget
bot.command('reset', (ctx) => {
  resetHistory(ctx.chat.id);
  return ctx.reply('Conversation cleared. Your profile is still saved. Start fresh anytime!');
});

bot.command('forget', async (ctx) => {
  forgetAll(ctx.chat.id);
  return ctx.reply('All memory erased. I no longer know anything about you.');
});

// ── Message handler ───────────────────────────────────────────────────────────

bot.on(message('text'), async (ctx) => {
  const chatId   = ctx.chat.id;
  const userText = ctx.message.text;

  await ctx.sendChatAction('typing');

  const { profile, history } = loadSession(chatId);
  const systemPrompt = buildSystemPrompt(profile);

  addMessage(chatId, 'user', userText);

  try {
    const reply = await getReply([...history, { role: 'user', content: userText }], systemPrompt, keys);
    addMessage(chatId, 'assistant', reply);
    await ctx.reply(reply);
  } catch (err) {
    console.error(`[TinaAi] Error for chat ${chatId}:`, err.message);
    // Roll back the user message we just saved
    const { history: h } = loadSession(chatId);
    h.pop();
    await ctx.reply('Sorry, I ran into a problem. Please try again in a moment.');
  }
});

// ── Launch ────────────────────────────────────────────────────────────────────

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch().then(() => {
  console.log(`[TinaAi] Bot running | Provider: ${GROK_KEY ? 'Grok → Claude fallback' : 'Claude only'}`);
});
