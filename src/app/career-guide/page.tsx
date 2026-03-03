import Link from 'next/link';
import { getArticlesByCategory } from '@/lib/repositories/article';
import { Breadcrumbs, BreadcrumbJsonLd } from '@/components/Breadcrumbs';

export const dynamic = 'force-dynamic';

const CATEGORIES = [
  { key: '基礎知識', label: '基礎知識' },
  { key: '仕事内容', label: '仕事内容' },
  { key: '就職・転職', label: '就職・転職' },
  { key: '試験対策', label: '試験対策' },
  { key: '待遇・キャリア', label: '待遇・キャリア' },
];

export const metadata = {
  title: '対策ガイド（キャリアガイド）',
  description: '学校職員・大学職員を目指す方のための対策ガイド。採用の流れ、試験対策、仕事内容をカテゴリ別にまとめています。',
};

export default async function CareerGuidePage() {
  const byCategory = await Promise.all(
    CATEGORIES.map(async (c) => {
      const articles = await getArticlesByCategory(c.key);
      return { ...c, articles };
    })
  );

  const breadcrumbs = [{ label: '対策ガイド', href: undefined }];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="text-2xl font-bold text-stone-900 mb-2">対策ガイド（キャリアガイド）</h1>
      <p className="text-stone-600 mb-10">
        学校職員・大学職員を目指す方のための主要記事をカテゴリ別にまとめました。まずはここから読むと全体像がつかめます。
      </p>

      <div className="space-y-10">
        {byCategory.map(({ key, label, articles }) => (
          <section key={key}>
            <h2 id={key} className="text-xl font-semibold text-stone-900 mb-4">{label}</h2>
            <ul className="space-y-2">
              {articles.map((a) => (
                <li key={a.id}>
                  <Link href={`/articles/${a.slug}`} className="text-rose-800 hover:underline">
                    {a.title}
                  </Link>
                </li>
              ))}
              {articles.length === 0 && <li className="text-stone-500">該当記事はありません</li>}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
