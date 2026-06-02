import { BaseResource } from './base';

/**
 * A secret belonging to an environment.
 *
 * The secret's value is never returned by the API.
 */
export interface AppEnvironmentSecret {
  id: string;
  appEnvironmentId: string;
  key: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListEnvironmentSecretsOptions {
  appId: string;
  environmentId: string;
}

export interface CreateEnvironmentSecretOptions {
  appId: string;
  environmentId: string;
  key: string;
  value: string;
}

export interface UpdateEnvironmentSecretOptions {
  appId: string;
  environmentId: string;
  secretId: string;
  key?: string;
  value?: string;
}

export interface DeleteEnvironmentSecretOptions {
  appId: string;
  environmentId: string;
  secretId: string;
}

export class EnvironmentSecretsResource extends BaseResource {
  /**
   * Get app environment secrets.
   */
  public async list(options: ListEnvironmentSecretsOptions): Promise<AppEnvironmentSecret[]> {
    return this.http.request<AppEnvironmentSecret[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/environments/${options.environmentId}/secrets`,
    });
  }

  /**
   * Create a new app environment secret.
   */
  public async create(options: CreateEnvironmentSecretOptions): Promise<AppEnvironmentSecret> {
    const { appId, environmentId, ...body } = options;
    return this.http.request<AppEnvironmentSecret>({
      method: 'POST',
      path: `/v1/apps/${appId}/environments/${environmentId}/secrets`,
      body,
    });
  }

  /**
   * Update an app environment secret.
   */
  public async update(options: UpdateEnvironmentSecretOptions): Promise<AppEnvironmentSecret> {
    const { appId, environmentId, secretId, ...body } = options;
    return this.http.request<AppEnvironmentSecret>({
      method: 'PATCH',
      path: `/v1/apps/${appId}/environments/${environmentId}/secrets/${secretId}`,
      body,
    });
  }

  /**
   * Delete an app environment secret.
   */
  public async delete(options: DeleteEnvironmentSecretOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/apps/${options.appId}/environments/${options.environmentId}/secrets/${options.secretId}`,
    });
  }
}
