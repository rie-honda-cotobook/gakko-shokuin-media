import { prisma } from '@/lib/db';

export async function getAuthorBySlug(slug: string) {
  return prisma.author.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        select: { id: true, title: true, slug: true, publishedAt: true },
      },
    },
  });
}

export async function getAllAuthorSlugs() {
  return prisma.author.findMany({ select: { slug: true } });
}

export async function getAuthorsList() {
  return prisma.author.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, slug: true, name: true, role: true, avatarUrl: true, isSupervisor: true },
  });
}
