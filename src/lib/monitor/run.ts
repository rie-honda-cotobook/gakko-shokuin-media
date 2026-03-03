import { prisma } from '@/lib/db';
import { getDomain } from './fetch';
import { checkOnePage } from './check';
import { sendMonitorAlert } from './slack';
import { generateReviewToken, hashReviewToken } from './token';
import { DOMAIN_DELAY_MS, SLACK_DEBOUNCE_HOURS } from './types';

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function runMonitor(): Promise<{ checked: number; eventsCreated: number }> {
  const now = new Date();
  const pages = await prisma.monitorPage.findMany({
    where: { isActive: true },
    select: {
      id: true,
      url: true,
      universityName: true,
      checkIntervalHours: true,
      lastCheckedAt: true,
      lastStatusCode: true,
      lastEtag: true,
      lastModified: true,
      lastContentHash: true,
    },
  });

  const due = pages.filter((p) => {
    if (!p.lastCheckedAt) return true;
    const next = new Date(p.lastCheckedAt);
    next.setHours(next.getHours() + p.checkIntervalHours);
    return now >= next;
  });

  const byDomain = new Map<string, number>();
  let lastDomain = '';
  let eventsCreated = 0;

  for (const p of due) {
    const domain = getDomain(p.url);
    if (domain === lastDomain) await sleep(DOMAIN_DELAY_MS);
    lastDomain = domain;

    const res = await checkOnePage({
      id: p.id,
      url: p.url,
      universityName: p.universityName,
      lastStatusCode: p.lastStatusCode,
      lastEtag: p.lastEtag,
      lastModified: p.lastModified,
      lastContentHash: p.lastContentHash,
    });

    if (res.eventCreated && res.eventId) {
      eventsCreated++;
      const token = generateReviewToken();
      const tokenHash = hashReviewToken(token);

      const cutoff = new Date(now.getTime() - SLACK_DEBOUNCE_HOURS * 60 * 60 * 1000);
      const recentSamePage = await prisma.monitorEvent.count({
        where: {
          pageId: p.id,
          id: { not: res.eventId },
          detectedAt: { gte: cutoff },
        },
      });
      const shouldNotifySlack = recentSamePage === 0;

      await prisma.monitorEvent.update({
        where: { id: res.eventId },
        data: { reviewTokenHash: tokenHash },
      });

      if (shouldNotifySlack) {
        const ev = await prisma.monitorEvent.findUnique({
          where: { id: res.eventId },
          select: { titleGuess: true, detectedAt: true },
        });
        await sendMonitorAlert({
          universityName: p.universityName,
          url: p.url,
          changeType: (await prisma.monitorEvent.findUnique({ where: { id: res.eventId } }))?.changeType ?? '',
          detectedAt: ev?.detectedAt?.toISOString() ?? new Date().toISOString(),
          eventId: res.eventId,
          pageId: p.id,
          reviewToken: token,
          titleGuess: ev?.titleGuess ?? null,
        });
      }
    }
  }

  return { checked: due.length, eventsCreated };
}
