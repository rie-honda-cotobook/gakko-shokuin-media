import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { MonitorPageForm } from '../../MonitorPageForm';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function EditMonitorPagePage({ params }: Props) {
  const { id } = await params;
  const page = await prisma.monitorPage.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/monitor-pages" className="text-stone-600 hover:text-stone-900">← 一覧</Link>
        <h1 className="text-2xl font-bold text-stone-900">編集: {page.universityName}</h1>
      </div>
      <MonitorPageForm
        pageId={page.id}
        initial={{
          universityName: page.universityName,
          url: page.url,
          area: page.area ?? '',
          isActive: page.isActive,
          checkIntervalHours: page.checkIntervalHours,
          notes: page.notes ?? '',
        }}
      />
    </div>
  );
}
