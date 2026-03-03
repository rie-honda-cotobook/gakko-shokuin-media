import Link from 'next/link';
import { getDashboardStats } from '@/lib/repositories/admin';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { publishedThisMonth, drafts, scheduled, recentPublished } = await getDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">ダッシュボード</h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-sm text-stone-500">今月の公開記事</p>
          <p className="text-2xl font-bold text-stone-900">{publishedThisMonth} 本</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-sm text-stone-500">下書き</p>
          <p className="text-2xl font-bold text-stone-900">{drafts} 件</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-sm text-stone-500">公開予約</p>
          <p className="text-2xl font-bold text-stone-900">{scheduled} 件</p>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-stone-900 mb-4">直近の公開記事</h2>
        <ul className="space-y-2">
          {recentPublished.map((a) => (
            <li key={a.id} className="flex items-center gap-4">
              <Link href={`/articles/${a.slug}`} className="text-rose-800 hover:underline flex-1">
                {a.title}
              </Link>
              <span className="text-sm text-stone-500">
                {a.publishedAt && format(new Date(a.publishedAt), 'yyyy/M/d', { locale: ja })}
              </span>
              <Link href={`/admin/articles/${a.id}/edit`} className="text-sm text-stone-600 hover:underline">
                編集
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
