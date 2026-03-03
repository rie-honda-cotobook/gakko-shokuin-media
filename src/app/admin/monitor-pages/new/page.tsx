import Link from 'next/link';
import { MonitorPageForm } from '../MonitorPageForm';

export const dynamic = 'force-dynamic';

export default function NewMonitorPagePage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/monitor-pages" className="text-stone-600 hover:text-stone-900">← 一覧</Link>
        <h1 className="text-2xl font-bold text-stone-900">監視URLを追加</h1>
      </div>
      <MonitorPageForm />
    </div>
  );
}
