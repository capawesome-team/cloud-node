import type { PaginationOptions } from '../types';
import { BaseResource } from './base';

/**
 * A channel used to distribute live update bundles.
 */
export interface AppChannel {
  id: string;
  appId: string;
  name: string;
  /**
   * The id of the active deployment.
   */
  appDeploymentId: string | null;
  /**
   * The date the channel was paused, or `null` if it is active.
   */
  pausedAt: string | null;
  totalAppDeployments: number;
  totalAppDevices: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListChannelsOptions extends PaginationOptions {
  appId: string;
  /**
   * Filter channels by name.
   */
  name?: string;
  /**
   * Filter channels by a search query.
   */
  query?: string;
}

export interface GetChannelOptions {
  appId: string;
  channelId: string;
}

export interface CreateChannelOptions {
  appId: string;
  name: string;
  /**
   * The date the channel expires at, as an ISO string or Unix timestamp.
   */
  expiresAt?: string | number;
  /**
   * Whether the channel requires a code-signed bundle.
   */
  protected?: boolean;
}

export interface UpdateChannelOptions {
  appId: string;
  channelId: string;
  name?: string;
  expiresAt?: string | number;
  protected?: boolean;
}

export interface DeleteChannelOptions {
  appId: string;
  channelId: string;
}

export interface PauseChannelOptions {
  appId: string;
  channelId: string;
}

export interface ResumeChannelOptions {
  appId: string;
  channelId: string;
}

export class ChannelsResource extends BaseResource {
  /**
   * Get app channels.
   */
  public async list(options: ListChannelsOptions): Promise<AppChannel[]> {
    return this.http.request<AppChannel[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/channels`,
      query: {
        name: options.name,
        query: options.query,
        limit: options.limit,
        offset: options.offset,
      },
    });
  }

  /**
   * Get an app channel by id.
   */
  public async get(options: GetChannelOptions): Promise<AppChannel> {
    return this.http.request<AppChannel>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/channels/${options.channelId}`,
    });
  }

  /**
   * Create a new app channel.
   */
  public async create(options: CreateChannelOptions): Promise<AppChannel> {
    const { appId, ...body } = options;
    return this.http.request<AppChannel>({
      method: 'POST',
      path: `/v1/apps/${appId}/channels`,
      body,
    });
  }

  /**
   * Update an app channel.
   */
  public async update(options: UpdateChannelOptions): Promise<AppChannel> {
    const { appId, channelId, ...body } = options;
    return this.http.request<AppChannel>({
      method: 'PATCH',
      path: `/v1/apps/${appId}/channels/${channelId}`,
      body,
    });
  }

  /**
   * Delete an app channel.
   */
  public async delete(options: DeleteChannelOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/apps/${options.appId}/channels/${options.channelId}`,
    });
  }

  /**
   * Pause an app channel.
   */
  public async pause(options: PauseChannelOptions): Promise<void> {
    await this.http.request<void>({
      method: 'POST',
      path: `/v1/apps/${options.appId}/channels/${options.channelId}/pause`,
    });
  }

  /**
   * Resume a paused app channel.
   */
  public async resume(options: ResumeChannelOptions): Promise<void> {
    await this.http.request<void>({
      method: 'POST',
      path: `/v1/apps/${options.appId}/channels/${options.channelId}/resume`,
    });
  }
}
