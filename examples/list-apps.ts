/**
 * Lists your apps and prints the channels of the first one.
 *
 * Run with:
 *   CAPAWESOME_CLOUD_TOKEN=<token> npx tsx examples/list-apps.ts
 */
import { CapawesomeCloud } from '../src/index';

const token = process.env.CAPAWESOME_CLOUD_TOKEN;
if (!token) {
  throw new Error('Missing CAPAWESOME_CLOUD_TOKEN environment variable.');
}

const organizationId = process.env.CAPAWESOME_CLOUD_ORGANIZATION_ID;
if (!organizationId) {
  throw new Error('Missing CAPAWESOME_CLOUD_ORGANIZATION_ID environment variable.');
}

const client = new CapawesomeCloud({ token });

const apps = await client.apps.list({ organizationId, limit: 10 });
console.log(`Found ${apps.length} app(s):`);
for (const app of apps) {
  console.log(`- ${app.name} (${app.id}) [${app.type}]`);
}

const [firstApp] = apps;
if (firstApp) {
  const channels = await client.apps.channels.list({ appId: firstApp.id });
  console.log(`\nChannels for "${firstApp.name}":`);
  for (const channel of channels) {
    console.log(`- ${channel.name} (${channel.id})`);
  }
}
