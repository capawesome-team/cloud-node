import type { PaginationOptions } from '../types';
import { BaseResource } from './base';

/**
 * The type of a build artifact.
 */
export type AppBuildArtifactType =
  | 'aab'
  | 'apk'
  | 'app'
  | 'dsym'
  | 'ipa'
  | 'manifest'
  | 'xcarchive'
  | 'zip';

/**
 * An artifact produced by a native build.
 */
export interface AppBuildArtifact {
  id: string;
  appBuildId: string;
  type: AppBuildArtifactType;
  status: 'pending' | 'ready';
  totalSizeInBytes: number | null;
  totalDownloads: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * A signed, time-limited URL to download a build artifact.
 */
export interface SignedDownloadUrl {
  url: string;
  /**
   * The expiration time as a Unix timestamp in milliseconds.
   */
  expiresAt: number;
}

export interface ListBuildArtifactsOptions extends PaginationOptions {
  appId: string;
  buildId: string;
}

export interface DownloadBuildArtifactOptions {
  appId: string;
  buildId: string;
  artifactId: string;
  /**
   * The file name to use for the downloaded file.
   */
  fileName?: string;
}

export interface GetSignedDownloadUrlOptions {
  appId: string;
  buildId: string;
  artifactId: string;
  fileName?: string;
}

export class BuildArtifactsResource extends BaseResource {
  /**
   * Get app build artifacts.
   */
  public async list(options: ListBuildArtifactsOptions): Promise<AppBuildArtifact[]> {
    return this.http.request<AppBuildArtifact[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/builds/${options.buildId}/artifacts`,
      query: { limit: options.limit, offset: options.offset },
    });
  }

  /**
   * Download an app build artifact as a stream.
   */
  public async download(
    options: DownloadBuildArtifactOptions,
  ): Promise<ReadableStream<Uint8Array>> {
    return this.http.requestStream({
      method: 'GET',
      path: `/v1/apps/${options.appId}/builds/${options.buildId}/artifacts/${options.artifactId}/download`,
      query: { fileName: options.fileName },
    });
  }

  /**
   * Get a signed, time-limited URL to download an app build artifact.
   */
  public async getSignedDownloadUrl(
    options: GetSignedDownloadUrlOptions,
  ): Promise<SignedDownloadUrl> {
    return this.http.request<SignedDownloadUrl>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/builds/${options.buildId}/artifacts/${options.artifactId}/signed-download-url`,
      query: { fileName: options.fileName },
    });
  }
}
