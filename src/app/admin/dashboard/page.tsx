import Link from 'next/link';
import { getMonitorDashboardStats } from '@/lib/repositories/monitor';

export const dynamic = 'force-dynamic';

export default async function MonitorDashboardPage() {
  const { events24h, unreviewedCount, errorPages } = await getMonitorDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">監視ダッシュボード</h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-sm text-stone-500">直近24時間の検知</p>
          <p className="text-2xl font-bold text-stone-900">{events24h} 件</p>
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-sm text-stone-500">未確認イベント</p>
          <p className="text-2xl font-bold text-stone-900">{unreviewedCount} 件</p>
          {unreviewedCount > 0 && (
            <Link href="/admin/monitor-events?unreviewed=1" className="text-sm text-accent hover:underline mt-2 inline-block">
              一覧へ →
            </Link>
          )}
        </div>
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-sm text-stone-500">エラー多発ページ</p>
          <p className="text-2xl font-bold text-stone-900">{errorPages.length} 件</p>
        </div>
      </div>

      {errorPages.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-stone-900 mb-4">エラーが多発しているページ</h2>
          <ul className="bg-white rounded border border-stone-200 divide-y">
            {errorPages.map((p) => (
              <li key={p.id} className="p-4 flex items-center justify-between">
                <div>
                  <span className="font-medium text-stone-900">{p.universityName}</span>
                  <span className="text-amber-600 font-medium ml-2">連続エラー {p.consecutiveErrors} 回</span>
                  <p className="text-sm text-stone-500 truncate max-w-md">{p.url}</p>
                </div>
                <Link href={`/admin/monitor-pages/${p.id}/edit`} className="text-accent text-sm hover:underline">
                  編集
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex gap-4">
        <Link href="/admin/monitor-pages" className="text-accent font-medium hover:underline">監視URL一覧 →</Link>
        <Link href="/admin/monitor-events" className="text-accent font-medium hover:underline">イベント一覧 →</Link>
      </div>
    </div>
  );
}
