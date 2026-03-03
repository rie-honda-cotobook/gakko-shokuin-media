import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata = {
  title: '利用規約',
  description: '大学職員転職.comの利用規約です。',
};

export default function TermsPage() {
  const items = [{ label: '利用規約', href: undefined }];
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs items={items} />
      <h1 className="text-2xl font-bold text-stone-900 mb-6">利用規約</h1>
      <div className="prose-article text-stone-700 space-y-4">
        <p>本サイトのご利用にあたり、以下の事項にご了承ください。</p>
        <ul className="list-disc pl-6">
          <li>当サイトのコンテンツは情報提供を目的としており、採用の可否等を保証するものではありません。</li>
          <li>求人情報は公式発表に基づいて掲載していますが、内容の正確性について保証するものではありません。</li>
          <li>記事の無断転載・複製を禁じます。</li>
        </ul>
      </div>
    </div>
  );
}
