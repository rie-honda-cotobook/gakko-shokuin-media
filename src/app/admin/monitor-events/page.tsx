import Link from 'next/link';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { EventsTable } from './EventsTable';

export const dynamic = 'force-dynamic';

const CHANGE_LABELS: Record<string, string> = {
  ETAG: 'ETag',
  LAST_MODIFIED: 'Last-Modified',
  CONTENT_HASH: '本文',
  STATUS_CHANGE: 'ステータス',
};

type Props = { searchParams: Promise<{ eventId?: string; unreviewed?: string }> };

export default async function MonitorEventsPage({ searchParams }: Props) {
  const { eventId, unreviewed } = await searchParams;
  const where = unreviewed === '1' ? { isReviewed: false } : {};
  const events = await prisma.monitorEvent.findMany({
    where,
    orderBy: { detectedAt: 'desc' },
    take: 100,
    include: { page: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">監視イベント一覧</h1>
        <div className="flex gap-2">
          {unreviewed !== '1' ? (
            <Link href="/admin/monitor-events?unreviewed=1" className="px-4 py-2 border border-stone-300 rounded hover:bg-stone-50">
              未確認のみ
            </Link>
          ) : (
            <Link href="/admin/monitor-events" className="px-4 py-2 border border-stone-300 rounded hover:bg-stone-50">
              すべて
            </Link>
          )}
        </div>
      </div>

      <EventsTable
        events={events.map((e) => ({
          id: e.id,
          pageId: e.pageId,
          universityName: e.page.universityName,
          url: e.page.url,
          changeType: CHANGE_LABELS[e.changeType] || e.changeType,
          detectedAt: e.detectedAt,
          isReviewed: e.isReviewed,
          statusCode: e.statusCode,
        }))}
        highlightEventId={eventId ?? undefined}
      />
    </div>
  );
}
