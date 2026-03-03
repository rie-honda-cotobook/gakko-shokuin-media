import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ArticleForm } from '../ArticleForm';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  const authors = await prisma.author.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/articles" className="text-stone-600 hover:text-stone-900">← 記事一覧</Link>
        <h1 className="text-2xl font-bold text-stone-900">新規記事</h1>
      </div>
      <ArticleForm authors={authors} />
    </div>
  );
}
