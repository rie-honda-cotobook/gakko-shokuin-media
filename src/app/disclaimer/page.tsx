import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata = {
  title: '免責事項',
  description: '大学職員転職.comの免責事項です。',
};

export default function DisclaimerPage() {
  const items = [{ label: '免責事項', href: undefined }];
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs items={items} />
      <h1 className="text-2xl font-bold text-stone-900 mb-6">免責事項</h1>
      <div className="prose-article text-stone-700 space-y-4">
        <p>当サイトの情報は、可能な限り正確な内容を心がけていますが、制度・採用状況の変更等により、掲載時と異なる場合があります。</p>
        <p>求人情報は各機関の公式採用ページへの誘導を目的としており、応募手続き・選考・採用の一切は各機関が行います。当サイトは採用の結果について責任を負いかねます。</p>
        <p>記事の内容に基づいて行われた行動により生じた損害について、当サイトは一切の責任を負いません。</p>
      </div>
    </div>
  );
}
