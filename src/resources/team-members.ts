import type { PaginationOptions } from '../types';
import { BaseResource } from './base';
import type { OrganizationMember } from './members';

/**
 * The assignment of an organization member to a team.
 */
export interface TeamMember {
  id: string;
  teamId: string;
  memberId: string;
  /**
   * The assigned member. Only present if members were included.
   */
  member?: Omit<OrganizationMember, 'user'>;
  createdAt: string;
}

export interface ListTeamMembersOptions extends PaginationOptions {
  organizationId: string;
  teamId: string;
}

export interface CreateTeamMemberOptions {
  organizationId: string;
  teamId: string;
  memberId: string;
}

export interface DeleteTeamMemberOptions {
  organizationId: string;
  teamId: string;
  teamMemberId: string;
}

export class TeamMembersResource extends BaseResource {
  /**
   * Get the members assigned to a team.
   */
  public async list(options: ListTeamMembersOptions): Promise<TeamMember[]> {
    return this.http.request<TeamMember[]>({
      method: 'GET',
      path: `/v1/organizations/${options.organizationId}/teams/${options.teamId}/members`,
      query: { limit: options.limit, offset: options.offset },
    });
  }

  /**
   * Assign an organization member to a team.
   */
  public async create(options: CreateTeamMemberOptions): Promise<TeamMember> {
    const { organizationId, teamId, ...body } = options;
    return this.http.request<TeamMember>({
      method: 'POST',
      path: `/v1/organizations/${organizationId}/teams/${teamId}/members`,
      body,
    });
  }

  /**
   * Remove a member from a team.
   */
  public async delete(options: DeleteTeamMemberOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/organizations/${options.organizationId}/teams/${options.teamId}/members/${options.teamMemberId}`,
    });
  }
}
