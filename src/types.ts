/**
 * The platform a resource targets.
 */
export type Platform = 'android' | 'ios' | 'web';

/**
 * The type of an app.
 */
export type AppType = 'android' | 'capacitor' | 'cordova' | 'ios';

/**
 * The role of a member within an organization.
 */
export type OrganizationRole = 'owner' | 'admin' | 'billing' | 'member' | 'viewer';

/**
 * The provider hosting a Git repository.
 */
export type GitProvider = 'azure_devops' | 'bitbucket' | 'gitea' | 'git_http' | 'github' | 'gitlab';

/**
 * The macOS stack used to run a native build.
 */
export type BuildStack = 'macos-sequoia' | 'macos-tahoe';

/**
 * The type of a native build.
 */
export type AppBuildType =
  | 'app-store'
  | 'ad-hoc'
  | 'debug'
  | 'development'
  | 'release'
  | 'simulator';

/**
 * Common pagination options shared by all list operations.
 */
export interface PaginationOptions {
  /**
   * The maximum number of items to return.
   *
   * @default 10
   */
  limit?: number;
  /**
   * The number of items to skip.
   *
   * @default 0
   */
  offset?: number;
}
