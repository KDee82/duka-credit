#!/usr/bin/env node
/**
 * ServerAvatar deployment script for TinaAi Telegram bot.
 * Run once from your local machine:
 *   node deploy.js
 *
 * Requires in .env:
 *   SERVERAVATAR_TOKEN=...
 *   TELEGRAM_BOT_TOKEN=...
 *   GROK_API_KEY=...
 *   CLAUDE_API_KEY=...   (optional)
 */

import 'dotenv/config';

const SA_TOKEN    = process.env.SERVERAVATAR_TOKEN;
const BOT_TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
const GROK_KEY    = process.env.GROK_API_KEY;
const CLAUDE_KEY  = process.env.CLAUDE_API_KEY || '';

const BASE        = 'https://api.serveravatar.com';
const REPO        = 'KDee82/duka-credit';
const BRANCH      = 'claude/tinaai-github-folder-5iokh7';
const APP_NAME    = 'tinaai-telegram-bot';

// ── HTTP helper ──────────────────────────────────────────────────────────────

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${SA_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }

  if (!res.ok) {
    console.error(`\n✗ ${method} ${path} → ${res.status}`);
    console.error(JSON.stringify(json, null, 2));
    throw new Error(`API error ${res.status}`);
  }

  return json;
}

// ── Steps ────────────────────────────────────────────────────────────────────

async function getOrganization() {
  console.log('→ Fetching organization...');
  const data = await api('GET', '/organizations');
  const org = data.organizations?.[0] || data[0];
  if (!org) throw new Error('No organizations found on this account');
  console.log(`  ✓ Org: ${org.name} (id: ${org.id})`);
  return org;
}

async function getServer(orgId) {
  console.log('→ Fetching servers...');
  const data = await api('GET', `/organizations/${orgId}/servers`);
  const servers = data.servers || data;
  if (!servers || servers.length === 0) throw new Error('No servers found on this account');

  console.log(`  Available servers:`);
  servers.forEach((s, i) => console.log(`    [${i}] ${s.name} — ${s.ip} (${s.operating_system})`));

  const server = servers[0];
  console.log(`  ✓ Using: ${server.name} (id: ${server.id})`);
  return server;
}

async function createApplication(orgId, serverId) {
  console.log('→ Creating Node.js application...');

  const payload = {
    name: APP_NAME,
    framework: 'node',
    type: 'node',
    rendering: 'ssr',
    package_manager: 'npm',
    process_mode: 'fork',
    port: 3000,
    package_install_command: 'npm install',
    build_command: '',
    start_app_command: 'node bot.js',
    sub_directory: 'TinaAi/telegram',
    environment_variable: buildEnvVars(),
  };

  const data = await api('POST', `/organizations/${orgId}/servers/${serverId}/applications`, payload);
  const app = data.application || data;
  console.log(`  ✓ Application created (id: ${app.id})`);
  return app;
}

async function connectGit(orgId, serverId, appId) {
  console.log('→ Connecting GitHub repository...');

  const payload = {
    git_provider: 'github',
    repository: REPO,
    branch: BRANCH,
    auto_deploy: true,
  };

  await api('POST', `/organizations/${orgId}/servers/${serverId}/applications/${appId}/git`, payload);
  console.log(`  ✓ Repo ${REPO} (${BRANCH}) connected with auto-deploy`);
}

async function triggerDeploy(orgId, serverId, appId) {
  console.log('→ Triggering initial deployment...');
  await api('POST', `/organizations/${orgId}/servers/${serverId}/applications/${appId}/git/deploy`);
  console.log('  ✓ Deployment triggered');
}

async function updateEnvVars(orgId, serverId, appId) {
  console.log('→ Confirming environment variables...');
  try {
    await api('PUT', `/organizations/${orgId}/servers/${serverId}/applications/${appId}/node-deployment`, {
      environment_variable: buildEnvVars(),
    });
    console.log('  ✓ Environment variables confirmed');
  } catch (err) {
    // Non-fatal: env vars were already set in createApplication
    console.warn(`  ⚠ Could not update env vars via node-deployment endpoint (${err.message})`);
    console.warn('    Env vars set during app creation will be used instead — this is fine.');
  }
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

  if (!SA_TOKEN) {
    console.error('✗ SERVERAVATAR_TOKEN not set in .env');
    process.exit(1);
  }
  if (!BOT_TOKEN || !GROK_KEY) {
    console.error('✗ TELEGRAM_BOT_TOKEN and GROK_API_KEY must be set in .env');
    process.exit(1);
  }

  try {
    const org    = await getOrganization();
    const server = await getServer(org.id);
    const app    = await createApplication(org.id, server.id);

    await connectGit(org.id, server.id, app.id);
    await updateEnvVars(org.id, server.id, app.id);
    await triggerDeploy(org.id, server.id, app.id);

    console.log(`
✅ TinaAi is deploying!

  App name : ${APP_NAME}
  Server   : ${server.name} (${server.ip})
  Repo     : ${REPO} @ ${BRANCH}
  Start cmd: node bot.js (inside TinaAi/telegram/)

The bot will be live in ~1-2 minutes once deployment finishes.
Check the ServerAvatar dashboard for logs.
`);
  } catch (err) {
    console.error('\n✗ Deployment failed:', err.message);
    process.exit(1);
  }
}

main();
