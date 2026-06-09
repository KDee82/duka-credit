import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { getReply } from './tinaai.js';
import config from './config.js';

const BOT_TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
const GROK_KEY    = process.env.GROK_API_KEY;
const CLAUDE_KEY  = process.env.CLAUDE_API_KEY;

if (!BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is not set in .env');
  process.exit(1);
}

if (!GROK_KEY && !CLAUDE_KEY) {
  console.error('At least one of GROK_API_KEY or CLAUDE_API_KEY must be set in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Per-chat conversation history (in-memory)
const sessions = new Map();

function getHistory(chatId) {
  if (!sessions.has(chatId)) sessions.set(chatId, []);
  return sessions.get(chatId);
}

function clearHistory(chatId) {
  sessions.set(chatId, []);
}

// /start
bot.start((ctx) => {
  clearHistory(ctx.chat.id);
  return ctx.reply(
    `Hi! I'm ${config.name}, your Duka Credit assistant.\n\n` +
    `I can help you with:\n` +
    `• Customer credit management\n` +
    `• Transaction tracking\n` +
    `• Business finance questions\n\n` +
    `Just send me a message to get started.\n` +
    `Use /reset to start a fresh conversation.`
  );
});

// /reset
bot.command('reset', (ctx) => {
  clearHistory(ctx.chat.id);
  return ctx.reply('Conversation cleared. Start fresh anytime!');
});

// /help
bot.help((ctx) => {
  return ctx.reply(
    `*${config.name} Commands*\n\n` +
    `/start — Welcome message & reset chat\n` +
    `/reset — Clear conversation history\n` +
    `/help  — Show this message\n\n` +
    `Just type any question to chat with me!`,
    { parse_mode: 'Markdown' }
  );
});

// Text messages
bot.on(message('text'), async (ctx) => {
  const chatId = ctx.chat.id;
  const userText = ctx.message.text;
  const history = getHistory(chatId);

  // Show typing indicator
  await ctx.sendChatAction('typing');

  history.push({ role: 'user', content: userText });

  try {
    const reply = await getReply(history, {
      grokApiKey: GROK_KEY,
      claudeApiKey: CLAUDE_KEY,
    });

    history.push({ role: 'assistant', content: reply });
    await ctx.reply(reply);
  } catch (err) {
    console.error(`[TinaAi] Error for chat ${chatId}:`, err.message);
    // Remove the failed user message so history stays clean
    history.pop();
    await ctx.reply('Sorry, I ran into an error. Please try again in a moment.');
  }
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch().then(() => {
  console.log(`[TinaAi] Telegram bot is running (provider: ${GROK_KEY ? 'Grok' : 'Claude'})`);
});
