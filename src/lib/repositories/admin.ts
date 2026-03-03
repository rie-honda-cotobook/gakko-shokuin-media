import { prisma } from '@/lib/db';

export async function getDashboardStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [publishedThisMonth, drafts, scheduled, recentPublished] = await Promise.all([
    prisma.article.count({
      where: {
        status: 'published',
        publishedAt: { gte: startOfMonth },
      },
    }),
    prisma.article.count({ where: { status: 'draft' } }),
    prisma.article.count({ where: { status: 'scheduled' } }),
    prisma.article.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: { id: true, title: true, slug: true, publishedAt: true },
    }),
  ]);

  return {
    publishedThisMonth,
    drafts,
    scheduled,
    recentPublished,
  };
}
