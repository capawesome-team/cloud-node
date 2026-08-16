import type { PaginationOptions } from '../types';
import type { App } from './apps';
import { BaseResource } from './base';

/**
 * The assignment of an app to a team.
 */
export interface TeamApp {
  id: string;
  teamId: string;
  appId: string;
  /**
   * The assigned app. Only present if apps were included.
   */
  app?: App;
  createdAt: string;
}

export interface ListTeamAppsOptions extends PaginationOptions {
  organizationId: string;
  teamId: string;
}

export interface CreateTeamAppOptions {
  organizationId: string;
  teamId: string;
  appId: string;
}

export interface DeleteTeamAppOptions {
  organizationId: string;
  teamId: string;
  teamAppId: string;
}

export class TeamAppsResource extends BaseResource {
  /**
   * Get the apps assigned to a team.
   */
  public async list(options: ListTeamAppsOptions): Promise<TeamApp[]> {
    return this.http.request<TeamApp[]>({
      method: 'GET',
      path: `/v1/organizations/${options.organizationId}/teams/${options.teamId}/apps`,
      query: { limit: options.limit, offset: options.offset },
    });
  }

  /**
   * Assign an app to a team.
   */
  public async create(options: CreateTeamAppOptions): Promise<TeamApp> {
    const { organizationId, teamId, ...body } = options;
    return this.http.request<TeamApp>({
      method: 'POST',
      path: `/v1/organizations/${organizationId}/teams/${teamId}/apps`,
      body,
    });
  }

  /**
   * Remove an app from a team.
   */
  public async delete(options: DeleteTeamAppOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/organizations/${options.organizationId}/teams/${options.teamId}/apps/${options.teamAppId}`,
    });
  }
}
