import type { HttpClient } from '../http-client';
import type { PaginationOptions } from '../types';
import { BaseResource } from './base';
import type { TeamApp } from './team-apps';
import { TeamAppsResource } from './team-apps';
import type { TeamMember } from './team-members';
import { TeamMembersResource } from './team-members';

/**
 * A team granting a group of members access to a group of apps.
 */
export interface Team {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  totalTeamApps: number;
  totalTeamMembers: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * A team including its apps and members, as returned when they are included.
 */
export interface TeamWithRelations extends Team {
  /**
   * The apps assigned to the team. Only present if apps were included.
   */
  teamApps?: TeamApp[];
  /**
   * The members assigned to the team. Only present if members were included.
   */
  teamMembers?: TeamMember[];
}

export interface ListTeamsOptions extends PaginationOptions {
  organizationId: string;
  /**
   * Filter teams by a search query, matching the name or description.
   */
  query?: string;
}

export interface GetTeamOptions {
  organizationId: string;
  teamId: string;
  /**
   * Whether to include the apps assigned to the team.
   *
   * @default false
   */
  includeApps?: boolean;
  /**
   * Whether to include the members assigned to the team.
   *
   * @default false
   */
  includeMembers?: boolean;
}

export interface CreateTeamOptions {
  organizationId: string;
  name: string;
  description?: string | null;
}

export interface UpdateTeamOptions {
  organizationId: string;
  teamId: string;
  name?: string;
  description?: string | null;
}

export interface DeleteTeamOptions {
  organizationId: string;
  teamId: string;
}

export class TeamsResource extends BaseResource {
  /**
   * Manage the apps assigned to a team.
   */
  public readonly apps: TeamAppsResource;
  /**
   * Manage the members assigned to a team.
   */
  public readonly members: TeamMembersResource;

  constructor(http: HttpClient) {
    super(http);
    this.apps = new TeamAppsResource(http);
    this.members = new TeamMembersResource(http);
  }

  /**
   * Get teams.
   */
  public async list(options: ListTeamsOptions): Promise<Team[]> {
    return this.http.request<Team[]>({
      method: 'GET',
      path: `/v1/organizations/${options.organizationId}/teams`,
      query: { query: options.query, limit: options.limit, offset: options.offset },
    });
  }

  /**
   * Get a team by id.
   */
  public async get(options: GetTeamOptions): Promise<TeamWithRelations> {
    const relations: string[] = [];
    if (options.includeApps) {
      relations.push('apps');
    }
    if (options.includeMembers) {
      relations.push('members');
    }
    return this.http.request<TeamWithRelations>({
      method: 'GET',
      path: `/v1/organizations/${options.organizationId}/teams/${options.teamId}`,
      query: { relations: relations.length > 0 ? relations.join(',') : undefined },
    });
  }

  /**
   * Create a new team.
   */
  public async create(options: CreateTeamOptions): Promise<Team> {
    const { organizationId, ...body } = options;
    return this.http.request<Team>({
      method: 'POST',
      path: `/v1/organizations/${organizationId}/teams`,
      body,
    });
  }

  /**
   * Update a team.
   */
  public async update(options: UpdateTeamOptions): Promise<void> {
    const { organizationId, teamId, ...body } = options;
    await this.http.request<void>({
      method: 'PATCH',
      path: `/v1/organizations/${organizationId}/teams/${teamId}`,
      body,
    });
  }

  /**
   * Delete a team.
   */
  public async delete(options: DeleteTeamOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/organizations/${options.organizationId}/teams/${options.teamId}`,
    });
  }
}
