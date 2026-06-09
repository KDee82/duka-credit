#!/usr/bin/env node
/**
 * ServerAvatar deployment script for TinaAi Telegram bot.
 * Finds the existing "TinaAi" app on your ServerAvatar server,
 * updates its git repo to this project, and deploys.
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
const APP_NAME = 'TinaAi';

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

// ── Discovery ────────────────────────────────────────────────────────────────

async function getOrg() {
  console.log('→ Fetching organization...');
  const data = await api('GET', '/organizations');
  const orgs = data.organizations ?? data;
  const org  = Array.isArray(orgs) ? orgs[0] : Object.values(orgs)[0];
  if (!org?.id) throw new Error(`Unexpected /organizations response: ${JSON.stringify(data)}`);
  console.log(`  ✓ ${org.name} (id ${org.id})`);
  return org;
}

async function getServer(orgId) {
  console.log('→ Fetching servers...');
  const data = await api('GET', `/organizations/${orgId}/servers`);
  const servers = data.servers ?? data;
  const list = Array.isArray(servers) ? servers : Object.values(servers);
  if (!list.length) throw new Error('No servers on this account');
  list.forEach((s, i) => console.log(`  [${i}] ${s.name} — ${s.ip} (${s.operating_system})`));
  const server = list[0];
  console.log(`  ✓ Using: ${server.name} (id ${server.id})`);
  return server;
}

async function findApp(orgId, serverId) {
  console.log(`→ Looking for "${APP_NAME}" application...`);
  const data = await api('GET', `/organizations/${orgId}/servers/${serverId}/applications`);
  const apps = data.applications ?? data;
  const list = Array.isArray(apps) ? apps : Object.values(apps);
  console.log(`  Found ${list.length} app(s): ${list.map(a => a.name).join(', ')}`);
  const app = list.find(a => a.name?.toLowerCase() === APP_NAME.toLowerCase());
  if (!app) throw new Error(`No app named "${APP_NAME}". Apps found: ${list.map(a => a.name).join(', ')}`);
  console.log(`  ✓ Found: ${app.name} (id ${app.id})`);
  return app;
}

// ── Configuration ────────────────────────────────────────────────────────────

async function updateGit(orgId, serverId, appId) {
  console.log('→ Updating git repository...');
  await api('PUT', `/organizations/${orgId}/servers/${serverId}/applications/${appId}/git`, {
    git_provider:  'github',
    repository:    REPO,
    branch:        BRANCH,
    auto_deploy:   true,
  });
  console.log(`  ✓ Repo set to ${REPO} @ ${BRANCH}`);
}

async function configureNode(orgId, serverId, appId) {
  console.log('→ Configuring Node.js runtime...');
  try {
    await api('PUT', `/organizations/${orgId}/servers/${serverId}/applications/${appId}/node-deployment`, {
      rendering:              'ssr',
      package_manager:        'npm',
      process_mode:           'fork',
      port:                   3000,
      package_install_command: 'cd TinaAi/telegram && npm install',
      build_command:          '',
      start_app_command:      'node TinaAi/telegram/bot.js',
      environment_variable:   buildEnvVars(),
    });
    console.log('  ✓ Node.js runtime configured');
  } catch (err) {
    console.warn(`  ⚠ node-deployment config skipped (${err.message}) — using existing settings`);
  }
}

async function setDeployScript(orgId, serverId, appId) {
  console.log('→ Setting deployment script...');
  try {
    await api('POST', `/organizations/${orgId}/servers/${serverId}/applications/${appId}/git/script`, {
      script: 'cd TinaAi/telegram && npm install',
    });
    console.log('  ✓ Deploy script set');
  } catch (err) {
    console.warn(`  ⚠ Deploy script skipped (${err.message})`);
  }
}

async function deploy(orgId, serverId, appId) {
  console.log('→ Triggering deployment...');
  await api('POST', `/organizations/${orgId}/servers/${serverId}/applications/${appId}/git/deploy`);
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

  if (!SA_TOKEN)             { console.error('✗ SERVERAVATAR_TOKEN not set'); process.exit(1); }
  if (!BOT_TOKEN || !GROK_KEY) { console.error('✗ TELEGRAM_BOT_TOKEN and GROK_API_KEY required'); process.exit(1); }

  const org    = await getOrg();
  const server = await getServer(org.id);
  const app    = await findApp(org.id, server.id);

  await updateGit(org.id, server.id, app.id);
  await configureNode(org.id, server.id, app.id);
  await setDeployScript(org.id, server.id, app.id);
  await deploy(org.id, server.id, app.id);

  console.log(`
✅ TinaAi deployment triggered!

  App       : ${app.name} (id ${app.id})
  Server    : ${server.name} (${server.ip})
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
