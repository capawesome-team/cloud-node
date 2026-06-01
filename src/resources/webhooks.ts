import type { PaginationOptions } from '../types';
import { BaseResource } from './base';

/**
 * An event that can trigger a webhook.
 */
export type AppWebhookEvent =
  | 'app_build_created'
  | 'app_deployment_created'
  | 'job_created'
  | 'job_finished';

/**
 * The payload format of a webhook.
 */
export type AppWebhookFormat = 'discord' | 'raw' | 'slack' | 'teams';

/**
 * A webhook that notifies an external service about app events.
 */
export interface AppWebhook {
  id: string;
  appId: string;
  name: string;
  url: string;
  events: AppWebhookEvent[];
  format: AppWebhookFormat;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListWebhooksOptions extends PaginationOptions {
  appId: string;
  query?: string;
}

export interface GetWebhookOptions {
  appId: string;
  webhookId: string;
}

export interface CreateWebhookOptions {
  appId: string;
  name: string;
  url: string;
  events: AppWebhookEvent[];
  format?: AppWebhookFormat;
  signingSecret?: string;
}

export interface UpdateWebhookOptions {
  appId: string;
  webhookId: string;
  name?: string;
  url?: string;
  events?: AppWebhookEvent[];
  format?: AppWebhookFormat;
  signingSecret?: string;
  enabled?: boolean;
}

export interface DeleteWebhookOptions {
  appId: string;
  webhookId: string;
}

export class WebhooksResource extends BaseResource {
  /**
   * List app webhooks.
   */
  public async list(options: ListWebhooksOptions): Promise<AppWebhook[]> {
    return this.http.request<AppWebhook[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/webhooks`,
      query: { query: options.query, limit: options.limit, offset: options.offset },
    });
  }

  /**
   * Get an app webhook by id.
   */
  public async get(options: GetWebhookOptions): Promise<AppWebhook> {
    return this.http.request<AppWebhook>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/webhooks/${options.webhookId}`,
    });
  }

  /**
   * Create a new app webhook.
   */
  public async create(options: CreateWebhookOptions): Promise<AppWebhook> {
    const { appId, ...body } = options;
    return this.http.request<AppWebhook>({
      method: 'POST',
      path: `/v1/apps/${appId}/webhooks`,
      body,
    });
  }

  /**
   * Update an app webhook.
   */
  public async update(options: UpdateWebhookOptions): Promise<AppWebhook> {
    const { appId, webhookId, ...body } = options;
    return this.http.request<AppWebhook>({
      method: 'PATCH',
      path: `/v1/apps/${appId}/webhooks/${webhookId}`,
      body,
    });
  }

  /**
   * Delete an app webhook.
   */
  public async delete(options: DeleteWebhookOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/apps/${options.appId}/webhooks/${options.webhookId}`,
    });
  }
}
