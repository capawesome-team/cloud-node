import { BaseResource } from './base';

const PACKAGE_RELATIONS = 'licenseKeyPackages,licenseKeyPackages.package';

/**
 * A package a license key grants access to.
 */
export interface LicensedPackage {
  id: string;
  name: string;
  displayName: string;
}

/**
 * The assignment of a package to a license key.
 */
export interface LicenseKeyPackage {
  id: string;
  licenseKeyId: string;
  packageId: string;
  /**
   * The assigned package. Only present if packages were included.
   */
  package?: LicensedPackage;
  createdAt: string;
}

/**
 * A license key granting access to Capawesome Insiders packages, such as the
 * Sponsorware plugins and the Enterprise SDKs.
 */
export interface LicenseKey {
  id: string;
  organizationId: string;
  name: string;
  key: string;
  /**
   * The date the license key expires at, or `null` if it never expires.
   */
  expiresAt: string | null;
  /**
   * The date until which packages cannot be added or removed.
   */
  lockedUntil: string;
  /**
   * The assigned packages. Only present if packages were included.
   */
  licenseKeyPackages?: LicenseKeyPackage[];
  createdAt: string;
}

export interface ListLicenseKeysOptions {
  organizationId: string;
  /**
   * Whether to include the packages assigned to each license key.
   *
   * @default false
   */
  includePackages?: boolean;
}

export interface GetLicenseKeyOptions {
  organizationId: string;
  licenseKeyId: string;
}

export interface CreateLicenseKeyOptions {
  organizationId: string;
  name: string;
  /**
   * The ids of the packages the license key grants access to.
   */
  packageIds?: string[];
}

export interface UpdateLicenseKeyOptions {
  organizationId: string;
  licenseKeyId: string;
  name?: string;
  /**
   * The ids of the packages the license key grants access to. Replaces the
   * current assignments. Packages cannot be changed while the license key is
   * locked.
   */
  packageIds?: string[];
}

export interface DeleteLicenseKeyOptions {
  organizationId: string;
  licenseKeyId: string;
}

export interface RotateLicenseKeyOptions {
  organizationId: string;
  licenseKeyId: string;
}

export class LicenseKeysResource extends BaseResource {
  /**
   * Get license keys.
   */
  public async list(options: ListLicenseKeysOptions): Promise<LicenseKey[]> {
    return this.http.request<LicenseKey[]>({
      method: 'GET',
      path: `/v1/organizations/${options.organizationId}/license-keys`,
      query: { relations: options.includePackages ? PACKAGE_RELATIONS : undefined },
    });
  }

  /**
   * Get a license key by id.
   */
  public async get(options: GetLicenseKeyOptions): Promise<LicenseKey> {
    return this.http.request<LicenseKey>({
      method: 'GET',
      path: `/v1/organizations/${options.organizationId}/license-keys/${options.licenseKeyId}`,
    });
  }

  /**
   * Create a new license key.
   */
  public async create(options: CreateLicenseKeyOptions): Promise<LicenseKey> {
    const { organizationId, ...body } = options;
    return this.http.request<LicenseKey>({
      method: 'POST',
      path: `/v1/organizations/${organizationId}/license-keys`,
      body,
    });
  }

  /**
   * Update a license key.
   */
  public async update(options: UpdateLicenseKeyOptions): Promise<LicenseKey> {
    const { organizationId, licenseKeyId, ...body } = options;
    return this.http.request<LicenseKey>({
      method: 'PATCH',
      path: `/v1/organizations/${organizationId}/license-keys/${licenseKeyId}`,
      body,
    });
  }

  /**
   * Delete a license key.
   */
  public async delete(options: DeleteLicenseKeyOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/organizations/${options.organizationId}/license-keys/${options.licenseKeyId}`,
    });
  }

  /**
   * Rotate a license key. The previous key is invalidated immediately.
   */
  public async rotate(options: RotateLicenseKeyOptions): Promise<LicenseKey> {
    return this.http.request<LicenseKey>({
      method: 'POST',
      path: `/v1/organizations/${options.organizationId}/license-keys/${options.licenseKeyId}/rotate`,
    });
  }
}
