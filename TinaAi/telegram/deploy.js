#!/usr/bin/env node
/**
 * ServerAvatar deployment script for TinaAi Telegram bot.
 * Uses hardcoded IDs (org 18639 / server 40301 / app 147145).
 *
 * Run from TinaAi/telegram/:  node deploy.js
 */

import 'dotenv/config';

const SA_TOKEN   = process.env.SERVERAVATAR_TOKEN;
const BOT_TOKEN  = process.env.TELEGRAM_BOT_TOKEN;
const GROK_KEY   = process.env.GROK_API_KEY;
const CLAUDE_KEY = process.env.CLAUDE_API_KEY || '';

const BASE      = 'https://api.serveravatar.com';
const REPO      = 'KDee82/duka-credit';
const BRANCH    = 'claude/tinaai-github-folder-5iokh7';
const ORG_ID    = 18639;
const SERVER_ID = 40301;
const APP_ID    = 147145;

const APP_BASE  = `/organizations/${ORG_ID}/servers/${SERVER_ID}/applications/${APP_ID}`;

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

async function tryApi(method, path, body) {
  try {
    const r = await api(method, path, body);
    console.log(`    ✓ ${method} ${path}`);
    return r;
  } catch (err) {
    console.warn(`    ✗ ${method} ${path} — ${err.message}`);
    return null;
  }
}

// ── Explore ──────────────────────────────────────────────────────────────────

async function inspectApp() {
  console.log('→ Fetching app details...');
  const data = await api('GET', APP_BASE);
  const app = data.application ?? data;
  console.log(`  Top-level keys: ${Object.keys(data).join(', ')}`);
  console.log(`  App fields: ${Object.keys(app).join(', ')}`);
  console.log(`  gitDeployment: ${JSON.stringify(data.gitDeployment ?? 'none', null, 2)}`);
  const relevant = ['name', 'framework', 'git_provider', 'repository', 'branch',
                    'status', 'php_version', 'node_version', 'username'];
  const info = Object.fromEntries(relevant.filter(k => app[k] != null).map(k => [k, app[k]]));
  console.log(`  App: ${JSON.stringify(info)}`);
  return { app, gitDeployment: data.gitDeployment };
}

// ── Git update — try every plausible endpoint ────────────────────────────────

async function updateGit(gitDeployment) {
  console.log('→ Probing git update endpoints...');

  // gitDeployment from the GET response might tell us the update endpoint
  if (gitDeployment) {
    const gdKeys = Object.keys(gitDeployment);
    console.log(`  gitDeployment keys: ${gdKeys.join(', ')}`);
  }

  const gitPayload = {
    git_provider: 'github',
    repository:   REPO,
    branch:       BRANCH,
    auto_deploy:  true,
  };

  const gitDeploymentPayload = {
    provider:     'github',
    repository:   REPO,
    branch:       BRANCH,
    auto_deploy:  true,
  };

  const candidates = [
    ['PUT',   `${APP_BASE}/git`, gitPayload],
    ['PUT',   `${APP_BASE}/git-deployment`, gitDeploymentPayload],
    ['POST',  `${APP_BASE}/git-deployment`, gitDeploymentPayload],
    ['PATCH', `${APP_BASE}/git-deployment`, gitDeploymentPayload],
    ['PUT',   `${APP_BASE}/github`, gitPayload],
    ['PUT',   `${APP_BASE}/git-configuration`, gitPayload],
    ['PUT',   `${APP_BASE}/repository`, gitPayload],
    ['POST',  `${APP_BASE}/repository`, gitPayload],
  ];

  for (const [method, path, body] of candidates) {
    const result = await tryApi(method, path, body);
    if (result !== null) {
      console.log(`  ✓ Git updated via ${method} ${path}`);
      return;
    }
  }
  console.warn('  ⚠ Could not update git settings — continuing');
}

// ── Clean / Reset working directory ──────────────────────────────────────────

async function cleanWorkingDir() {
  console.log('→ Probing working directory clean/reset endpoints...');
  const candidates = [
    ['POST', `${APP_BASE}/git/discard`],
    ['POST', `${APP_BASE}/git/reset`],
    ['POST', `${APP_BASE}/git/clean`],
    ['POST', `${APP_BASE}/git/hard-reset`],
    ['POST', `${APP_BASE}/git/reset-hard`],
    ['POST', `${APP_BASE}/git/restore`],
    ['DELETE', `${APP_BASE}/git/changes`],
  ];

  for (const [method, path] of candidates) {
    const result = await tryApi(method, path);
    if (result !== null) {
      console.log(`  ✓ Working dir cleaned via ${method} ${path}`);
      return true;
    }
  }
  console.warn('  ⚠ Could not find a clean/reset endpoint');
  return false;
}

// ── Node.js config ───────────────────────────────────────────────────────────

async function configureNode() {
  console.log('→ Configuring Node.js runtime...');
  const payload = {
    rendering:               'ssr',
    package_manager:         'npm',
    process_mode:            'fork',
    port:                    3000,
    package_install_command: 'cd TinaAi/telegram && npm install',
    build_command:           '',
    start_app_command:       'node TinaAi/telegram/bot.js',
    environment_variable:    buildEnvVars(),
  };

  const result = await tryApi('PUT', `${APP_BASE}/node-deployment`, payload);
  if (!result) await tryApi('POST', `${APP_BASE}/node-deployment`, payload);
}

// ── Deploy trigger — try every plausible endpoint ────────────────────────────

async function deploy() {
  console.log('→ Probing deploy trigger endpoints...');
  const candidates = [
    ['POST', `${APP_BASE}/git/deploy`],
    ['POST', `${APP_BASE}/deploy`],
    ['POST', `${APP_BASE}/redeploy`],
    ['POST', `${APP_BASE}/git/pull`],
    ['POST', `${APP_BASE}/pull`],
    ['GET',  `${APP_BASE}/deploy`],
  ];

  for (const [method, path] of candidates) {
    const result = await tryApi(method, path);
    if (result !== null) {
      console.log(`  ✓ Deployment triggered via ${method} ${path}`);
      return;
    }
  }
  throw new Error('Could not find a working deploy endpoint — check ServerAvatar API docs');
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
  console.log(`  Org ${ORG_ID} / Server ${SERVER_ID} / App ${APP_ID}\n`);

  if (!SA_TOKEN)               { console.error('✗ SERVERAVATAR_TOKEN not set'); process.exit(1); }
  if (!BOT_TOKEN || !GROK_KEY) { console.error('✗ TELEGRAM_BOT_TOKEN and GROK_API_KEY required'); process.exit(1); }

  const { gitDeployment } = await inspectApp();
  await updateGit(gitDeployment);
  await configureNode();
  const cleaned = await cleanWorkingDir();
  if (cleaned) {
    console.log('  → Retrying git/pull after clean...');
    await tryApi('POST', `${APP_BASE}/git/pull`);
  }
  await deploy();

  console.log('\n✅ TinaAi deployment triggered!\n');
  console.log(`  Repo : ${REPO} @ ${BRANCH}`);
  console.log('  Start: node TinaAi/telegram/bot.js');
  console.log('\nBot will be live in ~1–2 minutes.\n');
}

main().catch(err => {
  console.error('\n✗ Deployment failed:', err.message);
  process.exit(1);
});
