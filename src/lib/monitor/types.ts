export const ChangeType = {
  ETAG: 'ETAG',
  LAST_MODIFIED: 'LAST_MODIFIED',
  CONTENT_HASH: 'CONTENT_HASH',
  STATUS_CHANGE: 'STATUS_CHANGE',
} as const;
export type ChangeType = (typeof ChangeType)[keyof typeof ChangeType];

export const USER_AGENT =
  'YourSiteMonitor/1.0 contact: rie-honda@cotobook.com';
export const FETCH_TIMEOUT_MS = 11000;
export const MAX_BODY_SIZE = 2 * 1024 * 1024; // 2MB
export const DOMAIN_DELAY_MS = 1000;
export const REVIEW_TOKEN_EXPIRY_DAYS = 14;
export const SLACK_DEBOUNCE_HOURS = 1;
