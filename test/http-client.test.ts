import { afterEach, describe, expect, it, vi } from 'vitest';
import { CapawesomeCloud, CapawesomeCloudError } from '../src/index';
import { mockFetchJson } from './helpers';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('HttpClient', () => {
  it('sends the bearer token and base url', async () => {
    const { getLastRequest } = mockFetchJson([]);
    const client = new CapawesomeCloud({ token: 'test-token' });

    await client.apps.list();

    const { url, init } = getLastRequest();
    expect(url).toBe('https://api.cloud.capawesome.io/v1/apps');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer test-token');
  });

  it('respects a custom base url', async () => {
    const { getLastRequest } = mockFetchJson([]);
    const client = new CapawesomeCloud({ token: 't', baseUrl: 'https://example.com' });

    await client.apps.list();

    expect(getLastRequest().url).toBe('https://example.com/v1/apps');
  });

  it('serializes query parameters and skips undefined values', async () => {
    const { getLastRequest } = mockFetchJson([]);
    const client = new CapawesomeCloud({ token: 't' });

    await client.apps.channels.list({ appId: 'app-1', name: 'production', limit: 5 });

    const url = new URL(getLastRequest().url);
    expect(url.pathname).toBe('/v1/apps/app-1/channels');
    expect(url.searchParams.get('name')).toBe('production');
    expect(url.searchParams.get('limit')).toBe('5');
    expect(url.searchParams.has('offset')).toBe(false);
  });

  it('throws a CapawesomeCloudError on a non-2xx response', async () => {
    mockFetchJson({ message: 'App not found.' }, 404);
    const client = new CapawesomeCloud({ token: 't' });

    await expect(client.apps.get({ appId: 'missing' })).rejects.toMatchObject({
      name: 'CapawesomeCloudError',
      status: 404,
      message: 'App not found.',
    });
  });

  it('exposes the parsed error body', async () => {
    mockFetchJson({ message: 'Not authorized.' }, 403);
    const client = new CapawesomeCloud({ token: 't' });

    const error = await client.apps.list().catch((value: unknown) => value);
    expect(error).toBeInstanceOf(CapawesomeCloudError);
    expect((error as CapawesomeCloudError).body).toEqual({ message: 'Not authorized.' });
  });

  it('resolves to undefined for an empty response body without a content-length header', async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const client = new CapawesomeCloud({ token: 't' });

    await expect(
      client.apps.channels.pause({ appId: 'app-1', channelId: 'c-1' }),
    ).resolves.toBeUndefined();
  });
});
