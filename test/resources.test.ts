import { afterEach, describe, expect, it, vi } from 'vitest';
import { CapawesomeCloud } from '../src/index';
import { mockFetchJson } from './helpers';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('resources', () => {
  it('creates a channel with a JSON body', async () => {
    const { getLastRequest } = mockFetchJson({ id: 'channel-1', name: 'production' });
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.channels.create({ appId: 'app-1', name: 'production', protected: true });

    const { url, init } = getLastRequest();
    expect(init.method).toBe('POST');
    expect(url).toBe('https://api.cloud.capawesome.io/v1/apps/app-1/channels');
    expect(JSON.parse(init.body as string)).toEqual({ name: 'production', protected: true });
  });

  it('does not include the app id in the request body', async () => {
    const { getLastRequest } = mockFetchJson({ id: 'deployment-1' });
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.deployments.create({ appId: 'app-1', appBuildId: 'build-1' });

    expect(JSON.parse(getLastRequest().init.body as string)).toEqual({ appBuildId: 'build-1' });
  });

  it('creates a build with a configuration', async () => {
    const { getLastRequest } = mockFetchJson({ id: 'build-1' });
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.builds.create({
      appId: 'app-1',
      platform: 'ios',
      gitRef: 'main',
      appConfigurationId: 'configuration-1',
    });

    expect(JSON.parse(getLastRequest().init.body as string)).toEqual({
      platform: 'ios',
      gitRef: 'main',
      appConfigurationId: 'configuration-1',
    });
  });

  it('filters environments by name', async () => {
    const { getLastRequest } = mockFetchJson([]);
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.environments.list({ appId: 'app-1', name: 'production' });

    const url = new URL(getLastRequest().url);
    expect(url.pathname).toBe('/v1/apps/app-1/environments');
    expect(url.searchParams.get('name')).toBe('production');
  });

  it('filters automations by name', async () => {
    const { getLastRequest } = mockFetchJson([]);
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.automations.list({ appId: 'app-1', name: 'nightly' });

    expect(new URL(getLastRequest().url).searchParams.get('name')).toBe('nightly');
  });

  it('creates an automation with configuration and name references', async () => {
    const { getLastRequest } = mockFetchJson({ id: 'automation-1' });
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.automations.create({
      appId: 'app-1',
      name: 'nightly',
      triggerType: 'branch',
      appChannelName: 'production',
      appConfigurationId: 'configuration-1',
      appConfigurationName: 'ignored',
      appEnvironmentName: 'staging',
    });

    const { url, init } = getLastRequest();
    expect(url).toBe('https://api.cloud.capawesome.io/v1/apps/app-1/automations');
    expect(JSON.parse(init.body as string)).toEqual({
      name: 'nightly',
      triggerType: 'branch',
      appChannelName: 'production',
      appConfigurationId: 'configuration-1',
      appConfigurationName: 'ignored',
      appEnvironmentName: 'staging',
    });
  });

  it('builds nested environment secret paths', async () => {
    const { getLastRequest } = mockFetchJson({ id: 'secret-1', key: 'API_KEY' });
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.environments.secrets.create({
      appId: 'app-1',
      environmentId: 'env-1',
      key: 'API_KEY',
      value: 'secret',
    });

    const { url, init } = getLastRequest();
    expect(url).toBe('https://api.cloud.capawesome.io/v1/apps/app-1/environments/env-1/secrets');
    expect(JSON.parse(init.body as string)).toEqual({ key: 'API_KEY', value: 'secret' });
  });

  it('uploads a certificate as multipart form data', async () => {
    const { getLastRequest } = mockFetchJson({ id: 'cert-1', name: 'My Cert' });
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.certificates.create({
      appId: 'app-1',
      name: 'My Cert',
      file: new Uint8Array([1, 2, 3]),
      fileName: 'cert.p12',
      platform: 'ios',
    });

    const { init } = getLastRequest();
    expect(init.method).toBe('POST');
    expect(init.body).toBeInstanceOf(FormData);
    const formData = init.body as FormData;
    expect(formData.get('name')).toBe('My Cert');
    expect(formData.get('platform')).toBe('ios');
    expect(formData.get('file')).toBeInstanceOf(Blob);
    expect((formData.get('file') as File).name).toBe('cert.p12');
  });

  it('does not send a filename when none is provided', async () => {
    const { getLastRequest } = mockFetchJson({ id: 'cert-1', name: 'My Cert' });
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.certificates.create({
      appId: 'app-1',
      name: 'My Cert',
      file: new Uint8Array([1, 2, 3]),
    });

    const formData = getLastRequest().init.body as FormData;
    // Without an explicit filename, the platform default ("blob") is used — never "undefined".
    expect((formData.get('file') as File).name).not.toBe('undefined');
  });

  it('gets an organization by id', async () => {
    const { getLastRequest } = mockFetchJson({ id: 'org-1', name: 'Acme' });
    const client = new CapawesomeCloud({ token: 't' });

    await client.organizations.get({ organizationId: 'org-1' });

    const { url, init } = getLastRequest();
    expect(init.method).toBe('GET');
    expect(url).toBe('https://api.cloud.capawesome.io/v1/organizations/org-1');
  });

  it('builds nested organization team paths', async () => {
    const { getLastRequest } = mockFetchJson({ id: 'team-app-1' });
    const client = new CapawesomeCloud({ token: 't' });

    await client.organizations.teams.apps.create({
      organizationId: 'org-1',
      teamId: 'team-1',
      appId: 'app-1',
    });

    const { url, init } = getLastRequest();
    expect(url).toBe('https://api.cloud.capawesome.io/v1/organizations/org-1/teams/team-1/apps');
    expect(JSON.parse(init.body as string)).toEqual({ appId: 'app-1' });
  });

  it('requests team relations only when included', async () => {
    const { getLastRequest } = mockFetchJson({ id: 'team-1' });
    const client = new CapawesomeCloud({ token: 't' });

    await client.organizations.teams.get({ organizationId: 'org-1', teamId: 'team-1' });
    expect(new URL(getLastRequest().url).searchParams.has('relations')).toBe(false);

    await client.organizations.teams.get({
      organizationId: 'org-1',
      teamId: 'team-1',
      includeApps: true,
      includeMembers: true,
    });
    expect(new URL(getLastRequest().url).searchParams.get('relations')).toBe('apps,members');
  });

  it('requests the assigned packages of license keys', async () => {
    const { getLastRequest } = mockFetchJson([]);
    const client = new CapawesomeCloud({ token: 't' });

    await client.organizations.licenseKeys.list({
      organizationId: 'org-1',
      includePackages: true,
    });
    expect(new URL(getLastRequest().url).searchParams.get('relations')).toBe(
      'licenseKeyPackages,licenseKeyPackages.package',
    );

    await client.organizations.licenseKeys.get({
      organizationId: 'org-1',
      licenseKeyId: 'key-1',
      includePackages: true,
    });
    const { url } = getLastRequest();
    expect(new URL(url).pathname).toBe('/v1/organizations/org-1/license-keys/key-1');
    expect(new URL(url).searchParams.get('relations')).toBe(
      'licenseKeyPackages,licenseKeyPackages.package',
    );
  });

  it('links a repository with a put request', async () => {
    const { getLastRequest } = mockFetchJson({ id: 'app-1' });
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.repository.set({
      appId: 'app-1',
      gitConnectionId: 'connection-1',
      path: 'capawesome-team/cloud-node',
    });

    const { url, init } = getLastRequest();
    expect(init.method).toBe('PUT');
    expect(url).toBe('https://api.cloud.capawesome.io/v1/apps/app-1/repository');
    expect(JSON.parse(init.body as string)).toEqual({
      gitConnectionId: 'connection-1',
      path: 'capawesome-team/cloud-node',
    });
  });

  it('joins multiple job statuses into a single query parameter', async () => {
    const { getLastRequest } = mockFetchJson([]);
    const client = new CapawesomeCloud({ token: 't' });

    await client.jobs.list({ organizationId: 'org-1', status: ['queued', 'in_progress'] });
    expect(new URL(getLastRequest().url).searchParams.get('status')).toBe('queued,in_progress');

    await client.jobs.list({ organizationId: 'org-1', status: 'failed' });
    expect(new URL(getLastRequest().url).searchParams.get('status')).toBe('failed');
  });

  it('deletes a channel by id', async () => {
    const { getLastRequest } = mockFetchJson(null);
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.channels.delete({ appId: 'app-1', channelId: 'channel-1' });

    const { url, init } = getLastRequest();
    expect(init.method).toBe('DELETE');
    expect(url).toBe('https://api.cloud.capawesome.io/v1/apps/app-1/channels/channel-1');
  });

  it('deletes a channel by name via the collection endpoint', async () => {
    const { getLastRequest } = mockFetchJson(null);
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.channels.delete({ appId: 'app-1', name: 'production/staging' });

    const { url, init } = getLastRequest();
    expect(init.method).toBe('DELETE');
    const parsed = new URL(url);
    expect(parsed.pathname).toBe('/v1/apps/app-1/channels');
    expect(parsed.searchParams.get('name')).toBe('production/staging');
  });

  it('prefers the id over the name when deleting a certificate', async () => {
    const { getLastRequest } = mockFetchJson(null);
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.certificates.delete({
      appId: 'app-1',
      certificateId: 'certificate-1',
      name: 'ignored',
    });

    const parsed = new URL(getLastRequest().url);
    expect(parsed.pathname).toBe('/v1/apps/app-1/certificates/certificate-1');
    expect(parsed.searchParams.has('name')).toBe(false);
  });

  it('deletes an environment by name', async () => {
    const { getLastRequest } = mockFetchJson(null);
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.environments.delete({ appId: 'app-1', name: 'production' });

    const parsed = new URL(getLastRequest().url);
    expect(parsed.pathname).toBe('/v1/apps/app-1/environments');
    expect(parsed.searchParams.get('name')).toBe('production');
  });

  it('throws when deleting without an id or a name', async () => {
    mockFetchJson(null);
    const client = new CapawesomeCloud({ token: 't' });

    await expect(client.apps.destinations.delete({ appId: 'app-1' })).rejects.toThrow(
      'Either an id or a name is required to delete a destination.',
    );
  });

  it('cancels a job by updating its status', async () => {
    const { getLastRequest } = mockFetchJson({ id: 'job-1', status: 'canceled' });
    const client = new CapawesomeCloud({ token: 't' });

    await client.jobs.cancel({ jobId: 'job-1' });

    const { url, init } = getLastRequest();
    expect(init.method).toBe('PATCH');
    expect(url).toBe('https://api.cloud.capawesome.io/v1/jobs/job-1');
    expect(JSON.parse(init.body as string)).toEqual({ status: 'canceled' });
  });

  it('downloads a build artifact as a stream', async () => {
    const fetchMock = vi.fn(async () => new Response(new Uint8Array([1, 2, 3]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const client = new CapawesomeCloud({ token: 't' });

    const stream = await client.apps.builds.artifacts.download({
      appId: 'app-1',
      buildId: 'build-1',
      artifactId: 'artifact-1',
    });

    expect(stream).toBeInstanceOf(ReadableStream);
  });
});
