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
