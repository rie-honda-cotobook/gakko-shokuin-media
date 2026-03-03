import { prisma } from '@/lib/db';

const ERROR_THRESHOLD = 3;

export async function getMonitorDashboardStats() {
  const since = new Date();
  since.setHours(since.getHours() - 24);

  const [events24h, unreviewedCount, errorPages] = await Promise.all([
    prisma.monitorEvent.count({ where: { detectedAt: { gte: since } } }),
    prisma.monitorEvent.count({ where: { isReviewed: false } }),
    prisma.monitorPage.findMany({
      where: { isActive: true, consecutiveErrors: { gte: ERROR_THRESHOLD } },
      select: { id: true, universityName: true, url: true, consecutiveErrors: true },
      orderBy: { consecutiveErrors: 'desc' },
      take: 10,
    }),
  ]);

  return { events24h, unreviewedCount, errorPages };
}
