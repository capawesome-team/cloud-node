import type { PaginationOptions } from '../types';
import { BaseResource } from './base';

/**
 * A deployment that promotes a build to a channel or destination.
 */
/**
 * Release notes keyed by `default` and locale (e.g. `de-DE`). The `default`
 * entry is required.
 */
export interface ReleaseNotes {
  default: string;
  [locale: string]: string;
}

export interface AppDeployment {
  id: string;
  appId: string;
  appBuildId: string;
  appChannelId: string | null;
  appDestinationId: string | null;
  /**
   * The id of the job processing the deployment, if any.
   */
  jobId: string | null;
  /**
   * The release notes published with the deployment, keyed by `default` and
   * locale.
   */
  releaseNotes: ReleaseNotes | null;
  /**
   * The rollout percentage as a value between `0` and `1`.
   */
  rolloutPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListDeploymentsOptions extends PaginationOptions {
  appId: string;
  appBuildId?: string;
  appChannelId?: string;
  appDestinationId?: string;
}

export interface GetDeploymentOptions {
  appId: string;
  deploymentId: string;
}

export interface CreateDeploymentOptions {
  appId: string;
  appBuildId: string;
  appChannelId?: string;
  appChannelName?: string;
  appDestinationId?: string;
  appDestinationName?: string;
  /**
   * Release notes to publish with the deployment. The `default` entry is
   * required; other keys are locales (e.g. `de-DE`) with translations. Google
   * Play and Huawei AppGallery allow 500 characters per entry, other
   * destinations 4000. Only supported for destination deployments.
   */
  releaseNotes?: ReleaseNotes;
  /**
   * The rollout percentage as a value between `0` and `1`.
   */
  rolloutPercentage?: number;
}

export interface UpdateDeploymentOptions {
  appId: string;
  deploymentId: string;
  /**
   * The rollout percentage as a value between `0` and `1`.
   */
  rolloutPercentage: number;
}

export class DeploymentsResource extends BaseResource {
  /**
   * Get app deployments.
   */
  public async list(options: ListDeploymentsOptions): Promise<AppDeployment[]> {
    return this.http.request<AppDeployment[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/deployments`,
      query: {
        appBuildId: options.appBuildId,
        appChannelId: options.appChannelId,
        appDestinationId: options.appDestinationId,
        limit: options.limit,
        offset: options.offset,
      },
    });
  }

  /**
   * Get an app deployment by id.
   */
  public async get(options: GetDeploymentOptions): Promise<AppDeployment> {
    return this.http.request<AppDeployment>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/deployments/${options.deploymentId}`,
    });
  }

  /**
   * Create a new app deployment.
   */
  public async create(options: CreateDeploymentOptions): Promise<AppDeployment> {
    const { appId, ...body } = options;
    return this.http.request<AppDeployment>({
      method: 'POST',
      path: `/v1/apps/${appId}/deployments`,
      body,
    });
  }

  /**
   * Update an app deployment.
   */
  public async update(options: UpdateDeploymentOptions): Promise<AppDeployment> {
    const { appId, deploymentId, ...body } = options;
    return this.http.request<AppDeployment>({
      method: 'PATCH',
      path: `/v1/apps/${appId}/deployments/${deploymentId}`,
      body,
    });
  }
}
