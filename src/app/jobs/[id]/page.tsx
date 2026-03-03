import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJobById } from '@/lib/repositories/job';
import { Breadcrumbs, BreadcrumbJsonLd } from '@/components/Breadcrumbs';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) return { title: '求人が見つかりません' };
  const schoolNameDisplay = job.schoolName.replace('エリア', '');
  return {
    title: `${job.title}｜${schoolNameDisplay}`,
    description: job.summary || `${job.area}の学校職員求人。詳細は公式ページをご確認ください。`,
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const schoolNameDisplay = job.schoolName.replace('エリア', '');
  const breadcrumbs = [
    { label: '求人一覧', href: '/jobs' },
    { label: `${job.title}（${schoolNameDisplay}）`, href: undefined },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <Breadcrumbs items={breadcrumbs} />

      <article>
        <h1 className="text-2xl font-bold text-stone-900 mb-4">{job.title}</h1>
        <dl className="grid gap-2 text-stone-600 mb-6">
          <div>
            <dt className="text-sm text-stone-500">勤務先</dt>
            <dd>{schoolNameDisplay}</dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">都道府県</dt>
            <dd>{job.area}</dd>
          </div>
          {job.employmentType && (
            <div>
              <dt className="text-sm text-stone-500">雇用形態</dt>
              <dd>{job.employmentType}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm text-stone-500">更新日</dt>
            <dd>{format(new Date(job.updatedAt), 'yyyy年M月d日', { locale: ja })}</dd>
          </div>
        </dl>
        {job.summary && <p className="text-stone-700 mb-6">{job.summary}</p>}

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mb-6">
          <p className="text-sm text-amber-900">
            本ページは求人情報の紹介です。応募・詳細は必ず<strong>公式採用サイト</strong>でご確認ください。
          </p>
        </div>

        <a
          href={job.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-accent text-white px-6 py-3 rounded-xl font-semibold shadow-soft hover:bg-accent-dark hover:shadow-card-hover transition-all"
        >
          公式採用ページへ
        </a>
      </article>
    </div>
  );
}
