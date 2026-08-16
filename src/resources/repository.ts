import type { GitProvider } from '../types';
import type { App } from './apps';
import { BaseResource } from './base';

/**
 * The Git repository an app is linked to.
 */
export interface AppGitRepository {
  id: string;
  appId: string;
  /**
   * The id of the Git connection used to access the repository.
   */
  gitConnectionId: string | null;
  name: string;
  /**
   * The path of the repository as used by the provider, e.g. `owner/name`.
   */
  path: string;
  provider: GitProvider;
  /**
   * The base URL of a self-hosted provider, or `null` for the cloud offering.
   */
  providerBaseUrl: string | null;
  providerRepositoryId: string;
  webUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetRepositoryOptions {
  appId: string;
}

export interface SetRepositoryOptions {
  appId: string;
  /**
   * The id of the Git connection used to access the repository.
   */
  gitConnectionId: string;
  /**
   * The path of the repository as used by the provider, e.g. `owner/name`.
   */
  path: string;
}

export interface DeleteRepositoryOptions {
  appId: string;
}

export class RepositoryResource extends BaseResource {
  /**
   * Get the repository an app is linked to.
   */
  public async get(options: GetRepositoryOptions): Promise<AppGitRepository> {
    return this.http.request<AppGitRepository>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/repository`,
    });
  }

  /**
   * Link an app to a repository, replacing the current link.
   */
  public async set(options: SetRepositoryOptions): Promise<App> {
    const { appId, ...body } = options;
    return this.http.request<App>({ method: 'PUT', path: `/v1/apps/${appId}/repository`, body });
  }

  /**
   * Unlink an app from its repository.
   */
  public async delete(options: DeleteRepositoryOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/apps/${options.appId}/repository`,
    });
  }
}
