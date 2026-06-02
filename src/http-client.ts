import { CapawesomeCloudError } from './errors';

export const DEFAULT_BASE_URL = 'https://api.cloud.capawesome.io';
export const DEFAULT_TIMEOUT = 60_000;
export const DEFAULT_MAX_RETRIES = 3;

const RETRY_BASE_DELAY = 300;
const RETRY_MAX_DELAY = 10_000;
const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'PUT', 'DELETE']);

export interface HttpClientOptions {
  /**
   * The API token used to authenticate requests.
   *
   * Tokens can be created in the Capawesome Cloud Console at
   * https://console.cloud.capawesome.io/settings/tokens.
   */
  token: string;
  /**
   * The base URL of the Capawesome Cloud API.
   *
   * @default 'https://api.cloud.capawesome.io'
   */
  baseUrl?: string;
  /**
   * The request timeout in milliseconds. Does not apply to streamed downloads.
   *
   * @default 60000
   */
  timeout?: number;
  /**
   * The maximum number of retries for transient failures (network errors,
   * `429`, and `5xx` responses) on idempotent requests.
   *
   * @default 3
   */
  maxRetries?: number;
}

export type QueryValue = string | number | boolean | string[] | undefined | null;

export type QueryParams = Record<string, QueryValue>;

export interface RequestOptions {
  method: string;
  path: string;
  query?: QueryParams;
  body?: unknown;
  formData?: FormData;
}

/**
 * Thin wrapper around `fetch` that handles authentication, query/body
 * serialization, timeouts, retries, and error mapping. Used internally by all
 * resources.
 */
export class HttpClient {
  private readonly token: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly maxRetries: number;

  constructor(options: HttpClientOptions) {
    this.token = options.token.trim();
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  }

  /**
   * Performs a request and parses the JSON response body.
   */
  public async request<T>(options: RequestOptions): Promise<T> {
    const response = await this.fetch(options, true);
    if (response.status === 204) {
      return undefined as T;
    }
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }

  /**
   * Performs a request and returns the raw response body as a stream. Used for
   * binary downloads (artifacts, build sources).
   */
  public async requestStream(options: RequestOptions): Promise<ReadableStream<Uint8Array>> {
    const response = await this.fetch(options, false);
    if (!response.body) {
      throw new CapawesomeCloudError(response.status, response.statusText, undefined);
    }
    return response.body;
  }

  private async fetch(options: RequestOptions, applyTimeout: boolean): Promise<Response> {
    const url = this.createUrl(options.path, options.query);
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/json',
    };
    let body: FormData | string | undefined;
    if (options.formData) {
      body = options.formData;
    } else if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(options.body);
    }
    const isIdempotent = IDEMPOTENT_METHODS.has(options.method);

    for (let attempt = 0; ; attempt++) {
      let response: Response;
      try {
        response = await fetch(url, {
          method: options.method,
          headers,
          body,
          signal: applyTimeout ? AbortSignal.timeout(this.timeout) : undefined,
        });
      } catch (error) {
        if (isIdempotent && attempt < this.maxRetries) {
          await delay(backoffDelay(attempt));
          continue;
        }
        throw error;
      }

      if (!response.ok) {
        if (isIdempotent && attempt < this.maxRetries && isRetriableStatus(response.status)) {
          const retryAfter = parseRetryAfter(response.headers.get('retry-after'));
          await response.body?.cancel();
          await delay(retryAfter ?? backoffDelay(attempt));
          continue;
        }
        throw await this.createError(response);
      }

      return response;
    }
  }

  private createUrl(path: string, query?: QueryParams): string {
    const url = new URL(path, this.baseUrl);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) {
          continue;
        }
        if (Array.isArray(value)) {
          for (const item of value) {
            url.searchParams.append(key, item);
          }
        } else {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private async createError(response: Response): Promise<CapawesomeCloudError> {
    let body: unknown;
    const text = await response.text();
    try {
      body = text ? JSON.parse(text) : undefined;
    } catch {
      body = text;
    }
    return new CapawesomeCloudError(response.status, response.statusText, body);
  }
}

function isRetriableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

function backoffDelay(attempt: number): number {
  const ceiling = Math.min(RETRY_MAX_DELAY, RETRY_BASE_DELAY * 2 ** attempt);
  // Full jitter: a random value in [ceiling / 2, ceiling] to avoid thundering herds.
  return ceiling / 2 + Math.random() * (ceiling / 2);
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }
  const seconds = Number(value);
  if (!Number.isNaN(seconds)) {
    return seconds * 1000;
  }
  const date = Date.parse(value);
  if (!Number.isNaN(date)) {
    return Math.max(0, date - Date.now());
  }
  return undefined;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
