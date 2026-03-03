import Link from 'next/link';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ q?: string }> };

export default async function AdminArticlesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const where = q
    ? { title: { contains: q } }
    : {};
  const articles = await prisma.article.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: { author: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">記事一覧</h1>
        <Link
          href="/admin/articles/new"
          className="bg-rose-800 text-white px-4 py-2 rounded font-medium hover:bg-rose-900"
        >
          新規作成
        </Link>
      </div>

      <form method="get" className="mb-6 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="タイトルで検索"
          className="border border-stone-300 rounded px-3 py-2 w-64"
        />
        <button type="submit" className="bg-stone-200 text-stone-800 px-4 py-2 rounded hover:bg-stone-300">
          検索
        </button>
      </form>

      <div className="bg-white rounded border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="text-left p-3 font-medium">タイトル</th>
              <th className="text-left p-3 font-medium">ステータス</th>
              <th className="text-left p-3 font-medium">著者</th>
              <th className="text-left p-3 font-medium">更新日</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-t border-stone-100">
                <td className="p-3">{a.title}</td>
                <td className="p-3">
                  <span className={a.status === 'published' ? 'text-green-600' : a.status === 'scheduled' ? 'text-amber-600' : 'text-stone-500'}>
                    {a.status === 'published' ? '公開' : a.status === 'scheduled' ? '予約' : '下書き'}
                  </span>
                </td>
                <td className="p-3">{a.author.name}</td>
                <td className="p-3 text-stone-500">{format(new Date(a.updatedAt), 'yyyy/M/d', { locale: ja })}</td>
                <td className="p-3">
                  <Link href={`/admin/articles/${a.id}/edit`} className="text-rose-800 hover:underline">編集</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
