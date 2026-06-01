import type { HttpClient } from '../http-client';
import type { AppBuildType, BuildStack, PaginationOptions, Platform } from '../types';
import { BaseResource } from './base';
import { BuildArtifactsResource } from './build-artifacts';

/**
 * A native build.
 */
export interface AppBuild {
  id: string;
  appId: string;
  platform: Platform;
  type: string | null;
  /**
   * The id of the job processing the build, if any.
   */
  jobId: string | null;
  appBuildArtifactId: string | null;
  packageName: string | null;
  packageVersion: string | null;
  /**
   * The sequential build number as a string.
   */
  numberAsString: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListBuildsOptions extends PaginationOptions {
  appId: string;
  platform?: Platform;
  appAutomationId?: string;
  appGitCommit?: string;
  query?: string;
}

export interface GetBuildOptions {
  appId: string;
  buildId: string;
}

export interface CreateBuildOptions {
  appId: string;
  platform?: Platform;
  type?: AppBuildType;
  stack?: BuildStack;
  gitRef?: string;
  appBuildSourceId?: string;
  appCertificateId?: string;
  appCertificateName?: string;
  appChannelId?: string;
  appDestinationId?: string;
  appEnvironmentId?: string;
  appEnvironmentName?: string;
  adHocEnvironmentVariables?: Record<string, string>;
}

export interface UpdateBuildOptions {
  appId: string;
  buildId: string;
  displayName?: string;
  packageName?: string;
  packageVersion?: string;
  customProperties?: Record<string, string>;
}

export class BuildsResource extends BaseResource {
  /**
   * Access build artifacts.
   */
  public readonly artifacts: BuildArtifactsResource;

  constructor(http: HttpClient) {
    super(http);
    this.artifacts = new BuildArtifactsResource(http);
  }

  /**
   * Get app builds.
   */
  public async list(options: ListBuildsOptions): Promise<AppBuild[]> {
    return this.http.request<AppBuild[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/builds`,
      query: {
        platform: options.platform,
        appAutomationId: options.appAutomationId,
        appGitCommit: options.appGitCommit,
        query: options.query,
        limit: options.limit,
        offset: options.offset,
      },
    });
  }

  /**
   * Get an app build by id.
   */
  public async get(options: GetBuildOptions): Promise<AppBuild> {
    return this.http.request<AppBuild>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/builds/${options.buildId}`,
    });
  }

  /**
   * Create a new app build.
   */
  public async create(options: CreateBuildOptions): Promise<AppBuild> {
    const { appId, ...body } = options;
    return this.http.request<AppBuild>({
      method: 'POST',
      path: `/v1/apps/${appId}/builds`,
      body,
    });
  }

  /**
   * Update an app build.
   */
  public async update(options: UpdateBuildOptions): Promise<AppBuild> {
    const { appId, buildId, ...body } = options;
    return this.http.request<AppBuild>({
      method: 'PATCH',
      path: `/v1/apps/${appId}/builds/${buildId}`,
      body,
    });
  }
}
