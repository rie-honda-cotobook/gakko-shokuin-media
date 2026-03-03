'use client';

import { useState } from 'react';

export function ReviewCompleteForm({
  eventId,
  pageId,
  pageUrl,
  universityName,
  token,
}: {
  eventId: string;
  pageId: string;
  pageUrl: string;
  universityName: string;
  token: string;
}) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const base = typeof window !== 'undefined' ? window.location.origin : '';

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/monitor/events/${eventId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (res.ok) setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow p-6 max-w-md">
          <h1 className="text-xl font-bold text-stone-900 mb-2">確認済みにしました</h1>
          <p className="text-stone-600 text-sm mb-6">{universityName} の更新を確認済みとして記録しました。</p>
          <div className="flex flex-col gap-3">
            <a
              href={`/admin/monitor-events?eventId=${eventId}`}
              className="block w-full text-center bg-accent text-white py-2 rounded font-medium hover:bg-accent-dark"
            >
              イベント一覧で見る
            </a>
            <a
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center border border-stone-300 py-2 rounded font-medium hover:bg-stone-50"
            >
              採用ページを開く
            </a>
            <a
              href={`/admin/monitor-pages/${pageId}/edit`}
              className="block w-full text-center border border-stone-300 py-2 rounded font-medium hover:bg-stone-50"
            >
              監視ページを編集
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <h1 className="text-xl font-bold text-stone-900 mb-2">確認済みにする</h1>
        <p className="text-stone-600 text-sm mb-4">
          「{universityName}」の採用ページ更新を検知しました。このリンクはログイン不要で、1クリックで「確認済み」にできます。
        </p>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-accent text-white py-3 rounded font-semibold hover:bg-accent-dark disabled:opacity-50"
        >
          {loading ? '処理中...' : '確認済みにする'}
        </button>
      </div>
    </div>
  );
}
