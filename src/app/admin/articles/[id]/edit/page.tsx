import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ArticleForm } from '../../ArticleForm';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { author: true },
  });
  if (!article) notFound();

  const authors = await prisma.author.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  const initial = {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    content: article.content,
    status: article.status,
    publishedAt: article.publishedAt ? format(new Date(article.publishedAt), "yyyy-MM-dd'T'HH:mm") : '',
    category: article.category || '',
    tags: article.tags || '',
    seoTitle: article.seoTitle || '',
    seoDescription: article.seoDescription,
    ogImageUrl: article.ogImageUrl || '',
    authorId: article.authorId,
    faq: article.faq || '[]',
    references: article.references || '[]',
    externalUrl: article.externalUrl || '',
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/articles" className="text-stone-600 hover:text-stone-900">← 記事一覧</Link>
        <h1 className="text-2xl font-bold text-stone-900">編集: {article.title}</h1>
      </div>
      <ArticleForm authors={authors} articleId={id} initial={initial} />
    </div>
  );
}
