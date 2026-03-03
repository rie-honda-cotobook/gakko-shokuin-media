'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  pageId?: string;
  initial?: {
    universityName: string;
    url: string;
    area: string;
    isActive: boolean;
    checkIntervalHours: number;
    notes: string;
  };
};

export function MonitorPageForm({ pageId, initial }: Props) {
  const router = useRouter();
  const [universityName, setUniversityName] = useState(initial?.universityName ?? '');
  const [url, setUrl] = useState(initial?.url ?? '');
  const [area, setArea] = useState(initial?.area ?? '');
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [checkIntervalHours, setCheckIntervalHours] = useState(initial?.checkIntervalHours ?? 24);
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = { universityName, url, area: area || undefined, isActive, checkIntervalHours, notes: notes || undefined };
      const res = pageId
        ? await fetch(`/api/monitor/pages/${pageId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/monitor/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push('/admin/monitor-pages');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">大学名 *</label>
        <input value={universityName} onChange={(e) => setUniversityName(e.target.value)} required className="w-full border border-stone-300 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">URL *</label>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required className="w-full border border-stone-300 rounded px-3 py-2" disabled={!!pageId} />
        {pageId && <p className="text-xs text-stone-500 mt-1">URLは変更できません</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">エリア</label>
        <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="関東/東京" className="w-full border border-stone-300 rounded px-3 py-2" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <label htmlFor="isActive">有効</label>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">チェック間隔（時間）</label>
        <input type="number" min={1} max={168} value={checkIntervalHours} onChange={(e) => setCheckIntervalHours(Number(e.target.value))} className="w-24 border border-stone-300 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">メモ</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full border border-stone-300 rounded px-3 py-2" />
      </div>
      <button type="submit" disabled={loading} className="px-6 py-2 bg-accent text-white rounded font-medium hover:bg-accent-dark disabled:opacity-50">
        保存
      </button>
    </form>
  );
}
