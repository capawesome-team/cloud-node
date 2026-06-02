/**
 * The platform a resource targets.
 */
export type Platform = 'android' | 'ios' | 'web';

/**
 * The type of an app.
 */
export type AppType = 'android' | 'capacitor' | 'cordova' | 'ios';

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
