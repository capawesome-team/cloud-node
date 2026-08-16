# @capawesome/cloud-sdk

[![npm version](https://img.shields.io/npm/v/@capawesome/cloud-sdk)](https://www.npmjs.com/package/@capawesome/cloud-sdk)
[![npm downloads](https://img.shields.io/npm/dm/@capawesome/cloud-sdk)](https://www.npmjs.com/package/@capawesome/cloud-sdk)
[![license](https://img.shields.io/npm/l/@capawesome/cloud-sdk)](https://github.com/capawesome-team/cloud-node/blob/main/LICENSE)

Node.js SDK for the [Capawesome Cloud](https://capawesome.io/cloud/) API.

It provides a fully typed, promise-based interface for managing organizations, apps, live update channels and deployments, native builds, app store destinations, and more.

> **Note:** The Capawesome Cloud API is still in development and may change without notice. Response types intentionally expose only the most relevant properties to minimize breaking changes.

## SDKs

Official SDKs for the Capawesome Cloud API:

| Language | Package                                                                        | Repository                                                      |
| -------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Node.js  | [`@capawesome/cloud-sdk`](https://www.npmjs.com/package/@capawesome/cloud-sdk) | [cloud-node](https://github.com/capawesome-team/cloud-node)     |
| Python   | [`capawesome-cloud`](https://pypi.org/project/capawesome-cloud/)               | [cloud-python](https://github.com/capawesome-team/cloud-python) |

## Installation

```bash
npm install @capawesome/cloud-sdk
```

**Requirements:** Node.js 20.19 or later. The package is published as ESM only, but can also be loaded from CommonJS via `require()`.

## Getting started

Create an API token in the [Capawesome Cloud Console](https://console.cloud.capawesome.io/settings/tokens) and pass it to the client:

```ts
import { CapawesomeCloud } from '@capawesome/cloud-sdk';

const client = new CapawesomeCloud({
  token: process.env.CAPAWESOME_TOKEN!,
});

const apps = await client.apps.list({ organizationId: process.env.CAPAWESOME_ORGANIZATION_ID! });
console.log(apps);
```

### Configuration

| Option       | Type           | Default                           | Description                                                                    |
| ------------ | -------------- | --------------------------------- | ------------------------------------------------------------------------------ |
| `token`      | `string`       | —                                 | API token used to authenticate.                                                |
| `baseUrl`    | `string`       | `https://api.cloud.capawesome.io` | Base URL of the API (for self-hosting/testing).                                |
| `timeout`    | `number`       | `60000`                           | Request timeout in milliseconds. Does not apply to streamed downloads.         |
| `maxRetries` | `number`       | `3`                               | Retries for transient failures (network, `429`, `5xx`) on idempotent requests. |
| `fetch`      | `typeof fetch` | `globalThis.fetch`                | The `fetch` implementation used for all requests.                              |

## Usage

All methods take a single options object and return a typed promise. Most operations are scoped to an app via `appId`.

### Organizations

```ts
const organizations = await client.organizations.list();
const members = await client.organizations.members.list({ organizationId });

// Invite a new member
await client.organizations.invitations.create({
  organizationId,
  email: 'jane@example.com',
  role: 'member',
});

// Group apps and members in a team
const team = await client.organizations.teams.create({ organizationId, name: 'Mobile' });
await client.organizations.teams.apps.create({ organizationId, teamId: team.id, appId });
```

### Apps

```ts
const apps = await client.apps.list({ organizationId });
const app = await client.apps.get({ appId });
const created = await client.apps.create({ name: 'My App', type: 'capacitor' });
await client.apps.update({ appId, name: 'Renamed App' });
await client.apps.delete({ appId });
```

### Live updates

```ts
// Create a channel
const channel = await client.apps.channels.create({ appId, name: 'production' });

// Pause / resume a channel
await client.apps.channels.pause({ appId, channelId: channel.id });
await client.apps.channels.resume({ appId, channelId: channel.id });
```

### Deployments

Promote a build to a channel (live updates) or a destination (app store publishing):

```ts
const deployment = await client.apps.deployments.create({
  appId,
  appBuildId,
  appChannelName: 'production',
  rolloutPercentage: 0.5,
});
```

### Git repositories

Native builds are created from the repository an app is linked to:

```ts
const [connection] = await client.organizations.gitConnections.list({ organizationId });
const repositories = await client.organizations.gitConnections.listRepositories({
  organizationId,
  gitConnectionId: connection.id,
});

await client.apps.repository.set({
  appId,
  gitConnectionId: connection.id,
  path: repositories[0].path,
});
```

### Native builds

```ts
const build = await client.apps.builds.create({
  appId,
  platform: 'ios',
  gitRef: 'main',
});

// Poll the job that processes the build
let job = await client.jobs.get({ jobId: build.jobId! });
while (job.status === 'queued' || job.status === 'pending' || job.status === 'in_progress') {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  job = await client.jobs.get({ jobId: job.id });
}

const logs = await client.jobs.getLogs({ jobId: job.id });

// Explain a failure
if (job.status === 'failed') {
  const { summary } = await client.jobs.getFailureSummary({ jobId: job.id });
  console.error(summary);
}
```

#### Build artifacts

Binary downloads return a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) so large files can be streamed to disk without buffering everything in memory:

```ts
import { Writable } from 'node:stream';
import { createWriteStream } from 'node:fs';

const stream = await client.apps.builds.artifacts.download({ appId, buildId, artifactId });
await stream.pipeTo(Writable.toWeb(createWriteStream('artifact.ipa')));
```

You can also obtain a signed, time-limited download URL:

```ts
const { url, expiresAt } = await client.apps.builds.artifacts.getSignedDownloadUrl({
  appId,
  buildId,
  artifactId,
});
```

#### Certificates

```ts
import { readFile } from 'node:fs/promises';

const certificate = await client.apps.certificates.create({
  appId,
  name: 'Distribution Certificate',
  platform: 'ios',
  type: 'production',
  file: await readFile('distribution.p12'),
  fileName: 'distribution.p12',
  password: process.env.CERT_PASSWORD,
});
```

#### Environments, secrets & variables

```ts
const environment = await client.apps.environments.create({ appId, name: 'production' });

await client.apps.environments.secrets.create({
  appId,
  environmentId: environment.id,
  key: 'API_KEY',
  value: process.env.API_KEY!,
});

await client.apps.environments.variables.create({
  appId,
  environmentId: environment.id,
  key: 'API_URL',
  value: 'https://api.example.com',
});
```

## Available resources

Resources mirror the API's path hierarchy. App-scoped resources are nested under `client.apps.*`, organization-scoped resources under `client.organizations.*`; top-level resources are exposed directly on the client.

| Resource                              | Description                                       |
| ------------------------------------- | ------------------------------------------------- |
| `client.apps`                         | Create, read, update, delete and transfer apps.   |
| `client.apps.channels`                | Manage live update channels (incl. pause/resume). |
| `client.apps.deployments`             | Promote builds to channels or destinations.       |
| `client.apps.builds`                  | Trigger and manage native builds.                 |
| `client.apps.builds.artifacts`        | List and download build artifacts.                |
| `client.apps.buildSources`            | Register and download native build sources.       |
| `client.apps.certificates`            | Manage signing certificates.                      |
| `client.apps.destinations`            | Manage app store publishing destinations.         |
| `client.apps.environments`            | Manage environments, secrets and variables.       |
| `client.apps.automations`             | Manage build automations.                         |
| `client.apps.devices`                 | Manage registered devices.                        |
| `client.apps.webhooks`                | Manage app webhooks.                              |
| `client.apps.configurations`          | Manage native app configurations.                 |
| `client.apps.repository`              | Link an app to a Git repository.                  |
| `client.organizations`                | Create, read and update organizations.            |
| `client.organizations.members`        | Manage organization members.                      |
| `client.organizations.invitations`    | Invite users to an organization.                  |
| `client.organizations.teams`          | Manage teams and their apps and members.          |
| `client.organizations.licenseKeys`    | Manage license keys for Insiders packages.        |
| `client.organizations.gitConnections` | Manage Git connections and browse repositories.   |
| `client.jobs`                         | Inspect background jobs and their logs.           |
| `client.users`                        | Access the authenticated user.                    |

## Error handling

Any non-2xx response is thrown as a `CapawesomeCloudError`:

```ts
import { CapawesomeCloudError } from '@capawesome/cloud-sdk';

try {
  await client.apps.get({ appId: 'unknown' });
} catch (error) {
  if (error instanceof CapawesomeCloudError) {
    console.error(error.status); // 404
    console.error(error.message); // "App not found."
    console.error(error.body); // { message: "App not found." }
  }
}
```

## Development

### Setup

Clone the repository and install the dependencies:

```bash
npm install
```

This also sets up the Git hooks (via [Husky](https://typicode.github.io/husky)), which run Prettier on staged files before every commit. Common scripts during development:

| Script              | Description                                 |
| ------------------- | ------------------------------------------- |
| `npm run build`     | Build the package into `dist/` with tsdown. |
| `npm run dev`       | Rebuild on change (watch mode).             |
| `npm run typecheck` | Type-check without emitting output.         |
| `npm run lint`      | Check formatting and lint rules.            |
| `npm run fmt`       | Auto-fix formatting and lint issues.        |

### Testing

Tests are written with [Vitest](https://vitest.dev) and live in the `test/` directory:

```bash
npm test          # run the suite once
npm run test:watch # re-run on change
```

### Publishing

Releases are automated with [Release Please](https://github.com/googleapis/release-please), which derives the next version and changelog entries from [Conventional Commits](https://www.conventionalcommits.org).

On every push to `main`, the [Release workflow](./.github/workflows/release.yml) creates or updates a release pull request that bumps the version and updates `CHANGELOG.md`. Merging that pull request creates the git tag and GitHub release, and publishes the package to npm.

## License

See [LICENSE](./LICENSE).
