/**
 * Demonstrates error handling by requesting a non-existent app.
 *
 * Run with:
 *   CAPAWESOME_CLOUD_TOKEN=<token> npx tsx examples/error-handling.ts
 */
import { CapawesomeCloud, CapawesomeCloudError } from '../src/index';

const token = process.env.CAPAWESOME_CLOUD_TOKEN;
if (!token) {
  throw new Error('Missing CAPAWESOME_CLOUD_TOKEN environment variable.');
}

const client = new CapawesomeCloud({ token });

try {
  await client.apps.get({ appId: '00000000-0000-0000-0000-000000000000' });
  console.log('Unexpected success — the app should not exist.');
} catch (error) {
  if (error instanceof CapawesomeCloudError) {
    console.log(`Request failed as expected: ${error.status} ${error.message}`);
  } else {
    throw error;
  }
}
