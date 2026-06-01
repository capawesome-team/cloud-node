import type { HttpClient } from '../http-client';
import type { AppType, PaginationOptions } from '../types';
import { AutomationsResource } from './automations';
import { BaseResource } from './base';
import { BuildSourcesResource } from './build-sources';
import { BuildsResource } from './builds';
import { CertificatesResource } from './certificates';
import { ChannelsResource } from './channels';
import { DeploymentsResource } from './deployments';
import { DestinationsResource } from './destinations';
import { DevicesResource } from './devices';
import { EnvironmentsResource } from './environments';
import { WebhooksResource } from './webhooks';

/**
 * An app in the Capawesome Cloud.
 */
export interface App {
  id: string;
  name: string;
  type: AppType;
  organizationId: string;
  /**
   * The id of the default channel.
   */
  appChannelId: string | null;
  /**
   * The id of the default environment.
   */
  appEnvironmentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListAppsOptions extends PaginationOptions {
  organizationId?: string;
  /**
   * Filter apps by a search query.
   */
  query?: string;
}

export interface GetAppOptions {
  appId: string;
}

export interface CreateAppOptions {
  name: string;
  type?: AppType;
  /**
   * The id of the organization to create the app in.
   */
  organizationId?: string;
}

export interface UpdateAppOptions {
  appId: string;
  name?: string;
  type?: AppType;
  appChannelId?: string | null;
  appEnvironmentId?: string | null;
  appChannelDiscoveryEnabled?: boolean;
  nextAppBuildNumber?: number;
}

export interface DeleteAppOptions {
  appId: string;
}

export interface TransferAppOptions {
  appId: string;
  /**
   * The id of the organization to transfer the app to.
   */
  organizationId: string;
}

export class AppsResource extends BaseResource {
  /**
   * Manage app automations.
   */
  public readonly automations: AutomationsResource;
  /**
   * Manage native builds.
   */
  public readonly builds: BuildsResource;
  /**
   * Manage native build sources.
   */
  public readonly buildSources: BuildSourcesResource;
  /**
   * Manage signing certificates.
   */
  public readonly certificates: CertificatesResource;
  /**
   * Manage live update channels.
   */
  public readonly channels: ChannelsResource;
  /**
   * Manage deployments.
   */
  public readonly deployments: DeploymentsResource;
  /**
   * Manage app store publishing destinations.
   */
  public readonly destinations: DestinationsResource;
  /**
   * Manage registered devices.
   */
  public readonly devices: DevicesResource;
  /**
   * Manage environments, secrets and variables.
   */
  public readonly environments: EnvironmentsResource;
  /**
   * Manage app webhooks.
   */
  public readonly webhooks: WebhooksResource;

  constructor(http: HttpClient) {
    super(http);
    this.automations = new AutomationsResource(http);
    this.builds = new BuildsResource(http);
    this.buildSources = new BuildSourcesResource(http);
    this.certificates = new CertificatesResource(http);
    this.channels = new ChannelsResource(http);
    this.deployments = new DeploymentsResource(http);
    this.destinations = new DestinationsResource(http);
    this.devices = new DevicesResource(http);
    this.environments = new EnvironmentsResource(http);
    this.webhooks = new WebhooksResource(http);
  }

  /**
   * Get apps.
   */
  public async list(options: ListAppsOptions = {}): Promise<App[]> {
    return this.http.request<App[]>({
      method: 'GET',
      path: '/v1/apps',
      query: {
        organizationId: options.organizationId,
        limit: options.limit,
        offset: options.offset,
        query: options.query,
      },
    });
  }

  /**
   * Get an app by id.
   */
  public async get(options: GetAppOptions): Promise<App> {
    return this.http.request<App>({ method: 'GET', path: `/v1/apps/${options.appId}` });
  }

  /**
   * Create a new app.
   */
  public async create(options: CreateAppOptions): Promise<App> {
    const { organizationId, ...body } = options;
    return this.http.request<App>({
      method: 'POST',
      path: '/v1/apps',
      query: { organizationId },
      body,
    });
  }

  /**
   * Update an app.
   */
  public async update(options: UpdateAppOptions): Promise<App> {
    const { appId, ...body } = options;
    return this.http.request<App>({ method: 'PATCH', path: `/v1/apps/${appId}`, body });
  }

  /**
   * Delete an app.
   */
  public async delete(options: DeleteAppOptions): Promise<void> {
    await this.http.request<void>({ method: 'DELETE', path: `/v1/apps/${options.appId}` });
  }

  /**
   * Transfer an app to another organization.
   */
  public async transfer(options: TransferAppOptions): Promise<void> {
    const { appId, ...body } = options;
    await this.http.request<void>({ method: 'POST', path: `/v1/apps/${appId}/transfer`, body });
  }
}
