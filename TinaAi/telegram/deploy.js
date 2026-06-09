#!/usr/bin/env node
/**
 * Triggers a ServerAvatar git deployment via webhook.
 * Run from TinaAi/telegram/:  node deploy.js
 */

const WEBHOOK_URL = process.env.DEPLOY_WEBHOOK_URL
  || 'https://api.serveravatar.com/webhooks/git-deployments/P6fz3fmZN2e9TVSjas8jftl8Toaa1sde';

async function main() {
  console.log('\n🤖 TinaAi — Triggering ServerAvatar deployment\n');
  console.log(`  Webhook: ${WEBHOOK_URL}\n`);

  const res = await fetch(WEBHOOK_URL, { method: 'POST' });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { _raw: text }; }

  if (!res.ok) {
    console.error(`✗ Webhook POST → HTTP ${res.status}`);
    console.error(JSON.stringify(json, null, 2));
    process.exit(1);
  }

  console.log('✅ Deployment triggered!');
  console.log(JSON.stringify(json, null, 2));
  console.log('\nBot will be live in ~1–2 minutes.\n');
}

main().catch(err => {
  console.error('\n✗ Deployment failed:', err.message);
  process.exit(1);
});
