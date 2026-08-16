import { BaseResource } from './base';

/**
 * A user account.
 */
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
  twoFactorEnabled: boolean;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
}

export class UsersResource extends BaseResource {
  /**
   * Get the user the token belongs to.
   */
  public async me(): Promise<User> {
    return this.http.request<User>({ method: 'GET', path: '/v1/users/me' });
  }
}
