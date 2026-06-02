import { CapawesomeCloudError } from './errors';

export const DEFAULT_BASE_URL = 'https://api.cloud.capawesome.io';

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
 * serialization, and error mapping. Used internally by all resources.
 */
export class HttpClient {
  private readonly token: string;
  private readonly baseUrl: string;

  constructor(options: HttpClientOptions) {
    this.token = options.token;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  }

  /**
   * Performs a request and parses the JSON response body.
   */
  public async request<T>(options: RequestOptions): Promise<T> {
    const response = await this.fetch(options);
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
    const response = await this.fetch(options);
    if (!response.body) {
      throw new CapawesomeCloudError(response.status, response.statusText, undefined);
    }
    return response.body;
  }

  private async fetch(options: RequestOptions): Promise<Response> {
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
    const response = await fetch(url, { method: options.method, headers, body });
    if (!response.ok) {
      throw await this.createError(response);
    }
    return response;
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
