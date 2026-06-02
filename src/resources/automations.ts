import type { AppBuildType, BuildStack, PaginationOptions, Platform } from '../types';
import { BaseResource } from './base';

/**
 * The event that triggers an automation.
 */
export type AppAutomationTriggerType = 'branch' | 'tag';

/**
 * An automation that triggers native builds on Git events.
 */
export interface AppAutomation {
  id: string;
  appId: string;
  name: string;
  platform: Platform;
  enabled: boolean;
  triggerType: AppAutomationTriggerType;
  triggerPattern: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListAutomationsOptions extends PaginationOptions {
  appId: string;
  platform?: Platform;
  query?: string;
}

export interface GetAutomationOptions {
  appId: string;
  automationId: string;
}

export interface CreateAutomationOptions {
  appId: string;
  name: string;
  triggerType: AppAutomationTriggerType;
  triggerPattern?: string;
  commitMessagePattern?: string;
  platform?: Platform;
  buildType?: AppBuildType;
  buildStack?: BuildStack;
  appCertificateId?: string;
  appChannelId?: string;
  appDestinationId?: string;
  appEnvironmentId?: string;
}

export interface UpdateAutomationOptions extends Partial<CreateAutomationOptions> {
  appId: string;
  automationId: string;
  enabled?: boolean;
}

export interface DeleteAutomationOptions {
  appId: string;
  automationId: string;
}

export class AutomationsResource extends BaseResource {
  /**
   * Get app automations.
   */
  public async list(options: ListAutomationsOptions): Promise<AppAutomation[]> {
    return this.http.request<AppAutomation[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/automations`,
      query: {
        platform: options.platform,
        query: options.query,
        limit: options.limit,
        offset: options.offset,
      },
    });
  }

  /**
   * Get an app automation by id.
   */
  public async get(options: GetAutomationOptions): Promise<AppAutomation> {
    return this.http.request<AppAutomation>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/automations/${options.automationId}`,
    });
  }

  /**
   * Create a new app automation.
   */
  public async create(options: CreateAutomationOptions): Promise<AppAutomation> {
    const { appId, ...body } = options;
    return this.http.request<AppAutomation>({
      method: 'POST',
      path: `/v1/apps/${appId}/automations`,
      body,
    });
  }

  /**
   * Update an app automation.
   */
  public async update(options: UpdateAutomationOptions): Promise<AppAutomation> {
    const { appId, automationId, ...body } = options;
    return this.http.request<AppAutomation>({
      method: 'PATCH',
      path: `/v1/apps/${appId}/automations/${automationId}`,
      body,
    });
  }

  /**
   * Delete an app automation.
   */
  public async delete(options: DeleteAutomationOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/apps/${options.appId}/automations/${options.automationId}`,
    });
  }
}
