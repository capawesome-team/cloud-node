import type { HttpClient } from '../http-client';

/**
 * Base class for all API resources, holding the shared HTTP client.
 */
export abstract class BaseResource {
  protected readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * Deletes a resource either by its id or by its unique name. The id takes
   * precedence when both are provided.
   */
  protected async deleteByIdOrName(options: {
    collectionPath: string;
    id?: string;
    name?: string;
    resource: string;
  }): Promise<void> {
    if (options.id) {
      await this.http.request<void>({
        method: 'DELETE',
        path: `${options.collectionPath}/${options.id}`,
      });
      return;
    }
    if (options.name) {
      await this.http.request<void>({
        method: 'DELETE',
        path: options.collectionPath,
        query: { name: options.name },
      });
      return;
    }
    throw new Error(`Either an id or a name is required to delete a ${options.resource}.`);
  }
}
