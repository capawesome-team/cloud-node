import type { GitProvider, PaginationOptions } from '../types';
import { BaseResource } from './base';

/**
 * The authentication method of a Git connection.
 */
export type GitConnectionAuthKind = 'basic' | 'github_app' | 'oauth' | 'token';

/**
 * The kind of a namespace a repository can live in.
 */
export type GitNamespaceKind = 'user' | 'organization' | 'group' | 'workspace' | 'project';

/**
 * A connection to a Git provider, used to access repositories.
 */
export interface GitConnection {
  id: string;
  organizationId: string;
  name: string;
  provider: GitProvider;
  authKind: GitConnectionAuthKind;
  /**
   * The username used for basic authentication.
   */
  authUsername: string | null;
  /**
   * The base URL of a self-hosted provider, or `null` for the cloud offering.
   */
  baseUrl: string | null;
  /**
   * Whether the connection may only be used by the user who created it.
   */
  restricted: boolean;
  /**
   * The date the credentials stopped working, or `null` if the connection works.
   */
  brokenAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * A repository that can be linked to an app.
 */
export interface GitRepository {
  id: string;
  name: string;
  namespace: string;
  /**
   * The path of the repository as used by the provider, e.g. `owner/name`.
   */
  path: string;
  private: boolean;
  webUrl: string;
  defaultBranch?: string;
}

/**
 * A namespace (user, organization, group, workspace or project) owning
 * repositories.
 */
export interface GitNamespace {
  id: string;
  name: string;
  slug: string;
  kind: GitNamespaceKind;
  parent?: string;
  avatarUrl?: string;
}

export interface ListGitConnectionsOptions extends PaginationOptions {
  organizationId: string;
  /**
   * Filter connections by name.
   */
  name?: string;
  provider?: GitProvider;
  /**
   * Filter connections by a search query, matching the name.
   */
  query?: string;
  restricted?: boolean;
}

export interface GetGitConnectionOptions {
  organizationId: string;
  gitConnectionId: string;
}

export interface CreateGitConnectionOptions {
  organizationId: string;
  provider: GitProvider;
  /**
   * The authentication method. Connections authenticated with a GitHub App
   * must be created in the Capawesome Cloud Console.
   */
  authKind: 'basic' | 'oauth' | 'token';
  /**
   * The name of the connection. Generated from the provider if omitted.
   */
  name?: string;
  /**
   * The base URL of a self-hosted provider. Not supported for `oauth`.
   */
  baseUrl?: string;
  /**
   * The access token. Required for `token`.
   */
  token?: string;
  /**
   * The username. Required for `basic`, except for the `git_http` provider.
   */
  username?: string;
  /**
   * The password. Required for `basic`, except for the `git_http` provider.
   */
  password?: string;
  /**
   * The id of the connected provider profile. Required for `oauth`.
   */
  userProviderProfileId?: string;
}

export interface UpdateGitConnectionOptions {
  organizationId: string;
  gitConnectionId: string;
  /**
   * The new authentication method. The matching credential must be sent along.
   */
  authKind?: 'basic' | 'token';
  name?: string;
  /**
   * The base URL of a self-hosted provider. Changing it requires sending the
   * credential again.
   */
  baseUrl?: string | null;
  token?: string;
  username?: string;
  password?: string;
}

export interface DeleteGitConnectionOptions {
  organizationId: string;
  gitConnectionId: string;
}

export interface ListGitRepositoriesOptions {
  organizationId: string;
  gitConnectionId: string;
  /**
   * Filter repositories by namespace. Required for the `azure_devops`
   * provider, where it must be `organization/project`.
   */
  namespace?: string;
  /**
   * Get a single repository by its path, e.g. `owner/name`.
   */
  path?: string;
  /**
   * Filter repositories by a search query.
   */
  query?: string;
}

export interface ListGitNamespacesOptions {
  organizationId: string;
  gitConnectionId: string;
  /**
   * The name of the Azure DevOps organization to list the namespaces of. If
   * omitted, the available organizations are returned instead.
   */
  organization?: string;
}

export class GitConnectionsResource extends BaseResource {
  /**
   * Get Git connections.
   */
  public async list(options: ListGitConnectionsOptions): Promise<GitConnection[]> {
    return this.http.request<GitConnection[]>({
      method: 'GET',
      path: `/v1/organizations/${options.organizationId}/git-connections`,
      query: {
        name: options.name,
        provider: options.provider,
        query: options.query,
        restricted: options.restricted,
        limit: options.limit,
        offset: options.offset,
      },
    });
  }

  /**
   * Get a Git connection by id.
   */
  public async get(options: GetGitConnectionOptions): Promise<GitConnection> {
    return this.http.request<GitConnection>({
      method: 'GET',
      path: `/v1/organizations/${options.organizationId}/git-connections/${options.gitConnectionId}`,
    });
  }

  /**
   * Create a new Git connection.
   */
  public async create(options: CreateGitConnectionOptions): Promise<GitConnection> {
    const { organizationId, ...body } = options;
    return this.http.request<GitConnection>({
      method: 'POST',
      path: `/v1/organizations/${organizationId}/git-connections`,
      body,
    });
  }

  /**
   * Update a Git connection.
   */
  public async update(options: UpdateGitConnectionOptions): Promise<GitConnection> {
    const { organizationId, gitConnectionId, ...body } = options;
    return this.http.request<GitConnection>({
      method: 'PATCH',
      path: `/v1/organizations/${organizationId}/git-connections/${gitConnectionId}`,
      body,
    });
  }

  /**
   * Delete a Git connection.
   */
  public async delete(options: DeleteGitConnectionOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/organizations/${options.organizationId}/git-connections/${options.gitConnectionId}`,
    });
  }

  /**
   * Get the repositories a Git connection has access to.
   */
  public async listRepositories(options: ListGitRepositoriesOptions): Promise<GitRepository[]> {
    return this.http.request<GitRepository[]>({
      method: 'GET',
      path: `/v1/organizations/${options.organizationId}/git-connections/${options.gitConnectionId}/repositories`,
      query: { namespace: options.namespace, path: options.path, query: options.query },
    });
  }

  /**
   * Get the namespaces a Git connection has access to.
   */
  public async listNamespaces(options: ListGitNamespacesOptions): Promise<GitNamespace[]> {
    return this.http.request<GitNamespace[]>({
      method: 'GET',
      path: `/v1/organizations/${options.organizationId}/git-connections/${options.gitConnectionId}/namespaces`,
      query: { organization: options.organization },
    });
  }
}
