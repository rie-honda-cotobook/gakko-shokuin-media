import { prisma } from '@/lib/db';
import { fetchHead, fetchGet, getDomain, type FetchResult } from './fetch';
import { normalizeHtml, extractTitle } from './normalize';
import { sha256 } from './hash';
import { isDisallowedByRobots } from './robots';
import { ChangeType } from './types';

const BAD_STATUSES = [403, 404, 429, 500, 502, 503];

export type CheckResult = {
  pageId: string;
  eventCreated: boolean;
  eventId?: string;
  statusCode: number;
  error?: string;
};

export async function checkOnePage(page: {
  id: string;
  url: string;
  universityName: string;
  lastStatusCode: number | null;
  lastEtag: string | null;
  lastModified: string | null;
  lastContentHash: string | null;
}): Promise<CheckResult> {
  await ensureRobotsAndDisableIfNeeded(page.id, page.url);
  const updated = await prisma.monitorPage.findUnique({ where: { id: page.id }, select: { isActive: true } });
  if (updated && !updated.isActive) return { pageId: page.id, eventCreated: false, statusCode: 0 };

  let result: FetchResult;
  try {
    result = await fetchHead(page.url);
    if (result.statusCode >= 400 || (!result.etag && !result.lastModified)) {
      const getRes = await fetchGet(page.url);
      result = getRes;
    }
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : 'Fetch failed';
    await prisma.monitorPage.update({
      where: { id: page.id },
      data: {
        lastCheckedAt: new Date(),
        consecutiveErrors: { increment: 1 },
        notes: `Error: ${errMsg}`,
      },
    });
    const hadError = page.lastStatusCode != null && BAD_STATUSES.includes(page.lastStatusCode);
    let eventId: string | undefined;
    if (!hadError || page.lastStatusCode !== 0) {
      const ev = await prisma.monitorEvent.create({
        data: {
          pageId: page.id,
          detectedAt: new Date(),
          changeType: ChangeType.STATUS_CHANGE,
          oldValue: String(page.lastStatusCode ?? ''),
          newValue: '0',
          statusCode: 0,
          titleGuess: null,
        },
      });
      eventId = ev.id;
    }
    return { pageId: page.id, eventCreated: !!eventId, eventId, statusCode: 0, error: errMsg };
  }

  const statusCode = result.statusCode;

  if (BAD_STATUSES.includes(statusCode)) {
    const prevBad = page.lastStatusCode != null && BAD_STATUSES.includes(page.lastStatusCode);
    const changed = page.lastStatusCode !== statusCode;
    await prisma.monitorPage.update({
      where: { id: page.id },
      data: {
        lastCheckedAt: new Date(),
        lastStatusCode: statusCode,
        consecutiveErrors: { increment: 1 },
      },
    });
    if (!prevBad || changed) {
      const ev = await prisma.monitorEvent.create({
        data: {
          pageId: page.id,
          detectedAt: new Date(),
          changeType: ChangeType.STATUS_CHANGE,
          oldValue: String(page.lastStatusCode ?? ''),
          newValue: String(statusCode),
          statusCode,
        },
      });
      return { pageId: page.id, eventCreated: true, eventId: ev.id, statusCode };
    }
    return { pageId: page.id, eventCreated: false, statusCode };
  }

  let changeType: string | null = null;
  let oldVal: string | null = null;
  let newVal: string | null = null;
  let contentHash: string | null = null;
  let titleGuess: string | null = null;

  if (result.etag && result.etag !== page.lastEtag) {
    changeType = ChangeType.ETAG;
    oldVal = page.lastEtag;
    newVal = result.etag;
  } else if (result.lastModified && result.lastModified !== page.lastModified) {
    changeType = ChangeType.LAST_MODIFIED;
    oldVal = page.lastModified;
    newVal = result.lastModified;
  } else if (result.body) {
    const normalized = normalizeHtml(result.body);
    contentHash = sha256(normalized);
    titleGuess = extractTitle(result.body);
    if (contentHash !== page.lastContentHash) {
      changeType = ChangeType.CONTENT_HASH;
      oldVal = page.lastContentHash;
      newVal = contentHash;
    }
  }

  const updateData: {
    lastCheckedAt: Date;
    lastStatusCode: number;
    lastEtag?: string | null;
    lastModified?: string | null;
    lastContentHash?: string | null;
    lastChangeAt?: Date;
    consecutiveErrors?: number;
    notes?: string | null;
  } = {
    lastCheckedAt: new Date(),
    lastStatusCode: statusCode,
  };
  if (result.etag !== undefined) updateData.lastEtag = result.etag;
  if (result.lastModified !== undefined) updateData.lastModified = result.lastModified;
  if (contentHash !== null) updateData.lastContentHash = contentHash;
  if (changeType) updateData.lastChangeAt = new Date();
  if (statusCode >= 200 && statusCode < 400) updateData.consecutiveErrors = 0;

  await prisma.monitorPage.update({
    where: { id: page.id },
    data: updateData,
  });

  if (!changeType) return { pageId: page.id, eventCreated: false, statusCode };

  const ev = await prisma.monitorEvent.create({
    data: {
      pageId: page.id,
      detectedAt: new Date(),
      changeType,
      oldValue: oldVal ?? undefined,
      newValue: newVal ?? undefined,
      statusCode,
      titleGuess: titleGuess ?? undefined,
    },
  });
  return { pageId: page.id, eventCreated: true, eventId: ev.id, statusCode };
}

export async function ensureRobotsAndDisableIfNeeded(pageId: string, url: string): Promise<void> {
  const disallowed = await isDisallowedByRobots(url);
  if (disallowed) {
    await prisma.monitorPage.update({
      where: { id: pageId },
      data: { isActive: false, notes: 'robots.txt に Disallow: / のため停止' },
    });
  }
}
