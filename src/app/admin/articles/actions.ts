'use server';

import { prisma } from '@/lib/db';
import { slugify, uniqueSlug } from '@/lib/slugify';
import { revalidatePath } from 'next/cache';

const articleTemplate = `## はじめに
（導入文）

## 結論
（結論を簡潔に）

## 理由・背景
（理由や背景）

## 手順・方法
（具体的な手順）

## よくある質問
（FAQ）

## まとめ
（まとめ）`;

export async function insertArticleTemplate() {
  return articleTemplate;
}

export async function generateSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title);
  const exists = async (s: string) => {
    const found = await prisma.article.findFirst({
      where: { slug: s, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    return !!found;
  };
  return uniqueSlug(base, exists);
}

export type ArticleFormData = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  publishedAt: string;
  category: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  authorId: string;
  faq: string;
  references: string;
};

function parseJson<T>(s: string, fallback: T): T {
  try {
    if (!s.trim()) return fallback;
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export async function createArticle(data: ArticleFormData): Promise<{ ok: boolean; error?: string; id?: string }> {
  if (!data.title?.trim()) return { ok: false, error: 'タイトルは必須です' };
  if (!data.slug?.trim()) return { ok: false, error: 'スラッグは必須です' };
  if (!data.seoDescription?.trim()) return { ok: false, error: 'SEO説明は必須です（120文字目安）' };
  if (!data.authorId?.trim()) return { ok: false, error: '著者を選択してください' };

  const slugExists = await prisma.article.findUnique({ where: { slug: data.slug } });
  if (slugExists) return { ok: false, error: 'このスラッグは既に使用されています' };

  const publishedAt = data.status === 'published' ? new Date() : data.status === 'scheduled' && data.publishedAt ? new Date(data.publishedAt) : null;

  const article = await prisma.article.create({
    data: {
      title: data.title.trim(),
      slug: data.slug.trim(),
      excerpt: data.excerpt.trim() || null,
      content: data.content.trim() || '',
      status: data.status as 'draft' | 'scheduled' | 'published',
      publishedAt,
      category: data.category.trim() || null,
      tags: data.tags.trim() ? data.tags.trim() : null,
      seoTitle: data.seoTitle.trim() || null,
      seoDescription: data.seoDescription.trim(),
      ogImageUrl: data.ogImageUrl.trim() || null,
      authorId: data.authorId,
      faq: data.faq.trim() ? data.faq.trim() : null,
      references: data.references.trim() ? data.references.trim() : null,
    },
  });
  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath('/career-guide');
  revalidatePath(`/articles/${article.slug}`);
  return { ok: true, id: article.id };
}

export async function updateArticle(id: string, data: ArticleFormData): Promise<{ ok: boolean; error?: string }> {
  if (!data.title?.trim()) return { ok: false, error: 'タイトルは必須です' };
  if (!data.slug?.trim()) return { ok: false, error: 'スラッグは必須です' };
  if (!data.seoDescription?.trim()) return { ok: false, error: 'SEO説明は必須です' };
  if (!data.authorId?.trim()) return { ok: false, error: '著者を選択してください' };

  const slugExists = await prisma.article.findFirst({ where: { slug: data.slug, id: { not: id } } });
  if (slugExists) return { ok: false, error: 'このスラッグは既に使用されています' };

  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: '記事が見つかりません' };

  let publishedAt = existing.publishedAt;
  if (data.status === 'published' && !existing.publishedAt) publishedAt = new Date();
  else if (data.status === 'scheduled' && data.publishedAt) publishedAt = new Date(data.publishedAt);
  else if (data.status === 'draft') publishedAt = null;

  await prisma.article.update({
    where: { id },
    data: {
      title: data.title.trim(),
      slug: data.slug.trim(),
      excerpt: data.excerpt.trim() || null,
      content: data.content.trim() || '',
      status: data.status as 'draft' | 'scheduled' | 'published',
      publishedAt,
      category: data.category.trim() || null,
      tags: data.tags.trim() ? data.tags.trim() : null,
      seoTitle: data.seoTitle.trim() || null,
      seoDescription: data.seoDescription.trim(),
      ogImageUrl: data.ogImageUrl.trim() || null,
      authorId: data.authorId,
      faq: data.faq.trim() ? data.faq.trim() : null,
      references: data.references.trim() ? data.references.trim() : null,
    },
  });
  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath('/career-guide');
  revalidatePath(`/articles/${data.slug}`);
  return { ok: true };
}
