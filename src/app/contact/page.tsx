import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata = {
  title: 'お問い合わせ',
  description: '大学職員転職.comへのお問い合わせはこちらから。',
};

export default function ContactPage() {
  const items = [{ label: 'お問い合わせ', href: undefined }];
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs items={items} />
      <h1 className="text-2xl font-bold text-stone-900 mb-6">お問い合わせ</h1>
      <div className="prose-article text-stone-700 space-y-4">
        <p>お問い合わせは、以下のメールアドレスまでお送りください。</p>
        <p><strong>メール：</strong> contact@example.com（※サンプルです。実際の運用時にご設定ください）</p>
        <p>求人に関する個別のご質問は、各採用機関へ直接お問い合わせください。</p>
      </div>
    </div>
  );
}
