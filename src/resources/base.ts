import type { HttpClient } from '../http-client';

/**
 * Base class for all API resources, holding the shared HTTP client.
 */
export abstract class BaseResource {
  protected readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }
}
