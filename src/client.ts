import type { HttpClientOptions } from './http-client';
import { HttpClient } from './http-client';
import { AppsResource } from './resources/apps';
import { JobsResource } from './resources/jobs';

export type CapawesomeCloudOptions = HttpClientOptions;

/**
 * Client for the Capawesome Cloud API.
 *
 * Resources mirror the API's path hierarchy: app-scoped resources are nested
 * under {@link CapawesomeCloud.apps}, while top-level resources (such as jobs)
 * are exposed directly on the client.
 *
 * @example
 * ```ts
 * import { CapawesomeCloud } from '@capawesome/cloud-sdk';
 *
 * const client = new CapawesomeCloud({ token: process.env.CAPAWESOME_TOKEN! });
 * const apps = await client.apps.list();
 * await client.apps.channels.pause({ appId, channelId });
 * ```
 */
export class CapawesomeCloud {
  /**
   * Manage apps and their sub-resources (channels, deployments, builds, ...).
   */
  public readonly apps: AppsResource;
  /**
   * Inspect background jobs and their logs.
   */
  public readonly jobs: JobsResource;

  constructor(options: CapawesomeCloudOptions) {
    const http = new HttpClient(options);
    this.apps = new AppsResource(http);
    this.jobs = new JobsResource(http);
  }
}
