import type { HttpClient } from '../http-client';
import type { PaginationOptions } from '../types';
import { BaseResource } from './base';
import { EnvironmentSecretsResource } from './environment-secrets';
import { EnvironmentVariablesResource } from './environment-variables';

/**
 * An environment grouping secrets and variables for native builds.
 */
export interface AppEnvironment {
  id: string;
  appId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListEnvironmentsOptions extends PaginationOptions {
  appId: string;
  query?: string;
}

export interface GetEnvironmentOptions {
  appId: string;
  environmentId: string;
}

export interface CreateEnvironmentOptions {
  appId: string;
  name: string;
}

export interface UpdateEnvironmentOptions {
  appId: string;
  environmentId: string;
  name?: string;
}

export class EnvironmentsResource extends BaseResource {
  /**
   * Access environment secrets.
   */
  public readonly secrets: EnvironmentSecretsResource;
  /**
   * Access environment variables.
   */
  public readonly variables: EnvironmentVariablesResource;

  constructor(http: HttpClient) {
    super(http);
    this.secrets = new EnvironmentSecretsResource(http);
    this.variables = new EnvironmentVariablesResource(http);
  }

  /**
   * Get app environments.
   */
  public async list(options: ListEnvironmentsOptions): Promise<AppEnvironment[]> {
    return this.http.request<AppEnvironment[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/environments`,
      query: { query: options.query, limit: options.limit, offset: options.offset },
    });
  }

  /**
   * Get an app environment by id.
   */
  public async get(options: GetEnvironmentOptions): Promise<AppEnvironment> {
    return this.http.request<AppEnvironment>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/environments/${options.environmentId}`,
    });
  }

  /**
   * Create a new app environment.
   */
  public async create(options: CreateEnvironmentOptions): Promise<AppEnvironment> {
    const { appId, ...body } = options;
    return this.http.request<AppEnvironment>({
      method: 'POST',
      path: `/v1/apps/${appId}/environments`,
      body,
    });
  }

  /**
   * Update an app environment.
   */
  public async update(options: UpdateEnvironmentOptions): Promise<AppEnvironment> {
    const { appId, environmentId, ...body } = options;
    return this.http.request<AppEnvironment>({
      method: 'PATCH',
      path: `/v1/apps/${appId}/environments/${environmentId}`,
      body,
    });
  }
}
