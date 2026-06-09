#!/usr/bin/env node
/**
 * ServerAvatar deployment script for TinaAi Telegram bot.
 * Uses hardcoded IDs (org 18639 / server 40301 / app 147145) to avoid
 * the /applications listing endpoint which returns empty for this token.
 *
 * Run from TinaAi/telegram/:  node deploy.js
 */

import 'dotenv/config';

const SA_TOKEN   = process.env.SERVERAVATAR_TOKEN;
const BOT_TOKEN  = process.env.TELEGRAM_BOT_TOKEN;
const GROK_KEY   = process.env.GROK_API_KEY;
const CLAUDE_KEY = process.env.CLAUDE_API_KEY || '';

const BASE     = 'https://api.serveravatar.com';
const REPO     = 'KDee82/duka-credit';
const BRANCH   = 'claude/tinaai-github-folder-5iokh7';

const ORG_ID    = 18639;
const SERVER_ID = 40301;
const APP_ID    = 147145;

// ── HTTP helper ──────────────────────────────────────────────────────────────

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${SA_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { _raw: text }; }

  if (!res.ok) {
    console.error(`\n✗ ${method} ${path} → HTTP ${res.status}`);
    console.error(JSON.stringify(json, null, 2));
    throw new Error(`API error ${res.status}`);
  }

  return json;
}

// ── Configuration ────────────────────────────────────────────────────────────

async function updateGit() {
  console.log('→ Updating git repository...');
  await api('PUT', `/organizations/${ORG_ID}/servers/${SERVER_ID}/applications/${APP_ID}/git`, {
    git_provider: 'github',
    repository:   REPO,
    branch:       BRANCH,
    auto_deploy:  true,
  });
  console.log(`  ✓ Repo set to ${REPO} @ ${BRANCH}`);
}

async function configureNode() {
  console.log('→ Configuring Node.js runtime...');
  try {
    await api('PUT', `/organizations/${ORG_ID}/servers/${SERVER_ID}/applications/${APP_ID}/node-deployment`, {
      rendering:               'ssr',
      package_manager:         'npm',
      process_mode:            'fork',
      port:                    3000,
      package_install_command: 'cd TinaAi/telegram && npm install',
      build_command:           '',
      start_app_command:       'node TinaAi/telegram/bot.js',
      environment_variable:    buildEnvVars(),
    });
    console.log('  ✓ Node.js runtime configured');
  } catch (err) {
    console.warn(`  ⚠ node-deployment config skipped (${err.message}) — using existing settings`);
  }
}

async function setDeployScript() {
  console.log('→ Setting deployment script...');
  try {
    await api('POST', `/organizations/${ORG_ID}/servers/${SERVER_ID}/applications/${APP_ID}/git/script`, {
      script: 'cd TinaAi/telegram && npm install',
    });
    console.log('  ✓ Deploy script set');
  } catch (err) {
    console.warn(`  ⚠ Deploy script skipped (${err.message})`);
  }
}

async function deploy() {
  console.log('→ Triggering deployment...');
  await api('POST', `/organizations/${ORG_ID}/servers/${SERVER_ID}/applications/${APP_ID}/git/deploy`);
  console.log('  ✓ Deployment triggered');
}

function buildEnvVars() {
  const vars = [
    { key: 'TELEGRAM_BOT_TOKEN', value: BOT_TOKEN },
    { key: 'GROK_API_KEY',       value: GROK_KEY  },
  ];
  if (CLAUDE_KEY) vars.push({ key: 'CLAUDE_API_KEY', value: CLAUDE_KEY });
  return vars;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🤖 TinaAi — ServerAvatar Deployment\n');
  console.log(`  Org    : ${ORG_ID}`);
  console.log(`  Server : ${SERVER_ID}`);
  console.log(`  App    : ${APP_ID}`);
  console.log('');

  if (!SA_TOKEN)              { console.error('✗ SERVERAVATAR_TOKEN not set'); process.exit(1); }
  if (!BOT_TOKEN || !GROK_KEY) { console.error('✗ TELEGRAM_BOT_TOKEN and GROK_API_KEY required'); process.exit(1); }

  await updateGit();
  await configureNode();
  await setDeployScript();
  await deploy();

  console.log(`
✅ TinaAi deployment triggered!

  Repo      : ${REPO} @ ${BRANCH}
  Start cmd : node TinaAi/telegram/bot.js

The bot will be live in ~1–2 minutes.
Check the ServerAvatar dashboard for progress.
`);
}

main().catch(err => {
  console.error('\n✗ Deployment failed:', err.message);
  process.exit(1);
});
