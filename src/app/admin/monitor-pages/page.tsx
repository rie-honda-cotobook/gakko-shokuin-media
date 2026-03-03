import Link from 'next/link';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CsvImportForm } from './CsvImportForm';

export const dynamic = 'force-dynamic';

export default async function MonitorPagesPage() {
  const pages = await prisma.monitorPage.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: { select: { events: true } },
      events: { orderBy: { detectedAt: 'desc' }, take: 1, select: { id: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">監視URL一覧</h1>
        <div className="flex gap-2">
          <Link href="/admin/monitor-pages/new" className="bg-accent text-white px-4 py-2 rounded font-medium hover:bg-accent-dark">
            追加
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <CsvImportForm />
      </div>

      <div className="bg-white rounded border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="text-left p-3 font-medium">大学名</th>
              <th className="text-left p-3 font-medium">URL</th>
              <th className="text-left p-3 font-medium">エリア</th>
              <th className="text-left p-3 font-medium">状態</th>
              <th className="text-left p-3 font-medium">最終確認</th>
              <th className="text-left p-3 font-medium">エラー</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr
                key={p.id}
                className={`border-t border-stone-100 ${p.consecutiveErrors >= 3 ? 'bg-amber-50' : ''}`}
              >
                <td className="p-3 font-medium">{p.universityName}</td>
                <td className="p-3 max-w-xs truncate" title={p.url}>{p.url}</td>
                <td className="p-3 text-stone-500">{p.area ?? '-'}</td>
                <td className="p-3">{p.isActive ? '有効' : '停止'}</td>
                <td className="p-3 text-stone-500">
                  {p.lastCheckedAt ? format(new Date(p.lastCheckedAt), 'yyyy/M/d H:mm', { locale: ja }) : '-'}
                </td>
                <td className="p-3">{p.consecutiveErrors >= 3 ? <span className="text-amber-700 font-medium">{p.consecutiveErrors}回</span> : p.consecutiveErrors}</td>
                <td className="p-3 space-x-2">
                  {p.events[0] && (
                    <Link href={`/admin/monitor-events?eventId=${p.events[0].id}`} className="text-accent hover:underline">最新</Link>
                  )}
                  <Link href={`/admin/monitor-pages/${p.id}/edit`} className="text-accent hover:underline">編集</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
