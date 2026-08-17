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
  /**
   * Filter automations by name.
   */
  name?: string;
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
  /**
   * The name of the certificate to use. Ignored if `appCertificateId` is set.
   */
  appCertificateName?: string;
  appChannelId?: string;
  /**
   * The name of the channel to deploy to. Ignored if `appChannelId` is set.
   */
  appChannelName?: string;
  appConfigurationId?: string;
  /**
   * The name of the configuration to use. Ignored if `appConfigurationId` is
   * set.
   */
  appConfigurationName?: string;
  appDestinationId?: string;
  /**
   * The name of the destination to deploy to. Ignored if `appDestinationId` is
   * set.
   */
  appDestinationName?: string;
  appEnvironmentId?: string;
  /**
   * The name of the environment to use. Ignored if `appEnvironmentId` is set.
   */
  appEnvironmentName?: string;
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
        name: options.name,
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
