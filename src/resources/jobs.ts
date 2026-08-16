import type { BuildStack, PaginationOptions } from '../types';
import { BaseResource } from './base';

/**
 * The status of a job.
 */
export type JobStatus =
  | 'queued'
  | 'pending'
  | 'in_progress'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'rejected'
  | 'timed_out';

/**
 * A background job, e.g. a native build or a deployment.
 */
export interface Job {
  id: string;
  appId: string;
  status: JobStatus;
  stack: BuildStack;
  appBuildId: string | null;
  appDeploymentId: string | null;
  finishedAt: string | null;
  createdAt: string;
}

/**
 * A single log line of a job.
 */
export interface JobLog {
  jobId: string;
  number: number;
  payload: string;
  timestamp: string;
}

export interface ListJobsOptions extends PaginationOptions {
  organizationId: string;
  status?: JobStatus;
}

export interface GetJobOptions {
  jobId: string;
}

/**
 * An AI generated summary explaining why a job failed.
 */
export interface JobFailureSummary {
  summary: string;
}

export interface GetJobLogsOptions {
  jobId: string;
}

export interface GetJobFailureSummaryOptions {
  jobId: string;
}

export interface CancelJobOptions {
  jobId: string;
}

export class JobsResource extends BaseResource {
  /**
   * Get jobs.
   */
  public async list(options: ListJobsOptions): Promise<Job[]> {
    return this.http.request<Job[]>({
      method: 'GET',
      path: '/v1/jobs',
      query: {
        organizationId: options.organizationId,
        status: options.status,
        limit: options.limit,
        offset: options.offset,
      },
    });
  }

  /**
   * Get a job by id.
   */
  public async get(options: GetJobOptions): Promise<Job> {
    return this.http.request<Job>({ method: 'GET', path: `/v1/jobs/${options.jobId}` });
  }

  /**
   * Get job logs.
   */
  public async getLogs(options: GetJobLogsOptions): Promise<JobLog[]> {
    return this.http.request<JobLog[]>({
      method: 'GET',
      path: `/v1/jobs/${options.jobId}/logs`,
    });
  }

  /**
   * Get a summary explaining why a job failed. The summary is generated on the
   * first request and cached afterwards. Only available for failed jobs.
   */
  public async getFailureSummary(options: GetJobFailureSummaryOptions): Promise<JobFailureSummary> {
    return this.http.request<JobFailureSummary>({
      method: 'POST',
      path: `/v1/jobs/${options.jobId}/failure-summary`,
    });
  }

  /**
   * Cancel a job that has not finished yet.
   */
  public async cancel(options: CancelJobOptions): Promise<Job> {
    return this.http.request<Job>({
      method: 'PATCH',
      path: `/v1/jobs/${options.jobId}`,
      body: { status: 'canceled' },
    });
  }
}
