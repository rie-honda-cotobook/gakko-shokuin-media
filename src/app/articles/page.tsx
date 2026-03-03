import Link from 'next/link';
import { getPublishedArticles } from '@/lib/repositories/article';
import { Breadcrumbs, BreadcrumbJsonLd } from '@/components/Breadcrumbs';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '記事一覧',
  description: '学校職員・大学職員の仕事内容、試験対策、転職のポイントなどの記事一覧。',
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function ArticlesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { items, totalPages, total } = await getPublishedArticles({ page });

  const breadcrumbs = [{ label: '記事一覧', href: undefined }];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="text-2xl font-bold text-stone-900 mb-1 tracking-tight">記事一覧</h1>
      <p className="text-stone-600 mb-8">全 {total} 件</p>

      <ul className="space-y-4">
        {items.map((a) => (
          <li key={a.id}>
            <Link
              href={`/articles/${a.slug}`}
              className="group flex gap-4 rounded-xl p-5 bg-white border border-stone-200/80 shadow-card hover:shadow-card-hover hover:border-stone-300/80 transition-all duration-200"
            >
              <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0">
                <img
                  src={a.ogImageUrl || '/hero-campus.png'}
                  alt={a.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-semibold text-stone-900 group-hover:text-accent transition-colors line-clamp-2">
                  {a.title}
                </h2>
                {a.excerpt && <p className="text-stone-600 mt-2 text-sm line-clamp-2">{a.excerpt}</p>}
                <p className="text-sm text-stone-500 mt-2">
                  {a.publishedAt && format(new Date(a.publishedAt), 'yyyy年M月d日', { locale: ja })}
                  {a.author?.name && ` · ${a.author.name}`}
                  {a.category && ` · ${a.category}`}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <nav className="flex justify-center gap-2 mt-10" aria-label="ページネーション">
          {page > 1 && (
            <Link
              href={page === 2 ? '/articles' : `/articles?page=${page - 1}`}
              className="px-4 py-2 border border-stone-200 rounded hover:bg-stone-50"
            >
              前へ
            </Link>
          )}
          <span className="px-4 py-2 text-stone-600">{page} / {totalPages}</span>
          {page < totalPages && (
            <Link href={`/articles?page=${page + 1}`} className="px-4 py-2 border border-stone-200 rounded hover:bg-stone-50">
              次へ
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
