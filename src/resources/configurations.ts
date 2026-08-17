import type { PaginationOptions } from '../types';
import { BaseResource } from './base';

/**
 * A configuration overwriting the native app configuration during a build.
 */
export interface AppConfiguration {
  id: string;
  appId: string;
  name: string;
  /**
   * The display name of the native app.
   */
  displayName: string | null;
  /**
   * The package name (Android) or bundle id (iOS) of the native app.
   */
  packageName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListConfigurationsOptions extends PaginationOptions {
  appId: string;
  /**
   * Filter configurations by name.
   */
  name?: string;
  /**
   * Filter configurations by a search query, matching the id or name.
   */
  query?: string;
}

export interface GetConfigurationOptions {
  appId: string;
  configurationId: string;
}

export interface CreateConfigurationOptions {
  appId: string;
  name: string;
  displayName?: string | null;
  packageName?: string | null;
}

export interface UpdateConfigurationOptions {
  appId: string;
  configurationId: string;
  name?: string;
  displayName?: string | null;
  packageName?: string | null;
}

export interface DeleteConfigurationOptions {
  appId: string;
  /**
   * The id of the configuration to delete. Either `configurationId` or `name`
   * must be provided; `configurationId` takes precedence.
   */
  configurationId?: string;
  /**
   * The name of the configuration to delete. Either `configurationId` or
   * `name` must be provided; `configurationId` takes precedence.
   */
  name?: string;
}

export class ConfigurationsResource extends BaseResource {
  /**
   * Get app configurations.
   */
  public async list(options: ListConfigurationsOptions): Promise<AppConfiguration[]> {
    return this.http.request<AppConfiguration[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/configurations`,
      query: {
        name: options.name,
        query: options.query,
        limit: options.limit,
        offset: options.offset,
      },
    });
  }

  /**
   * Get an app configuration by id.
   */
  public async get(options: GetConfigurationOptions): Promise<AppConfiguration> {
    return this.http.request<AppConfiguration>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/configurations/${options.configurationId}`,
    });
  }

  /**
   * Create a new app configuration.
   */
  public async create(options: CreateConfigurationOptions): Promise<AppConfiguration> {
    const { appId, ...body } = options;
    return this.http.request<AppConfiguration>({
      method: 'POST',
      path: `/v1/apps/${appId}/configurations`,
      body,
    });
  }

  /**
   * Update an app configuration.
   */
  public async update(options: UpdateConfigurationOptions): Promise<AppConfiguration> {
    const { appId, configurationId, ...body } = options;
    return this.http.request<AppConfiguration>({
      method: 'PATCH',
      path: `/v1/apps/${appId}/configurations/${configurationId}`,
      body,
    });
  }

  /**
   * Delete an app configuration by id or name.
   */
  public async delete(options: DeleteConfigurationOptions): Promise<void> {
    await this.deleteByIdOrName({
      collectionPath: `/v1/apps/${options.appId}/configurations`,
      id: options.configurationId,
      name: options.name,
      resource: 'configuration',
    });
  }
}
