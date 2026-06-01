import type { PaginationOptions, Platform } from '../types';
import { BaseResource } from './base';

/**
 * The type of a certificate.
 */
export type AppCertificateType = 'development' | 'production';

/**
 * A signing certificate used for native builds.
 *
 * Sensitive fields (file content, passwords) are never returned by the API.
 */
export interface AppCertificate {
  id: string;
  appId: string;
  name: string;
  platform: Platform;
  type: AppCertificateType;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListCertificatesOptions extends PaginationOptions {
  appId: string;
  name?: string;
  platform?: Platform;
  type?: AppCertificateType;
  query?: string;
}

export interface GetCertificateOptions {
  appId: string;
  certificateId: string;
}

export interface CreateCertificateOptions {
  appId: string;
  name: string;
  /**
   * The certificate file (e.g. a `.p12`, `.keystore`, or provisioning profile).
   */
  file: Blob | Uint8Array;
  /**
   * The file name to use for the uploaded certificate.
   */
  fileName?: string;
  platform?: Platform;
  type?: AppCertificateType;
  password?: string;
  keyAlias?: string;
  keyPassword?: string;
}

export interface UpdateCertificateOptions {
  appId: string;
  certificateId: string;
  name?: string;
  type?: AppCertificateType;
  password?: string;
  keyAlias?: string;
  keyPassword?: string;
}

export interface DeleteCertificateOptions {
  appId: string;
  certificateId: string;
}

export class CertificatesResource extends BaseResource {
  /**
   * Get app certificates.
   */
  public async list(options: ListCertificatesOptions): Promise<AppCertificate[]> {
    return this.http.request<AppCertificate[]>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/certificates`,
      query: {
        name: options.name,
        platform: options.platform,
        type: options.type,
        query: options.query,
        limit: options.limit,
        offset: options.offset,
      },
    });
  }

  /**
   * Get an app certificate by id.
   */
  public async get(options: GetCertificateOptions): Promise<AppCertificate> {
    return this.http.request<AppCertificate>({
      method: 'GET',
      path: `/v1/apps/${options.appId}/certificates/${options.certificateId}`,
    });
  }

  /**
   * Create a new app certificate by uploading a certificate file.
   */
  public async create(options: CreateCertificateOptions): Promise<AppCertificate> {
    const formData = new FormData();
    const file = options.file instanceof Blob ? options.file : new Blob([options.file]);
    formData.append('file', file, options.fileName);
    formData.append('name', options.name);
    if (options.platform !== undefined) {
      formData.append('platform', options.platform);
    }
    if (options.type !== undefined) {
      formData.append('type', options.type);
    }
    if (options.password !== undefined) {
      formData.append('password', options.password);
    }
    if (options.keyAlias !== undefined) {
      formData.append('keyAlias', options.keyAlias);
    }
    if (options.keyPassword !== undefined) {
      formData.append('keyPassword', options.keyPassword);
    }
    return this.http.request<AppCertificate>({
      method: 'POST',
      path: `/v1/apps/${options.appId}/certificates`,
      formData,
    });
  }

  /**
   * Update an app certificate.
   */
  public async update(options: UpdateCertificateOptions): Promise<AppCertificate> {
    const { appId, certificateId, ...body } = options;
    return this.http.request<AppCertificate>({
      method: 'PATCH',
      path: `/v1/apps/${appId}/certificates/${certificateId}`,
      body,
    });
  }

  /**
   * Delete an app certificate.
   */
  public async delete(options: DeleteCertificateOptions): Promise<void> {
    await this.http.request<void>({
      method: 'DELETE',
      path: `/v1/apps/${options.appId}/certificates/${options.certificateId}`,
    });
  }
}
