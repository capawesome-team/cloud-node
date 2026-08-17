import type { PaginationOptions } from '../types';
import { BaseResource } from './base';

/**
 * The role an invited user receives after accepting the invitation. Owners
 * cannot be invited.
 */
export type OrganizationInvitationRole = 'admin' | 'billing' | 'member' | 'viewer';

/**
 * The status of an invitation.
 */
export type OrganizationInvitationStatus = 'accepted' | 'canceled' | 'pending' | 'rejected';

/**
 * An invitation to join an organization.
 */
export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationInvitationRole;
  status: OrganizationInvitationStatus;
  inviterId: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListInvitationsOptions extends PaginationOptions {
  organizationId: string;
  /**
   * Filter invitations by a search query, matching the invitation id or email.
   */
  query?: string;
  /**
   * Filter invitations by role.
   */
  role?: OrganizationInvitationRole;
}

export interface CreateInvitationOptions {
  organizationId: string;
  email: string;
  role: OrganizationInvitationRole;
}

export interface DeleteInvitationOptions {
  organizationId: string;
  invitationId: string;
}

export class InvitationsResource extends BaseResource {
  /**
   * Get organization invitations.
   */
  public async list(options: ListInvitationsOptions): Promise<OrganizationInvitation[]> {
    return this.http.request<OrganizationInvitation[]>({
      method: 'GET',
      path: `/v1/organizations/${options.organizationId}/invitations`,
      query: {
        query: options.query,
        role: options.role,
        limit: options.limit,
        offset: options.offset,
      },
    });
  }

  /**
   * Invite a user to an organization.
   */
  public async create(options: CreateInvitationOptions): Promise<OrganizationInvitation> {
    const { organizationId, ...body } = options;
    return this.http.request<OrganizationInvitation>({
      method: 'POST',
      path: `/v1/organizations/${organizationId}/invitations`,
      body,
    });
  }

  /**
   * Revoke an invitation.
   */
  public async delete(options: DeleteInvitationOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/organizations/${options.organizationId}/invitations/${options.invitationId}`,
    });
  }
}
