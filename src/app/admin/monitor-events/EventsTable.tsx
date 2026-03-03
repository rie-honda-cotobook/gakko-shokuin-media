'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

type Row = {
  id: string;
  pageId: string;
  universityName: string;
  url: string;
  changeType: string;
  detectedAt: Date;
  isReviewed: boolean;
  statusCode: number | null;
};

export function EventsTable({ events, highlightEventId }: { events: Row[]; highlightEventId?: string }) {
  const [marking, setMarking] = useState<string | null>(null);

  async function markReviewed(id: string) {
    setMarking(id);
    try {
      const res = await fetch(`/api/monitor/events/${id}/review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      if (res.ok) window.location.reload();
    } finally {
      setMarking(null);
    }
  }

  return (
    <div className="bg-white rounded border border-stone-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-stone-50">
          <tr>
            <th className="text-left p-3 font-medium">大学名</th>
            <th className="text-left p-3 font-medium">種別</th>
            <th className="text-left p-3 font-medium">検知日時</th>
            <th className="text-left p-3 font-medium">確認</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr
              key={e.id}
              id={e.id === highlightEventId ? 'event-row' : undefined}
              className={`border-t border-stone-100 ${e.id === highlightEventId ? 'bg-accent/10' : ''} ${!e.isReviewed ? 'font-medium' : ''}`}
            >
              <td className="p-3">{e.universityName}</td>
              <td className="p-3">{e.changeType}{e.statusCode != null ? ` (${e.statusCode})` : ''}</td>
              <td className="p-3 text-stone-600">{format(new Date(e.detectedAt), 'yyyy/M/d H:mm', { locale: ja })}</td>
              <td className="p-3">{e.isReviewed ? '済' : '未'}</td>
              <td className="p-3 space-x-2">
                <Link href={e.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">URL</Link>
                <Link href={`/admin/monitor-pages/${e.pageId}/edit`} className="text-accent hover:underline">編集</Link>
                {!e.isReviewed && (
                  <button
                    type="button"
                    onClick={() => markReviewed(e.id)}
                    disabled={marking === e.id}
                    className="text-accent hover:underline disabled:opacity-50"
                  >
                    {marking === e.id ? '...' : '確認済み'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {events.length === 0 && <p className="p-6 text-stone-500">イベントはありません</p>}
    </div>
  );
}
