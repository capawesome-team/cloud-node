import type { OrganizationRole, PaginationOptions } from '../types';
import { BaseResource } from './base';

/**
 * The user account behind an organization member.
 */
export interface OrganizationMemberUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

/**
 * A user that is a member of an organization.
 */
export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  user: OrganizationMemberUser;
  lastSeenAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListMembersOptions extends PaginationOptions {
  organizationId: string;
  /**
   * Filter members by id.
   */
  id?: string;
  /**
   * Filter members by a search query, matching the member id, user id or email.
   */
  query?: string;
  /**
   * Filter members by role.
   */
  role?: OrganizationRole;
}

export interface DeleteMemberOptions {
  organizationId: string;
  memberId: string;
}

export class MembersResource extends BaseResource {
  /**
   * Get organization members.
   */
  public async list(options: ListMembersOptions): Promise<OrganizationMember[]> {
    return this.http.request<OrganizationMember[]>({
      method: 'GET',
      path: `/v1/organizations/${options.organizationId}/members`,
      query: {
        id: options.id,
        query: options.query,
        role: options.role,
        limit: options.limit,
        offset: options.offset,
      },
    });
  }

  /**
   * Remove a member from an organization.
   */
  public async delete(options: DeleteMemberOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/organizations/${options.organizationId}/members/${options.memberId}`,
    });
  }
}
