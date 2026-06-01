import type { PaginationOptions } from '../types';
import { BaseResource } from './base';

/**
 * A device that has installed the app.
 */
export interface AppDevice {
  id: string;
  appId: string;
  /**
   * The id of the channel the device is assigned to.
   */
  appChannelId: string | null;
  /**
   * The platform of the device (`0` = Android, `1` = iOS).
   */
  platform: number;
  appVersionName: string;
  appVersionCode: string;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListDevicesOptions extends PaginationOptions {
  appId: string;
  /**
   * Filter devices by id.
   */
  id?: string;
  query?: string;
}

export interface GetDeviceOptions {
  appId: string;
  deviceId: string;
}

export interface UpdateDeviceOptions {
  appId: string;
  deviceId: string;
  /**
   * The id of the channel to force the device onto.
   */
  forcedAppChannelId?: string | null;
}

export interface DeleteDeviceOptions {
  appId: string;
  deviceId: string;
}

export class DevicesResource extends BaseResource {
  /**
   * Get app devices.
   */
  public async list(options: ListDevicesOptions): Promise<AppDevice[]> {
    return this.http.request<AppDevice[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/devices`,
      query: {
        id: options.id,
        query: options.query,
        limit: options.limit,
        offset: options.offset,
      },
    });
  }

  /**
   * Get an app device by id.
   */
  public async get(options: GetDeviceOptions): Promise<AppDevice> {
    return this.http.request<AppDevice>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/devices/${options.deviceId}`,
    });
  }

  /**
   * Update an app device.
   */
  public async update(options: UpdateDeviceOptions): Promise<AppDevice> {
    const { appId, deviceId, ...body } = options;
    return this.http.request<AppDevice>({
      method: 'PATCH',
      path: `/v1/apps/${appId}/devices/${deviceId}`,
      body,
    });
  }

  /**
   * Delete an app device.
   */
  public async delete(options: DeleteDeviceOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/apps/${options.appId}/devices/${options.deviceId}`,
    });
  }
}
