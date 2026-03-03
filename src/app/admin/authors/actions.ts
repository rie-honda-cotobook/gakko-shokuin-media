'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateAuthor(
  id: string,
  data: {
    name: string;
    slug: string;
    role: string;
    bio: string | null;
    credentials: string | null;
    avatarUrl: string | null;
    social: string | null;
    isSupervisor: boolean;
  }
): Promise<{ ok: boolean; error?: string }> {
  if (!data.name?.trim() || !data.slug?.trim()) return { ok: false, error: '名前・スラッグは必須です' };
  const existing = await prisma.author.findFirst({ where: { slug: data.slug, id: { not: id } } });
  if (existing) return { ok: false, error: 'このスラッグは既に使用されています' };
  await prisma.author.update({
    where: { id },
    data: {
      name: data.name.trim(),
      slug: data.slug.trim(),
      role: data.role.trim(),
      bio: data.bio?.trim() || null,
      credentials: data.credentials?.trim() || null,
      avatarUrl: data.avatarUrl?.trim() || null,
      social: data.social?.trim() || null,
      isSupervisor: data.isSupervisor,
    },
  });
  revalidatePath('/authors');
  revalidatePath('/articles');
  return { ok: true };
}
