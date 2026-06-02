import { BaseResource } from './base';

/**
 * A variable belonging to an environment.
 */
export interface AppEnvironmentVariable {
  id: string;
  appEnvironmentId: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListEnvironmentVariablesOptions {
  appId: string;
  environmentId: string;
}

export interface CreateEnvironmentVariableOptions {
  appId: string;
  environmentId: string;
  key: string;
  value: string;
}

export interface UpdateEnvironmentVariableOptions {
  appId: string;
  environmentId: string;
  variableId: string;
  key?: string;
  value?: string;
}

export interface DeleteEnvironmentVariableOptions {
  appId: string;
  environmentId: string;
  variableId: string;
}

export class EnvironmentVariablesResource extends BaseResource {
  /**
   * Get app environment variables.
   */
  public async list(options: ListEnvironmentVariablesOptions): Promise<AppEnvironmentVariable[]> {
    return this.http.request<AppEnvironmentVariable[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/environments/${options.environmentId}/variables`,
    });
  }

  /**
   * Create a new app environment variable.
   */
  public async create(options: CreateEnvironmentVariableOptions): Promise<AppEnvironmentVariable> {
    const { appId, environmentId, ...body } = options;
    return this.http.request<AppEnvironmentVariable>({
      method: 'POST',
      path: `/v1/apps/${appId}/environments/${environmentId}/variables`,
      body,
    });
  }

  /**
   * Update an app environment variable.
   */
  public async update(options: UpdateEnvironmentVariableOptions): Promise<AppEnvironmentVariable> {
    const { appId, environmentId, variableId, ...body } = options;
    return this.http.request<AppEnvironmentVariable>({
      method: 'PATCH',
      path: `/v1/apps/${appId}/environments/${environmentId}/variables/${variableId}`,
      body,
    });
  }

  /**
   * Delete an app environment variable.
   */
  public async delete(options: DeleteEnvironmentVariableOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/apps/${options.appId}/environments/${options.environmentId}/variables/${options.variableId}`,
    });
  }
}
