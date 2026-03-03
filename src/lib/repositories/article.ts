import { prisma } from '@/lib/db';

const PER_PAGE = 12;

const now = () => new Date();

/** 公開済み条件：status=published または (scheduled かつ publishedAt <= 現在) */
function publishedWhere(category?: string) {
  return {
    OR: [
      { status: 'published' },
      { status: 'scheduled', publishedAt: { lte: now() } },
    ],
    ...(category ? { category } : {}),
  };
}

export async function getPublishedArticles(opts?: { page?: number; category?: string }) {
  const page = opts?.page ?? 1;
  const where = publishedWhere(opts?.category);

  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { author: true },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.article.count({ where }),
  ]);
  return { items, total, totalPages: Math.ceil(total / PER_PAGE), page };
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: {
      slug,
      OR: [
        { status: 'published' },
        { status: 'scheduled', publishedAt: { lte: now() } },
      ],
    },
    include: { author: true },
  });
}

export async function getRelatedArticles(articleId: string, limit = 3) {
  const article = await prisma.article.findUnique({ where: { id: articleId }, select: { category: true } });
  const wherePublished = publishedWhere(article?.category ?? undefined);
  return prisma.article.findMany({
    where: { id: { not: articleId }, ...wherePublished },
    include: { author: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
}

export async function getPopularArticleSlugs(limit = 5) {
  const items = await prisma.article.findMany({
    where: publishedWhere(),
    orderBy: { publishedAt: 'desc' },
    take: limit * 2,
    select: { slug: true, title: true, ogImageUrl: true, publishedAt: true },
  });
  return items.slice(0, limit);
}

export async function getLatestArticleSlugs(limit = 5) {
  const items = await prisma.article.findMany({
    where: publishedWhere(),
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: { slug: true, title: true, excerpt: true, publishedAt: true, author: true, ogImageUrl: true },
  });
  return items;
}

export async function getAllPublishedSlugs() {
  return prisma.article.findMany({
    where: publishedWhere(),
    select: { slug: true },
  });
}

export async function getArticlesByCategory(category: string) {
  return prisma.article.findMany({
    where: publishedWhere(category),
    include: { author: true },
    orderBy: { publishedAt: 'desc' },
  });
}
