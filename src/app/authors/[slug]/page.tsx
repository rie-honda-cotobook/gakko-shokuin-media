import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAuthorBySlug } from '@/lib/repositories/author';
import { Breadcrumbs, BreadcrumbJsonLd } from '@/components/Breadcrumbs';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: '著者が見つかりません' };
  return {
    title: author.name,
    description: author.bio || author.role,
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const breadcrumbs = [
    { label: '監修者一覧', href: '/authors' },
    { label: author.name, href: undefined },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex gap-6 mb-10">
        {author.avatarUrl && (
          <img
            src={author.avatarUrl}
            alt=""
            className="w-24 h-24 rounded-full object-cover shrink-0"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{author.name}</h1>
          <p className="text-stone-600 mt-1">{author.role}</p>
          {author.isSupervisor && <span className="text-sm text-stone-500">監修者</span>}
          {author.bio && <p className="mt-4 text-stone-600">{author.bio}</p>}
          {author.credentials && (
            <p className="mt-2 text-sm text-stone-500">{author.credentials}</p>
          )}
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-stone-900 mb-4">執筆記事</h2>
        <ul className="space-y-2">
          {author.articles.map((a) => (
            <li key={a.id}>
              <Link href={`/articles/${a.slug}`} className="text-rose-800 hover:underline">
                {a.title}
              </Link>
              <span className="text-sm text-stone-500 ml-2">
                {a.publishedAt && format(new Date(a.publishedAt), 'yyyy/M/d', { locale: ja })}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
