# Examples

Runnable scripts to try the SDK against the live Capawesome Cloud API.

## Prerequisites

- Node.js 20 or later
- An API token from the [Capawesome Cloud Console](https://console.cloud.capawesome.io/settings/tokens)

## Running

Set your token and run any script with [`tsx`](https://tsx.is):

```bash
export CAPAWESOME_CLOUD_TOKEN=<your-token>
export CAPAWESOME_CLOUD_ORGANIZATION_ID=<your-organization-id>
npx tsx examples/list-apps.ts
```

| Script              | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `list-apps.ts`      | Lists your apps and the channels of the first one.               |
| `error-handling.ts` | Shows how `CapawesomeCloudError` is thrown for a failed request. |

> These scripts import the SDK from `../src` so they run against the local source without a build step. In a real project, you would `import { CapawesomeCloud } from '@capawesome/cloud-sdk'` instead.
