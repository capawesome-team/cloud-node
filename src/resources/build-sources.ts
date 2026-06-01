import { BaseResource } from './base';

/**
 * A source archive used as input for native builds.
 */
export interface AppBuildSource {
  id: string;
  type: 'archive' | 'git';
  status: 'pending' | 'ready';
  fileSizeInBytes: number | null;
  fileUrl: string | null;
  createdAt: string;
}

export interface CreateBuildSourceOptions {
  appId: string;
  /**
   * The URL of the already uploaded source archive.
   */
  fileUrl?: string;
  /**
   * The size of the source archive in bytes.
   */
  fileSizeInBytes?: number;
}

export interface DownloadBuildSourceOptions {
  appId: string;
  buildSourceId: string;
}

export class BuildSourcesResource extends BaseResource {
  /**
   * Create a new app build source.
   */
  public async create(options: CreateBuildSourceOptions): Promise<AppBuildSource> {
    const { appId, ...body } = options;
    return this.http.request<AppBuildSource>({
      method: 'POST',
      path: `/v1/apps/${appId}/build-sources`,
      body,
    });
  }

  /**
   * Download an app build source as a stream.
   */
  public async download(options: DownloadBuildSourceOptions): Promise<ReadableStream<Uint8Array>> {
    return this.http.requestStream({
      method: 'GET',
      path: `/v1/apps/${options.appId}/build-sources/${options.buildSourceId}/download`,
    });
  }
}
