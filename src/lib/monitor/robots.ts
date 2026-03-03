import { USER_AGENT, FETCH_TIMEOUT_MS } from './types';

/**
 * robots.txt を取得し、Disallow: / があれば true（ブロックされている）
 */
export async function isDisallowedByRobots(url: string): Promise<boolean> {
  try {
    const u = new URL(url);
    const robotsUrl = `${u.origin}/robots.txt`;
    const c = new AbortController();
    setTimeout(() => c.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(robotsUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: c.signal as AbortSignal,
    });
    if (!res.ok) return false;
    const text = await res.text();
    const lines = text.split(/\r?\n/).map((l) => l.trim().toLowerCase());
    for (const line of lines) {
      if (line.startsWith('disallow:')) {
        const path = line.slice(9).trim();
        if (path === '/' || path === '/*') return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
