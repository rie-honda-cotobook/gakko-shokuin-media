import Link from 'next/link';
import { unstable_noStore } from 'next/cache';
import { getJobs } from '@/lib/repositories/job';
import { Breadcrumbs, BreadcrumbJsonLd } from '@/components/Breadcrumbs';
import { JobsFilter } from './JobsFilter';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '求人一覧',
  description: '大学職員求人一覧。詳細は各公式採用ページをご確認ください。',
};

type Props = { searchParams: Promise<{ area?: string; page?: string }> };

export default async function JobsPage({ searchParams }: Props) {
  unstable_noStore();
  const params = await searchParams;
  const area = params.area;
  const page = Number(params.page) || 1;
  const { items, totalPages, total, areaList } = await getJobs({ page, area });

  const breadcrumbs = [{ label: '求人一覧', href: undefined }];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="text-2xl font-bold text-stone-900 mb-1 tracking-tight">求人一覧</h1>
      <p className="text-stone-600 font-medium mb-1">大学職員求人一覧</p>
      <p className="text-stone-600 mb-1">詳細は各公式採用ページをご確認ください。</p>
      <p className="text-sm text-stone-500 mb-6">（更新日が新しい順で表示）</p>

      <JobsFilter areaList={areaList} currentArea={area} />

      <ul className="space-y-4 mt-8">
        {items.map((job) => {
          const schoolNameDisplay = job.schoolName.replace('エリア', '');
          return (
            <li key={job.id} className="rounded-xl border border-stone-200/80 bg-white p-5 shadow-card hover:shadow-card-hover hover:border-stone-300/80 transition-all duration-200">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded w-fit">{job.area}</p>
                  <p className="text-lg font-semibold text-stone-900">{schoolNameDisplay}</p>
                  <a
                    href={job.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-accent font-medium hover:underline break-all"
                  >
                    {job.officialUrl}
                  </a>
                  <p className="text-sm text-stone-500 mt-2">
                    更新日：{format(new Date(job.updatedAt), 'yyyy年M月d日', { locale: ja })}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <nav className="flex justify-center gap-2 mt-8" aria-label="ページネーション">
          {page > 1 && (
            <Link
              href={page === 2 ? (area ? `/jobs?area=${area}` : '/jobs') : `/jobs?page=${page - 1}${area ? `&area=${area}` : ''}`}
              className="px-4 py-2 border border-stone-200 rounded hover:bg-stone-50"
            >
              前へ
            </Link>
          )}
          <span className="px-4 py-2 text-stone-600">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/jobs?page=${page + 1}${area ? `&area=${area}` : ''}`}
              className="px-4 py-2 border border-stone-200 rounded hover:bg-stone-50"
            >
              次へ
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
