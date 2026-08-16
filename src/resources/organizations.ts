import type { HttpClient } from '../http-client';
import { BaseResource } from './base';
import { GitConnectionsResource } from './git-connections';
import { InvitationsResource } from './invitations';
import { LicenseKeysResource } from './license-keys';
import { MembersResource } from './members';
import { TeamsResource } from './teams';

/**
 * An organization owning apps, members and subscriptions.
 */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  /**
   * The allowed countries as ISO 3166-1 alpha-2 codes, or `null` if all
   * countries are allowed.
   */
  countryAllowlist: string[] | null;
  /**
   * The allowed IP addresses or CIDR ranges, or `null` if all are allowed.
   */
  ipAllowlist: string[] | null;
  /**
   * Whether members must enable two-factor authentication.
   */
  twoFactorRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationOptions {
  name: string;
  /**
   * A trial code to redeem while creating the organization.
   */
  trialCode?: string;
}

export interface UpdateOrganizationOptions {
  organizationId: string;
  name?: string;
  countryAllowlist?: string[] | null;
  ipAllowlist?: string[] | null;
  twoFactorRequired?: boolean;
}

export class OrganizationsResource extends BaseResource {
  /**
   * Manage Git connections.
   */
  public readonly gitConnections: GitConnectionsResource;
  /**
   * Manage member invitations.
   */
  public readonly invitations: InvitationsResource;
  /**
   * Manage license keys.
   */
  public readonly licenseKeys: LicenseKeysResource;
  /**
   * Manage organization members.
   */
  public readonly members: MembersResource;
  /**
   * Manage teams and their apps and members.
   */
  public readonly teams: TeamsResource;

  constructor(http: HttpClient) {
    super(http);
    this.gitConnections = new GitConnectionsResource(http);
    this.invitations = new InvitationsResource(http);
    this.licenseKeys = new LicenseKeysResource(http);
    this.members = new MembersResource(http);
    this.teams = new TeamsResource(http);
  }

  /**
   * Get the organizations the authenticated user is a member of.
   */
  public async list(): Promise<Organization[]> {
    return this.http.request<Organization[]>({ method: 'GET', path: '/v1/organizations' });
  }

  /**
   * Create a new organization.
   */
  public async create(options: CreateOrganizationOptions): Promise<Organization> {
    return this.http.request<Organization>({
      method: 'POST',
      path: '/v1/organizations',
      body: options,
    });
  }

  /**
   * Update an organization.
   */
  public async update(options: UpdateOrganizationOptions): Promise<Organization> {
    const { organizationId, ...body } = options;
    return this.http.request<Organization>({
      method: 'PATCH',
      path: `/v1/organizations/${organizationId}`,
      body,
    });
  }
}
