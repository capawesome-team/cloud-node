import type { HttpClient, QueryParams } from '../http-client';

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
   * precedence when both are provided. Additional `query` parameters are only
   * forwarded when deleting by name, e.g. to disambiguate names that are only
   * unique in combination with other filters.
   */
  protected async deleteByIdOrName(options: {
    collectionPath: string;
    id?: string;
    name?: string;
    resource: string;
    query?: QueryParams;
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
        query: { ...options.query, name: options.name },
      });
      return;
    }
    throw new Error(`Either an id or a name is required to delete a ${options.resource}.`);
  }
}
