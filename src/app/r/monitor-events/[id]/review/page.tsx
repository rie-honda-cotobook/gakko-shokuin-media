import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifyReviewToken } from '@/lib/monitor/token';
import { REVIEW_TOKEN_EXPIRY_DAYS } from '@/lib/monitor/types';
import { ReviewCompleteForm } from './ReviewCompleteForm';

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ token?: string }> };

export default async function ReviewPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { token } = await searchParams;
  if (!token) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow p-6 max-w-md text-center">
          <h1 className="text-xl font-bold text-stone-900 mb-2">リンクが無効です</h1>
          <p className="text-stone-600 text-sm">トークンが含まれていません。Slackの「確認済みにする」リンクからアクセスしてください。</p>
        </div>
      </div>
    );
  }

  const ev = await prisma.monitorEvent.findUnique({
    where: { id },
    include: { page: true },
  });
  if (!ev) notFound();

  if (ev.isReviewed) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow p-6 max-w-md text-center">
          <h1 className="text-xl font-bold text-stone-900 mb-2">すでに確認済みです</h1>
          <p className="text-stone-600 text-sm mb-4">このイベントはすでに「確認済み」になっています。</p>
          <Link href="/admin/monitor-events" className="text-accent font-medium hover:underline">イベント一覧へ</Link>
        </div>
      </div>
    );
  }

  const expiry = new Date(ev.detectedAt);
  expiry.setDate(expiry.getDate() + REVIEW_TOKEN_EXPIRY_DAYS);
  if (new Date() > expiry) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow p-6 max-w-md text-center">
          <h1 className="text-xl font-bold text-stone-900 mb-2">リンクの有効期限が切れています</h1>
          <p className="text-stone-600 text-sm mb-4">確認リンクは検知から{REVIEW_TOKEN_EXPIRY_DAYS}日間有効です。管理画面から確認済みにしてください。</p>
          <Link href="/admin/monitor-events" className="text-accent font-medium hover:underline">イベント一覧へ</Link>
        </div>
      </div>
    );
  }

  if (!verifyReviewToken(token, ev.reviewTokenHash)) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow p-6 max-w-md text-center">
          <h1 className="text-xl font-bold text-stone-900 mb-2">リンクが無効です</h1>
          <p className="text-stone-600 text-sm">トークンが一致しません。Slackの通知に含まれるリンクをそのままお使いください。</p>
        </div>
      </div>
    );
  }

  return <ReviewCompleteForm eventId={id} pageId={ev.pageId} pageUrl={ev.page.url} universityName={ev.page.universityName} token={token} />;
}
