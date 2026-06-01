import type { PaginationOptions } from '../types';
import { BaseResource } from './base';

/**
 * The platform a destination targets.
 */
export type AppDestinationPlatform = 'android' | 'ios';

/**
 * The Google Play release track.
 */
export type GooglePlayTrack = 'internal' | 'alpha' | 'beta' | 'production';

/**
 * A destination used to publish builds to an app store.
 */
export interface AppDestination {
  id: string;
  appId: string;
  name: string;
  platform: AppDestinationPlatform;
  createdAt: string;
  updatedAt: string;
}

export interface ListDestinationsOptions extends PaginationOptions {
  appId: string;
  name?: string;
  platform?: AppDestinationPlatform;
  query?: string;
}

export interface GetDestinationOptions {
  appId: string;
  destinationId: string;
}

export interface CreateDestinationOptions {
  appId: string;
  name: string;
  platform?: AppDestinationPlatform;
  androidBuildArtifactType?: 'aab' | 'apk';
  androidPackageName?: string;
  androidReleaseStatus?: 'completed' | 'draft';
  googlePlayTrack?: GooglePlayTrack;
  appGoogleServiceAccountKeyId?: string;
  appAppleApiKeyId?: string;
  appleApiKeyId?: string;
  appleIssuerId?: string;
  appleId?: string;
  appleAppPassword?: string;
  appleAppId?: string;
  appleTeamId?: string;
}

export interface UpdateDestinationOptions extends Partial<CreateDestinationOptions> {
  appId: string;
  destinationId: string;
}

export interface DeleteDestinationOptions {
  appId: string;
  destinationId: string;
}

export class DestinationsResource extends BaseResource {
  /**
   * Get app destinations.
   */
  public async list(options: ListDestinationsOptions): Promise<AppDestination[]> {
    return this.http.request<AppDestination[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/destinations`,
      query: {
        name: options.name,
        platform: options.platform,
        query: options.query,
        limit: options.limit,
        offset: options.offset,
      },
    });
  }

  /**
   * Get an app destination by id.
   */
  public async get(options: GetDestinationOptions): Promise<AppDestination> {
    return this.http.request<AppDestination>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/destinations/${options.destinationId}`,
    });
  }

  /**
   * Create a new app destination.
   */
  public async create(options: CreateDestinationOptions): Promise<AppDestination> {
    const { appId, ...body } = options;
    return this.http.request<AppDestination>({
      method: 'POST',
      path: `/v1/apps/${appId}/destinations`,
      body,
    });
  }

  /**
   * Update an app destination.
   */
  public async update(options: UpdateDestinationOptions): Promise<AppDestination> {
    const { appId, destinationId, ...body } = options;
    return this.http.request<AppDestination>({
      method: 'PATCH',
      path: `/v1/apps/${appId}/destinations/${destinationId}`,
      body,
    });
  }

  /**
   * Delete an app destination.
   */
  public async delete(options: DeleteDestinationOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/apps/${options.appId}/destinations/${options.destinationId}`,
    });
  }
}
