'use client';

import { useState } from 'react';

export function CsvImportForm() {
  const [csv, setCsv] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/monitor/pages/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');
      setStatus('ok');
      setMessage(`登録: ${data.imported ?? 0} 件`);
      setCsv('');
      window.location.reload();
    } catch (err) {
      setStatus('err');
      setMessage(err instanceof Error ? err.message : 'エラー');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">CSVインポート（universityName, url, area）</label>
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder="大学名,https://...,関東"
          rows={3}
          className="w-96 border border-stone-300 rounded px-3 py-2 text-sm font-mono"
        />
      </div>
      <button type="submit" disabled={status === 'loading'} className="px-4 py-2 bg-stone-700 text-white rounded hover:bg-stone-800 disabled:opacity-50">
        インポート
      </button>
      {message && <span className={status === 'err' ? 'text-red-600' : 'text-stone-600'}>{message}</span>}
    </form>
  );
}
