import {
  USER_AGENT,
  FETCH_TIMEOUT_MS,
  MAX_BODY_SIZE,
} from './types';

export type FetchResult = {
  statusCode: number;
  etag: string | null;
  lastModified: string | null;
  body: string | null;
  error?: string;
};

function timeoutSignal(ms: number): AbortSignal {
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal as AbortSignal;
}

export async function fetchHead(url: string): Promise<FetchResult> {
  const signal = timeoutSignal(FETCH_TIMEOUT_MS);
  const res = await fetch(url, {
    method: 'HEAD',
    headers: { 'User-Agent': USER_AGENT },
    signal,
  });
  const etag = res.headers.get('etag')?.trim() || null;
  const lastModified = res.headers.get('last-modified')?.trim() || null;
  return {
    statusCode: res.status,
    etag,
    lastModified,
    body: null,
  };
}

export async function fetchGet(url: string): Promise<FetchResult> {
  const signal = timeoutSignal(FETCH_TIMEOUT_MS);
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'User-Agent': USER_AGENT },
    signal,
  });
  const etag = res.headers.get('etag')?.trim() || null;
  const lastModified = res.headers.get('last-modified')?.trim() || null;
  const contentLength = res.headers.get('content-length');
  const size = contentLength ? parseInt(contentLength, 10) : 0;
  if (size > MAX_BODY_SIZE) {
    return { statusCode: res.status, etag, lastModified, body: null };
  }
  const text = await res.text();
  if (text.length > MAX_BODY_SIZE) {
    return { statusCode: res.status, etag, lastModified, body: null };
  }
  return { statusCode: res.status, etag, lastModified, body: text };
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}
